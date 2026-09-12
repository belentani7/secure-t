#!/usr/bin/env python3
"""Belentani Unified Master: auditoría y organización segura de GitHub/local.

Por defecto solo audita. Nunca hace push ni modifica repositorios remotos sin
--apply --allow-remote-writes. Los cambios locales en modo apply se limitan a
archivos auxiliares faltantes y quedan registrados.
"""
from __future__ import annotations
import argparse, json, os, re, subprocess, sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

SKIP={".git","node_modules","dist","build","__pycache__",".cache",".venv","venv"}
FAMILIES={
 "education": ("secure-t","university","academy","school","lingua","manos-abiertas"),
 "social-impact": ("cruzando","community","impact","abiertas"),
 "saas-enterprise": ("saas","nexus","workforce","experience","business"),
 "ux-design": ("ux","design","fashion","judas"),
 "infrastructure": ("core","infra","secure-t","unified","omega","agent","workflow"),
}

def cmd(args, cwd=None):
    try:
        p=subprocess.run(args,cwd=cwd,text=True,capture_output=True,check=False)
        return p.returncode,(p.stdout+p.stderr).strip()
    except OSError as e: return 127,str(e)

def family(name):
    low=name.lower()
    for group, keys in FAMILIES.items():
        if any(k in low for k in keys): return group
    return "uncategorized"

def github(owner):
    code,raw=cmd(["gh","repo","list",owner,"--limit","500","--json","name,nameWithOwner,isPrivate,isArchived,defaultBranchRef,updatedAt,description,url"])
    clean=re.sub(r"\x1b\[[0-9;]*[A-Za-z]", "", raw)
    start,end=clean.find("["),clean.rfind("]")
    if code or start<0 or end<start:
        return {"available":False,"error":raw[-1000:],"repositories":[]}
    try: repos=json.loads(clean[start:end+1])
    except json.JSONDecodeError as e: return {"available":False,"error":str(e),"repositories":[]}
    for r in repos: r["family"]=family(r.get("name", ""))
    return {"available":True,"total":len(repos),"active":sum(not r["isArchived"] for r in repos),"archived":sum(r["isArchived"] for r in repos),"families":dict(Counter(r["family"] for r in repos)),"repositories":repos}

def local(root,depth):
    result=[]
    for cur,dirs,files in os.walk(root):
        path=Path(cur); rel=path.relative_to(root)
        if len(rel.parts)>=depth: dirs[:]=[]
        dirs[:]=[d for d in dirs if d not in SKIP and not d.startswith(".")]
        markers=sorted(set(files)&{"README.md","package.json","pyproject.toml","requirements.txt","Dockerfile","Cargo.toml","go.mod"})
        if markers or (path/".git").exists():
            result.append({"path":str(path),"relative":str(rel),"family":family(str(rel)),"markers":markers,"python":sum(x.endswith('.py') for x in files),"typescript":sum(x.endswith(('.ts','.tsx')) for x in files)})
    return sorted(result,key=lambda x:x["relative"])

def validate(root):
    checks=[]
    commands=[]
    if (root/"package.json").exists(): commands += [("typescript-check",["pnpm","check"]),("javascript-tests",["pnpm","test"])]
    if any((root/x).exists() for x in ("pyproject.toml","requirements.txt")) or (root/"factory").exists(): commands += [("python-compile",["python3","-m","compileall","-q","."])]
    for name,args in commands:
        code,out=cmd(args,cwd=root); checks.append({"name":name,"command":args,"exit_code":code,"ok":code==0,"output":out[-4000:]})
    return checks

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--owner",default="belentani7"); ap.add_argument("--local-root",type=Path,default=Path.home())
    ap.add_argument("--output",type=Path,default=Path("belentani_unified_report.json")); ap.add_argument("--depth",type=int,default=3)
    ap.add_argument("--validate-root",type=Path,default=Path.cwd()); ap.add_argument("--validate",action="store_true")
    ap.add_argument("--apply",action="store_true",help="crear solo archivos auxiliares locales faltantes")
    ap.add_argument("--allow-remote-writes",action="store_true",help="reservado; nunca hace push automático")
    a=ap.parse_args(); root=a.local_root.expanduser().resolve()
    gh=github(a.owner); projects=local(root,a.depth); checks=validate(a.validate_root.resolve()) if a.validate else []
    report={"generated_at":datetime.now(timezone.utc).isoformat(),"mode":"apply" if a.apply else "audit","remote_writes":False,"scope":{"owner":a.owner,"local_root":str(root),"validate_root":str(a.validate_root.resolve())},"github":gh,"local_projects":projects,"validation":checks,"actions":[]}
    if a.apply:
        readme=a.validate_root/"ECOSYSTEM_MASTER_PROMPT.md"
        if not readme.exists():
            readme.write_text("# Ecosystem master\n\nAudited by belentani_unified_master.py.\n",encoding="utf-8"); report["actions"].append(str(readme))
        report["actions"].append("No remote writes: review and approve changes per repository before applying.")
    a.output.parent.mkdir(parents=True,exist_ok=True); a.output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"github":gh.get("total",0),"active":gh.get("active",0),"archived":gh.get("archived",0),"local":len(projects),"checks":checks,"output":str(a.output.resolve())},ensure_ascii=False,indent=2))
    return 0 if gh.get("available") and all(x["ok"] for x in checks) else 1
if __name__=="__main__": raise SystemExit(main())
