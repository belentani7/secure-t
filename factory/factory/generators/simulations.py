"""Simulaciones HTML standalone (red, crypto, phishing, firewall) + spec JSON."""
import json
import pathlib
import random

SIMS = ["red", "crypto", "phishing", "firewall"]

HTML_SIM = """<!doctype html><html><head><meta charset=utf-8><title>Secure T Lab</title>
<style>body{background:#070D18;color:#F3EFE7;font-family:monospace}canvas{border:1px solid #38E1FF}
button{background:#A8FF3E;border:0;padding:8px 16px;font-weight:bold}</style></head>
<body><h2>SECURE T · LAB <span id=k></span></h2><canvas id=c width=900 height=480></canvas>
<p id=reto></p><button onclick=check()>Verificar</button><pre id=out></pre>
<script>const SPEC=__SPEC__;document.getElementById('k').textContent='__KIND__';
document.getElementById('reto').textContent=SPEC.reto||SPEC.misión||'completa el reto';
const ctx=c.getContext('2d');ctx.strokeStyle='#38E1FF';(SPEC.nodes||SPEC.emails||SPEC.reglas||[]).forEach((n,i)=>{
ctx.beginPath();ctx.arc(80+i*110,240,26,0,7);ctx.stroke();ctx.fillStyle='#A8FF3E';ctx.fillText(String(i),76+i*110,244)});
function check(){out.textContent='verificación enviada al LMS'}</script>"""


def gen_sim(kind, seed, out: pathlib.Path):
    rng = random.Random(seed)
    out.mkdir(parents=True, exist_ok=True)
    if kind == "red":
        spec = {"nodes": [f"n{i}" for i in range(rng.randint(5, 9))], "misión": "Ruta el paquete evitando nodos caídos"}
    elif kind == "crypto":
        spec = {"algoritmos": ["AES-256", "RSA-2048", "ChaCha20", "SHA-3"], "reto": f"Cifra M={rng.randint(1000, 9999)} y verifica integridad"}
    elif kind == "phishing":
        spec = {"emails": [{"from": f"soporte@banco-{rng.choice(['x', 'y', 'z'])}.com", "urgencia": rng.choice(["ALTA", "MEDIA"])} for _ in range(5)], "reto": "Marca los 3 correos maliciosos"}
    else:
        spec = {"reglas": [f"ALLOW tcp {rng.randint(1, 65535)}" for _ in range(4)] + ["DENY *"], "reto": "Bloquea el escaneo sin caer el DNS"}
    (out / "sim.json").write_text(json.dumps(spec, ensure_ascii=False, indent=2), encoding="utf-8")
    (out / "index.html").write_text(HTML_SIM.replace("__SPEC__", json.dumps(spec)).replace("__KIND__", kind), encoding="utf-8")
    return out / "index.html"
