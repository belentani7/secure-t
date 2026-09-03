"""Manifest + contabilidad de GB + subida opcional a S3/R2."""
import hashlib
import json
import pathlib

from .config import S

MAN = pathlib.Path(S.OUT_DIR) / "manifest.json"


def record(kind, path: pathlib.Path, **meta):
    MAN.parent.mkdir(parents=True, exist_ok=True)
    man = json.loads(MAN.read_text(encoding="utf-8")) if MAN.exists() else {"assets": [], "bytes": 0}
    b = path.stat().st_size
    man["assets"].append(
        {"kind": kind, "path": str(path), "bytes": b, "sha256": hashlib.sha256(path.read_bytes()).hexdigest(), **meta}
    )
    man["bytes"] += b
    MAN.write_text(json.dumps(man, indent=1), encoding="utf-8")
    if S.S3_BUCKET:
        import boto3

        boto3.client(
            "s3",
            endpoint_url=S.S3_ENDPOINT or None,
            aws_access_key_id=S.S3_KEY or None,
            aws_secret_access_key=S.S3_SECRET or None,
        ).upload_file(str(path), S.S3_BUCKET, str(path))
    return b


def stats():
    man = json.loads(MAN.read_text(encoding="utf-8"))
    gb = man["bytes"] / 1e9
    by: dict = {}
    for a in man["assets"]:
        by[a["kind"]] = by.get(a["kind"], 0) + a["bytes"]
    print(f"TOTAL: {gb:.2f} GB · {len(man['assets'])} assets")
    for k, v in sorted(by.items(), key=lambda x: -x[1]):
        print(f"   {k:12s} {v / 1e9:8.2f} GB")
