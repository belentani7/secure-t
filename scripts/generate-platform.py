#!/usr/bin/env python3
"""
secure-t · Platform Catalog Generator
=====================================

Builds a world-class, Coursera/Harvard-style academic catalog from the
unified curriculum, and emits:

  - education/catalog.json          full catalog (tracks -> courses -> modules -> lessons)
  - server/data/catalog.ts          typed runtime loader
  - scripts/seed-catalog.sql        idempotent seed for the Postgres schema

References (structure only, no copied content):
  Coursera course anatomy, edX "About this course", Harvard CS50, MIT OCW,
  CyBOK, NIST NICE SP 800-181r1, OWASP Top 10 (+ LLM), NIST AI RMF.

Usage:
    python scripts/generate-platform.py
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UNIFIED = ROOT / "education" / "unified-curriculum.json"
OUT_CATALOG = ROOT / "education" / "catalog.json"
OUT_TS = ROOT / "server" / "data" / "catalog.ts"
OUT_SQL = ROOT / "scripts" / "seed-catalog.sql"

INSTITUTION = {
    "name": "secure T",
    "tagline": "Universidad digital de ciberseguridad e inteligencia artificial",
    "language": ["es", "pt-BR", "en"],
    "model": "evidence-based mastery, open source, privacy by design",
    "credential_kind": "verifiable certificate of completion",
}

TRACK_META = {
    "digital-literacy": ("Alfabetización Digital", "L0-L1", "Fundamentos para moverse con seguridad en el mundo digital."),
    "cyber-foundations": ("Ciberseguridad Fundamental", "L1-L3", "CIA, redes, criptografía, sistemas y gestión de riesgo."),
    "blue-team": ("SOC / Blue Team", "L2-L4", "Detección, respuesta, forense y threat intelligence."),
    "ai-foundations": ("IA desde Cero", "L0-L3", "De ML a seguridad y gobernanza de sistemas de IA."),
    "genai-applied": ("IA Generativa Aplicada", "L1-L4", "LLMs, agentes y su seguridad en producción."),
    "secure-web": ("Desarrollo Web Seguro", "L1-L4", "Full-stack con OWASP, cloud y DevSecOps."),
    "digital-career": ("Carrera Digital", "L0-L4", "Portfolio, entrevistas, certificaciones y freelance."),
}

# (code, title, subtitle, skills[]) per track — bespoke, Harvard/Coursera style.
COURSES = {
    "digital-literacy": [
        ("DL101", "Alfabetización Digital", "Cómo funciona Internet y cómo no caer en la red", ["Internet", "Buscadores", "Backups", "Contraseñas", "MFA"]),
        ("DL102", "Ciudadanía Digital y Privacidad", "Huella digital, phishing e ingeniería social", ["Privacidad", "Phishing", "Huella digital", "Reputación"]),
    ],
    "cyber-foundations": [
        ("CF101", "Fundamentos de Ciberseguridad", "CIA, modelos de amenaza y defensa en profundidad", ["CIA", "Threat modeling", "Hardening", "CVE/CVSS"]),
        ("CF102", "Redes y Protocolos Seguros", "IP, DNS, TLS, puertos y segmentación", ["TCP/IP", "DNS", "TLS", "Firewalls"]),
        ("CF103", "Criptografía Aplicada", "De AES y RSA a TLS y firma digital", ["AES", "RSA", "PKI", "Hashing"]),
        ("CF104", "Riesgo, Cumplimiento y Gobernanza", "ISO 27001, NIST CSF y gestión de riesgo", ["Risk management", "ISO 27001", "NIST CSF", "Auditoría"]),
    ],
    "blue-team": [
        ("BT201", "Operaciones SOC / Blue Team", "Triage, SIEM y detección de intrusos", ["SIEM", "Triage", "IOC", "MITRE ATT&CK"]),
        ("BT202", "Respuesta a Incidentes y Forense", "Del playbook al análisis forense", ["IR playbooks", "Forense", "Memoria", "Cadena de custodia"]),
        ("BT203", "Threat Intelligence", "TTPs, OSINT y caza de amenazas", ["CTI", "OSINT", "Hunting", "TTP"]),
    ],
    "ai-foundations": [
        ("AI101", "IA desde Cero", "ML, deep learning y LLMs explicados", ["ML", "Deep learning", "Embeddings", "RAG"]),
        ("AI102", "Seguridad de Sistemas de IA", "Ataques adversariales y defensas", ["Adversarial ML", "Data poisoning", "Model theft"]),
        ("AI103", "Gobernanza y Riesgo de IA", "NIST AI RMF aplicado", ["AI RMF", "Governance", "Ética", "Auditoría IA"]),
    ],
    "genai-applied": [
        ("GA301", "IA Generativa Aplicada", "Texto, imagen, audio, vídeo y código", ["Prompting", "Multimodal", "Workflows", "APIs"]),
        ("GA302", "Seguridad de LLM", "OWASP LLM Top 10 en producción", ["Prompt injection", "Guardrails", "Agency", "Supply chain"]),
        ("GA303", "Agentes y Automatización", "Tool use, RAG y orquestación", ["Agents", "Tool use", "RAG", "Observabilidad"]),
    ],
    "secure-web": [
        ("SW401", "Desarrollo Web Seguro", "HTML/CSS/JS/TS hasta backend", ["HTML/CSS", "TypeScript", "REST", "Git"]),
        ("SW402", "OWASP Top 10 en Práctica", "Explotación y mitigación guiada", ["Access control", "Injection", "SSRF", "Crypto failures"]),
        ("SW403", "Arquitectura y Cloud Seguro", "Contenedores, secretos y IaC", ["Docker", "Cloud", "Secrets", "IaC"]),
        ("SW404", "DevSecOps y CI/CD", "Pipeline seguro de extremo a extremo", ["CI/CD", "SAST/DAST", "Supply chain", "Testing"]),
    ],
    "digital-career": [
        ("DC501", "Carrera Digital y Portfolio", "CV, GitHub y marca profesional", ["CV", "GitHub", "LinkedIn", "Portfolio"]),
        ("DC502", "Entrevistas y Certificaciones", "Técnicas, inglés y credenciales", ["Entrevistas", "Inglés técnico", "Certificaciones"]),
    ],
}

LEVEL_WEEKS = {"L0-L1": 4, "L1-L3": 8, "L2-L4": 10, "L0-L3": 8, "L1-L4": 10, "L0-L4": 6}


def load_areas() -> dict:
    data = json.loads(UNIFIED.read_text(encoding="utf-8"))
    by_track: dict[str, list] = {}
    for a in data["knowledge_areas"]:
        by_track.setdefault(a["track"], []).append(a)
    return by_track


def lessons_for(module_title: str, course_code: str, idx: int) -> list:
    return [
        {"id": f"{course_code}-M{idx:02d}-T", "title": f"Teoría · {module_title}", "type": "theory", "minutes": 25,
         "objective": f"Comprender los fundamentos de {module_title}."},
        {"id": f"{course_code}-M{idx:02d}-P", "title": f"Práctica · {module_title}", "type": "practice", "minutes": 40,
         "objective": f"Aplicar {module_title} en un escenario guiado."},
        {"id": f"{course_code}-M{idx:02d}-L", "title": f"Laboratorio · {module_title}", "type": "lab", "minutes": 60,
         "objective": f"Ejecutar un laboratorio aislado sobre {module_title}."},
        {"id": f"{course_code}-M{idx:02d}-A", "title": f"Evaluación · {module_title}", "type": "assessment", "minutes": 20,
         "objective": f"Demostrar dominio de {module_title} mediante evidencia."},
    ]


def build() -> dict:
    areas = load_areas()
    tracks, courses = [], []

    for track_id, (title, level, desc) in TRACK_META.items():
        track_courses = COURSES[track_id]
        codes = [c[0] for c in track_courses]
        tracks.append({"id": track_id, "title": title, "level": level, "description": desc, "courses": codes})

        track_areas = areas.get(track_id, [])
        n = len(track_courses)

        for i, (code, ctitle, subtitle, skills) in enumerate(track_courses):
            # distribute knowledge areas of the track across its courses
            assigned = [a for j, a in enumerate(track_areas) if j % n == i]
            modules = []
            for m, area in enumerate(assigned, 1):
                modules.append({
                    "id": f"{code}-M{m:02d}",
                    "title": area["title"],
                    "source": area["source"],
                    "lessons": lessons_for(area["title"], code, m),
                })
            # guarantee at least 3 modules per course
            while len(modules) < 3:
                m = len(modules) + 1
                mod_title = f"{skills[(m - 1) % len(skills)]} en profundidad"
                modules.append({"id": f"{code}-M{m:02d}", "title": mod_title, "source": "secure-t",
                                "lessons": lessons_for(mod_title, code, m)})

            prereqs = [codes[i - 1]] if i > 0 else []
            courses.append({
                "code": code,
                "track": track_id,
                "title": ctitle,
                "subtitle": subtitle,
                "level": level,
                "weeks": LEVEL_WEEKS.get(level, 8),
                "hoursPerWeek": 4,
                "prerequisites": prereqs,
                "skills": skills,
                "credential": INSTITUTION["credential_kind"],
                "modules": modules,
            })

    return {
        "schema": "secure-t.catalog.v1",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "generator": "scripts/generate-platform.py",
        "institution": INSTITUTION,
        "tracks": tracks,
        "courses": courses,
        "stats": {
            "tracks": len(tracks),
            "courses": len(courses),
            "modules": sum(len(c["modules"]) for c in courses),
            "lessons": sum(len(m["lessons"]) for c in courses for m in c["modules"]),
        },
    }


TS_TEMPLATE = '''// AUTO-GENERATED by scripts/generate-platform.py — do not edit by hand.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export interface CatalogLesson {{ id: string; title: string; type: string; minutes: number; objective: string; }}
export interface CatalogModule {{ id: string; title: string; source: string; lessons: CatalogLesson[]; }}
export interface CatalogCourse {{
  code: string; track: string; title: string; subtitle: string; level: string;
  weeks: number; hoursPerWeek: number; prerequisites: string[]; skills: string[];
  credential: string; modules: CatalogModule[];
}}
export interface CatalogTrack {{ id: string; title: string; level: string; description: string; courses: string[]; }}
export interface Catalog {{
  schema: string; generatedAt: string;
  institution: Record<string, unknown>;
  tracks: CatalogTrack[]; courses: CatalogCourse[];
  stats: {{ tracks: number; courses: number; modules: number; lessons: number }};
}}

const here = dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(readFileSync(join(here, "..", "..", "education", "catalog.json"), "utf-8"));

export const CATALOG: Catalog = {{
  schema: raw.schema,
  generatedAt: raw.generated_at,
  institution: raw.institution,
  tracks: raw.tracks,
  courses: raw.courses,
  stats: raw.stats,
}};

export function getCourse(code: string): CatalogCourse | undefined {{
  return CATALOG.courses.find((c) => c.code === code);
}}

export function getTrack(id: string): CatalogTrack | undefined {{
  return CATALOG.tracks.find((t) => t.id === id);
}}
'''


def seed_sql(catalog: dict) -> str:
    esc = lambda s: s.replace("'", "''")
    lines = [
        "-- AUTO-GENERATED by scripts/generate-platform.py",
        "-- Idempotent seed for the secure-t Postgres schema (programs/courses/modules/lessons).",
        "BEGIN;",
        "",
    ]
    for t in catalog["tracks"]:
        lines.append(
            "INSERT INTO programs (code, title, credits, description) VALUES "
            f"('{esc(t['id'])}', '{esc(t['title'])}', 12, '{esc(t['description'])}') "
            "ON CONFLICT (code) DO NOTHING;"
        )
    lines.append("")
    for c in catalog["courses"]:
        year = {"L0-L1": 1, "L0-L3": 1, "L1-L3": 2, "L2-L4": 3, "L1-L4": 2, "L0-L4": 1}.get(c["level"], 1)
        lines.append(
            "INSERT INTO courses (program_id, code, title, credits, year, term) "
            f"SELECT p.id, '{esc(c['code'])}', '{esc(c['title'])}', 3, {year}, 'self-paced' "
            f"FROM programs p WHERE p.code = '{esc(c['track'])}' "
            "ON CONFLICT (code) DO NOTHING;"
        )
    lines.append("")
    for c in catalog["courses"]:
        for m in c["modules"]:
            lines.append(
                "INSERT INTO modules (course_id, title, \"order\") "
                f"SELECT c.id, '{esc(m['title'])}', {int(m['id'].split('M')[-1])} "
                f"FROM courses c WHERE c.code = '{esc(c['code'])}' "
                f"AND NOT EXISTS (SELECT 1 FROM modules mm WHERE mm.course_id = c.id AND mm.title = '{esc(m['title'])}');"
            )
            for l in m["lessons"]:
                lines.append(
                    "INSERT INTO module_lessons (module_id, title, content, type, \"order\", published) "
                    f"SELECT m.id, '{esc(l['title'])}', '{esc(l['objective'])}', '{esc(l['type'])}', "
                    f"{['theory', 'practice', 'lab', 'assessment'].index(l['type']) + 1}, true "
                    f"FROM modules m JOIN courses c ON c.id = m.course_id "
                    f"WHERE c.code = '{esc(c['code'])}' AND m.title = '{esc(m['title'])}' "
                    f"AND NOT EXISTS (SELECT 1 FROM module_lessons ml WHERE ml.module_id = m.id AND ml.title = '{esc(l['title'])}');"
                )
    lines += ["", "COMMIT;", ""]
    return "\n".join(lines)


def main() -> int:
    catalog = build()
    OUT_CATALOG.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    OUT_TS.write_text(TS_TEMPLATE.replace("{{", "{").replace("}}", "}"), encoding="utf-8")
    OUT_SQL.write_text(seed_sql(catalog), encoding="utf-8")
    s = catalog["stats"]
    print(f"[ok] catalog: {s['tracks']} tracks · {s['courses']} courses · {s['modules']} modules · {s['lessons']} lessons")
    print(f"[out] {OUT_CATALOG.relative_to(ROOT)}")
    print(f"[out] {OUT_TS.relative_to(ROOT)}")
    print(f"[out] {OUT_SQL.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
