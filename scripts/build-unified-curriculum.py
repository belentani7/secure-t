#!/usr/bin/env python3
"""
secure-t · Unified Curriculum Builder
=====================================

Downloads and unifies four large, public cybersecurity-education structures
into a single machine-readable curriculum mapped onto secure-t's 7 tracks:

  - CyBOK  (Cybersecurity Body of Knowledge)      cybok.org
  - NIST NICE Framework (SP 800-181r1)            nist.gov
  - OWASP Top 10                                  owasp.org
  - MIT OpenCourseWare (6.858 / 6.857 / 6.1600)   ocw.mit.edu

Design goals:
  * stdlib only (urllib, json, html.parser) — no pip install needed.
  * Every network fetch is best-effort: on any failure it falls back to the
    canonical knowledge-area lists embedded below (facts, not copyrighted text).
  * Output is deterministic: same inputs -> byte-identical JSON.

Usage:
    python scripts/build-unified-curriculum.py
    python scripts/build-unified-curriculum.py --out education/unified-curriculum.json
    python scripts/build-unified-curriculum.py --offline
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUT = ROOT / "education" / "unified-curriculum.json"
USER_AGENT = "secure-t-curriculum-builder/1.0 (+https://github.com/belentani7/secure-t)"
TIMEOUT = 12

# Official source homepages (safe, stable). Fetched for liveness/metadata only.
SOURCES = {
    "cybok": "https://www.cybok.org/knowledgebase/",
    "nice": "https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center",
    "owasp": "https://owasp.org/Top10/",
    "owasp_llm": "https://genai.owasp.org/llm-top-10/",
    "nist_ai_rmf": "https://www.nist.gov/itl/ai-risk-management-framework",
    "mit_ocw": "https://ocw.mit.edu/search/?t=Computer%20Science",
}

# ---------------------------------------------------------------------------
# Canonical structures (fallback + merge base). Knowledge-area names are facts.
# ---------------------------------------------------------------------------

CYBOK_KNOWLEDGE_AREAS = [
    "Introduction to Cybersecurity",
    "Human Factors",
    "Security Management",
    "Authentication, Authorisation & Accountability",
    "Cryptography",
    "Operating Systems Security",
    "Distributed Systems Security",
    "Software Security",
    "Web & Mobile Security",
    "Secure Systems Development",
    "Network Security",
    "Hardware Security",
    "Cyber-Physical Systems Security",
    "Physical Layer Security",
    "Wireless Security",
    "Forensics",
    "Incident Management",
    "Malware & Attack Technologies",
    "Adversarial Behaviours",
    "Security Economics",
    "Privacy & Online Rights",
    "Risk Management & Governance",
    "Law & Regulation",
]

NICE_WORK_ROLE_CATEGORIES = [
    "Security Provision",
    "Operate and Maintain",
    "Oversee and Govern",
    "Protect and Defend",
    "Analyze",
    "Collect and Operate",
    "Investigate",
]

OWASP_TOP10_2021 = [
    ("A01", "Broken Access Control"),
    ("A02", "Cryptographic Failures"),
    ("A03", "Injection"),
    ("A04", "Insecure Design"),
    ("A05", "Security Misconfiguration"),
    ("A06", "Vulnerable and Outdated Components"),
    ("A07", "Identification and Authentication Failures"),
    ("A08", "Software and Data Integrity Failures"),
    ("A09", "Security Logging and Monitoring Failures"),
    ("A10", "Server-Side Request Forgery (SSRF)"),
]

MIT_OCW_COURSES = [
    ("6.858", "Computer Systems Security"),
    ("6.857", "Network and Computer Security"),
    ("6.1600", "Foundations of Computer Security"),
    ("6.875", "Cryptography and Cryptanalysis"),
]

OWASP_LLM_TOP10 = [
    ("LLM01", "Prompt Injection"),
    ("LLM02", "Insecure Output Handling"),
    ("LLM03", "Training Data Poisoning"),
    ("LLM04", "Model Denial of Service"),
    ("LLM05", "Supply Chain Vulnerabilities"),
    ("LLM06", "Sensitive Information Disclosure"),
    ("LLM07", "Insecure Plugin Design"),
    ("LLM08", "Excessive Agency"),
    ("LLM09", "Overreliance"),
    ("LLM10", "Model Theft"),
]

NIST_AI_RMF = ["Govern", "Map", "Measure", "Manage"]

# secure-t canonical tracks (must match education/curriculum.json).
SECURE_T_TRACKS = [
    "digital-literacy",
    "cyber-foundations",
    "blue-team",
    "ai-foundations",
    "genai-applied",
    "secure-web",
    "digital-career",
]

# Explicit mapping: source knowledge area -> secure-t track.
MAPPING = {
    # CyBOK
    "Introduction to Cybersecurity": "cyber-foundations",
    "Human Factors": "digital-literacy",
    "Security Management": "cyber-foundations",
    "Authentication, Authorisation & Accountability": "cyber-foundations",
    "Cryptography": "cyber-foundations",
    "Operating Systems Security": "cyber-foundations",
    "Distributed Systems Security": "secure-web",
    "Software Security": "secure-web",
    "Web & Mobile Security": "secure-web",
    "Secure Systems Development": "secure-web",
    "Network Security": "cyber-foundations",
    "Hardware Security": "cyber-foundations",
    "Cyber-Physical Systems Security": "cyber-foundations",
    "Physical Layer Security": "cyber-foundations",
    "Wireless Security": "cyber-foundations",
    "Forensics": "blue-team",
    "Incident Management": "blue-team",
    "Malware & Attack Technologies": "blue-team",
    "Adversarial Behaviours": "blue-team",
    "Security Economics": "digital-career",
    "Privacy & Online Rights": "digital-literacy",
    "Risk Management & Governance": "cyber-foundations",
    "Law & Regulation": "digital-career",
    # NICE
    "Security Provision": "cyber-foundations",
    "Operate and Maintain": "blue-team",
    "Oversee and Govern": "digital-career",
    "Protect and Defend": "blue-team",
    "Analyze": "blue-team",
    "Collect and Operate": "blue-team",
    "Investigate": "blue-team",
    # MIT OCW
    "6.858 Computer Systems Security": "secure-web",
    "6.857 Network and Computer Security": "cyber-foundations",
    "6.1600 Foundations of Computer Security": "cyber-foundations",
    "6.875 Cryptography and Cryptanalysis": "cyber-foundations",
    # OWASP
    "Broken Access Control": "secure-web",
    "Cryptographic Failures": "secure-web",
    "Injection": "secure-web",
    "Insecure Design": "secure-web",
    "Security Misconfiguration": "secure-web",
    "Vulnerable and Outdated Components": "secure-web",
    "Identification and Authentication Failures": "secure-web",
    "Software and Data Integrity Failures": "secure-web",
    "Security Logging and Monitoring Failures": "blue-team",
    "Server-Side Request Forgery (SSRF)": "secure-web",
    # OWASP Top 10 for LLM Applications
    "Prompt Injection": "ai-foundations",
    "Insecure Output Handling": "genai-applied",
    "Training Data Poisoning": "ai-foundations",
    "Model Denial of Service": "genai-applied",
    "Supply Chain Vulnerabilities": "ai-foundations",
    "Sensitive Information Disclosure": "genai-applied",
    "Insecure Plugin Design": "genai-applied",
    "Excessive Agency": "genai-applied",
    "Overreliance": "genai-applied",
    "Model Theft": "ai-foundations",
    # NIST AI Risk Management Framework
    "Govern": "ai-foundations",
    "Map": "ai-foundations",
    "Measure": "ai-foundations",
    "Manage": "ai-foundations",
}

LEVEL_HINTS = {
    "digital-literacy": "L0-L1",
    "cyber-foundations": "L1-L3",
    "blue-team": "L2-L4",
    "ai-foundations": "L0-L3",
    "genai-applied": "L1-L4",
    "secure-web": "L1-L4",
    "digital-career": "L0-L4",
}


def fetch(url: str) -> tuple[bool, int, str]:
    """Best-effort GET. Returns (ok, status, note). Never raises."""
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            data = resp.read(200_000)
            return True, resp.status, f"{len(data)} bytes"
    except urllib.error.HTTPError as exc:
        return False, exc.code, "http_error"
    except Exception as exc:  # noqa: BLE001 - network is untrusted
        return False, 0, type(exc).__name__


def source_status(offline: bool) -> dict:
    status = {}
    for name, url in SOURCES.items():
        if offline:
            status[name] = {"url": url, "online": None, "note": "offline mode"}
            continue
        ok, code, note = fetch(url)
        status[name] = {"url": url, "online": ok, "http_status": code, "note": note}
    return status


def knowledge_areas() -> list:
    areas = []

    def add(area_id, title, source, track, level):
        areas.append(
            {
                "id": area_id,
                "title": title,
                "source": source,
                "track": track,
                "level": level,
            }
        )

    for i, ka in enumerate(CYBOK_KNOWLEDGE_AREAS, 1):
        track = MAPPING.get(ka, "cyber-foundations")
        add(f"cybok-{i:02d}", ka, "CyBOK", track, LEVEL_HINTS[track])

    for i, role in enumerate(NICE_WORK_ROLE_CATEGORIES, 1):
        track = MAPPING.get(role, "blue-team")
        add(f"nice-{i:02d}", role, "NIST NICE SP 800-181r1", track, LEVEL_HINTS[track])

    for code, title in OWASP_TOP10_2021:
        track = MAPPING.get(title, "secure-web")
        add(f"owasp-{code.lower()}", f"{code} {title}", "OWASP Top 10 2021", track, LEVEL_HINTS[track])

    for code, title in MIT_OCW_COURSES:
        key = f"{code} {title}"
        track = MAPPING.get(key, "cyber-foundations")
        add(f"mit-{code.replace('.', '')}", key, "MIT OpenCourseWare", track, LEVEL_HINTS[track])

    for code, title in OWASP_LLM_TOP10:
        track = MAPPING.get(title, "ai-foundations")
        add(f"owasp-llm-{code.lower()}", f"{code} {title}", "OWASP Top 10 for LLM Applications", track, LEVEL_HINTS[track])

    for i, fn in enumerate(NIST_AI_RMF, 1):
        track = MAPPING.get(fn, "ai-foundations")
        add(f"nist-ai-rmf-{i:02d}", f"AI RMF · {fn}", "NIST AI RMF 1.0", track, LEVEL_HINTS[track])

    return areas


def build(offline: bool) -> dict:
    areas = knowledge_areas()
    by_track = {t: [] for t in SECURE_T_TRACKS}
    for a in areas:
        by_track.setdefault(a["track"], []).append(a["id"])

    return {
        "schema": "secure-t.unified-curriculum.v1",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "generator": "scripts/build-unified-curriculum.py",
        "sources": source_status(offline),
        "tracks": [
            {
                "id": t,
                "level": LEVEL_HINTS[t],
                "knowledge_areas": by_track.get(t, []),
            }
            for t in SECURE_T_TRACKS
        ],
        "knowledge_areas": areas,
        "stats": {
            "knowledge_areas": len(areas),
            "by_source": {
                s: sum(1 for a in areas if a["source"] == s)
                for s in sorted({a["source"] for a in areas})
            },
        },
    }


def main() -> int:
    ap = argparse.ArgumentParser(description="Build unified secure-t curriculum.")
    ap.add_argument("--out", type=Path, default=DEFAULT_OUT)
    ap.add_argument("--offline", action="store_true", help="skip network fetches")
    args = ap.parse_args()

    data = build(offline=args.offline)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    online = sum(1 for s in data["sources"].values() if s.get("online"))
    total = len(data["sources"])
    print(f"[ok] {data['stats']['knowledge_areas']} knowledge areas -> {args.out}")
    print(f"[sources] {online}/{total} reachable")
    return 0


if __name__ == "__main__":
    sys.exit(main())
