"""LLM open con caché en disco (clave para costo/escala)."""
import hashlib
import json
import pathlib

import httpx

from .config import S

_CACHE = pathlib.Path(".cache/llm")
_CACHE.mkdir(parents=True, exist_ok=True)


def llm(prompt: str, json_mode=False, temperature=0.7):
    key = hashlib.sha256(f"{S.LLM_MODEL}|{json_mode}|{prompt}".encode()).hexdigest()
    p = _CACHE / f"{key}.json"
    if p.exists():
        return json.loads(p.read_text(encoding="utf-8"))
    body = {
        "model": S.LLM_MODEL,
        "temperature": temperature,
        "messages": [{"role": "user", "content": prompt}],
    }
    if json_mode:
        body["response_format"] = {"type": "json_object"}
    headers = {"Authorization": f"Bearer {S.LLM_KEY}"} if S.LLM_KEY else {}
    r = httpx.post(f"{S.LLM_BASE_URL}/v1/chat/completions", json=body, timeout=600, headers=headers)
    r.raise_for_status()
    txt = r.json()["choices"][0]["message"]["content"]
    data = json.loads(txt) if json_mode else txt
    p.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    return data
