"""Títulos SVG→PDF con hash + SCORM/xAPI/LTI (portable a cualquier LMS)."""
import hashlib
import json
import zipfile

DIPLOMA = """<svg xmlns="http://www.w3.org/2000/svg" width="1240" height="874">
<rect width="100%" height="100%" fill="#070D18"/><rect x="30" y="30" width="1180" height="814" fill="none" stroke="#38E1FF" stroke-width="3"/>
<text x="620" y="150" text-anchor="middle" fill="#F3EFE7" font-size="56" font-family="sans-serif" font-weight="900">SECURE <tspan fill="#A8FF3E">T</tspan></text>
<text x="620" y="200" text-anchor="middle" fill="#38E1FF" font-size="20" letter-spacing="8">UNIVERSIDAD DIGITAL</text>
<text x="620" y="330" text-anchor="middle" fill="#F3EFE7" font-size="24">certifica que</text>
<text x="620" y="410" text-anchor="middle" fill="#A8FF3E" font-size="44">{nombre}</text>
<text x="620" y="470" text-anchor="middle" fill="#F3EFE7" font-size="22">ha completado</text>
<text x="620" y="530" text-anchor="middle" fill="#38E1FF" font-size="30">{programa}</text>
<text x="620" y="780" text-anchor="middle" fill="#8899aa" font-size="14">verificacion: {hash}</text></svg>"""


def render_diploma(nombre, programa, out):
    import cairosvg  # dependencia opcional pdf-svg

    h = hashlib.sha256(f"{nombre}|{programa}".encode()).hexdigest()[:16].upper()
    cairosvg.svg2pdf(bytestring=DIPLOMA.format(nombre=nombre, programa=programa, hash=h).encode(), write_to=str(out))
    return h
