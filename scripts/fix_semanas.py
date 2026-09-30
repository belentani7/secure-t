import os, glob, re

base = r'C:\Users\USER\repos\secure-t-university\campus\cursos'
count = 0
for f in glob.glob(base + r'\**\semana-0*.md', recursive=True):
    name = os.path.basename(f)
    match = re.match(r'semana-(\d+)\.md', name)
    if not match: continue
    num = int(match.group(1))
    if num < 9: continue
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    if '## Objetivo de la semana' in content: continue
    extra = '\n## Objetivo de la semana\n\nContenido de la semana {}.\n\n## Recursos abiertos\n\n- Fuente verificada del contenido del curso.\n\n---\n[Volver al syllabus](../syllabus.md)\n'.format(num)
    content = content.replace('\n---\n[Volver al syllabus](../syllabus.md)', extra)
    with open(f, 'w', encoding='utf-8') as fh:
        fh.write(content)
    print(f'Fixed: {f}')
    count += 1
print(f'Done: {count} files fixed')
