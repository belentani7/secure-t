import os, json, time, urllib.request, urllib.error

API_KEY = "sk-e2d84b94452243e382d052b9db53a2a3"
API_URL = "https://api.deepseek.com/v1/chat/completions"

COURSE_LINKS = {
    "ciber-ofensiva": "[Ciberseguridad Ofensiva: Pensar como Atacante]",
    "ciber-defensiva": "[Ciberseguridad Defensiva: Operar como SOC]",
    "ia-aplicada-segura": "[Inteligencia Artificial Aplicada y Segura]",
    "gobernanza-compliance": "[Gobernanza y Compliance Digital]"
}

COURSE_TOPICS = {
    "ciber-ofensiva": "ciberseguridad ofensiva, hacking ético, pentesting",
    "ciber-defensiva": "ciberseguridad defensiva, SOC, respuesta a incidentes",
    "ia-aplicada-segura": "inteligencia artificial aplicada y segura, ML seguridad",
    "gobernanza-compliance": "gobernanza y compliance digital, auditoría, RGPD"
}

def get_file_content(filepath):
    with open(filepath, encoding='utf-8') as f:
        return f.read()

def call_deepseek(prompt):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    data = {
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 2500
    }
    req = urllib.request.Request(API_URL, data=json.dumps(data).encode(), headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            result = json.loads(resp.read().decode())
            return result["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"  API Error: {e}")
        return None

def generate_content(course_slug, week_num, title, topic):
    course_topic = COURSE_TOPICS[course_slug]
    prompt = f"""Eres un experto en {course_topic}. Genera el contenido markdown completo para la semana {week_num} del curso.

Título del archivo: {title}

ESTRUCTURA EXACTA que debes devolver (solo el contenido, sin título ni línea de curso):

## Objetivo de la semana
[Descripción significativa de qué aprenderá el estudiante esta semana, 2-3 líneas]

## LECTURA
[Contenido sustancial y denso sobre el tema. Mínimo 900 caracteres. Incluye conceptos teóricos, frameworks, estándares reales. Usa referencias específicas como MITRE ATT&CK, OWASP, NIST, ISO 27001, CIS Controls, donde aplique al tema de esta semana]

## EJERCICIO
[Ejercicio práctico detallado con pasos concretos, herramientas específicas y objetivos claros]

## CASO
[Análisis de un caso real o escenario basado en incidentes reales de ciberseguridad relacionados con este tema]

## Recursos abiertos
- Referencia verificable 1 (ej: https://github.com/... o sitio oficial)
- Referencia verificable 2
- Referencia verificable 3

REGLAS:
- Todo en español
- La sección LECTURA debe tener más de 900 caracteres
- Incluye estándares de seguridad reales (MITRE, OWASP, NIST, ISO, CIS)
- Los recursos deben ser URLs o referencias verificables, nada genérico
- NO repitas el título ni la línea de curso
- Formato markdown limpio

Tema: {topic}"""
    
    result = call_deepseek(prompt)
    if result is None:
        return None
    return result.strip()

def main():
    courses = ["ciber-ofensiva", "ciber-defensiva", "ia-aplicada-segura", "gobernanza-compliance"]
    week_range = range(9, 21)
    
    total = 0
    success = 0
    failed = []
    
    for course in courses:
        for week_num in week_range:
            week_str = f"semana-{week_num:02d}"
            filepath = f"campus/cursos/{course}/{week_str}.md"
            
            if not os.path.exists(filepath):
                print(f"SKIP: {filepath}")
                continue
            
            total += 1
            print(f"[{total}/48] {course}/{week_str}.md")
            
            content = get_file_content(filepath)
            lines = content.split('\n')
            title = lines[0].strip() if lines else ""
            ref_line = ""
            for line in lines[1:]:
                if line.strip().startswith("Curso:"):
                    ref_line = line.strip()
                    break
            
            # Extract topic from title
            topic = title.replace(f"Semana {week_num}:", "").strip()
            
            generated = generate_content(course, week_num, title, topic)
            
            if generated is None:
                print(f"  FAILED")
                failed.append(f"{course}/{week_str}")
                continue
            
            # Build the full file content
            # The ref_line already has "Curso: ... · Semana N de 20"
            full_content = f"{title}\n\n{ref_line} · Semana {week_num} de 20\n\n{generated}\n\n--- [Volver al syllabus](../syllabus.md)\n"
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(full_content)
            
            success += 1
            print(f"  OK ({len(full_content)} chars)")
            time.sleep(0.5)
    
    print(f"\n=== RESULTADO ===")
    print(f"Total: {total}, Success: {success}, Failed: {len(failed)}")
    if failed:
        for f in failed:
            print(f"  Failed: {f}")

if __name__ == "__main__":
    main()
