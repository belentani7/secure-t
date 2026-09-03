"""Video 1080p: slides PIL marca Belentani + voz edge-tts/Piper + música + ffmpeg."""
import asyncio
import pathlib
import subprocess

from PIL import Image, ImageDraw, ImageFont

import edge_tts

from ..config import BRAND, S, VOICES


def _font(bold=False, size=44):
    p = pathlib.Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
    pb = pathlib.Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
    try:
        return ImageFont.truetype(str(pb if bold else p), size)
    except Exception:
        return ImageFont.load_default()


def _slide(path, title, bullets, idx):
    img = Image.new("RGB", (1920, 1080), BRAND["bg"])
    d = ImageDraw.Draw(img)
    for y in range(1080):
        d.line([(0, y), (1920, y)], fill=tuple(int(BRAND["bg"][i] + (BRAND["ink"][i] - BRAND["bg"][i]) * y / 1080) for i in range(3)))
    d.polygon([(60, 60), (120, 80), (120, 150), (90, 170), (60, 150)], outline=BRAND["lime"], width=4)
    d.text((160, 80), f"SECURE T  ·  {title}", fill=BRAND["paper"], font=_font(True, 64))
    for i, b in enumerate(bullets):
        d.text((160, 260 + i * 140), f"> {b}", fill=BRAND["cyan"], font=_font(False, 44))
    d.text((1780, 1000), str(idx), fill=BRAND["lime"], font=_font(False, 44))
    img.save(path)


async def _tts(text, locale, out):
    if S.TTS_ENGINE == "piper":
        subprocess.run([S.PIPER_BIN, "--model", f"{locale}.onnx", "--output_file", out], input=text.encode(), check=True)
    else:
        await edge_tts.Communicate(text, VOICES[locale]).save(out)


def render_video(lesson, music_mp3, outdir: pathlib.Path):
    outdir.mkdir(parents=True, exist_ok=True)
    outs = []
    for loc in ("es", "en", "pt"):
        imgs = []
        for i in [lesson.title[loc], *[x[loc] for x in lesson.bullets]]:
            _ = i
        for i, _b in enumerate([lesson.title[loc]] + [x[loc] for x in lesson.bullets]):
            p = outdir / f"s{i}_{loc}.png"
            _slide(p, lesson.title[loc], [x[loc] for x in lesson.bullets], i)
            imgs.append(p)
        script = f"{lesson.title[loc]}. " + " ".join(x[loc] for x in lesson.bullets) + " " + lesson.content[loc][:600]
        a = outdir / f"voice_{loc}.mp3"
        asyncio.run(_tts(script, loc, str(a)))
        dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(a)], capture_output=True, text=True).stdout)
        txt = outdir / f"slides_{loc}.txt"
        txt.write_text("\n".join(f"file '{p}'\nduration {dur / len(imgs):.2f}" for p in imgs))
        o = outdir / f"lesson_{loc}.mp4"
        subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(txt), "-i", str(a), "-i", music_mp3,
                        "-filter_complex", "[0:v]fps=24,scale=1920:1080,format=yuv420p[v];[1:a][2:a]amix=inputs=2:duration=first:weights=1 0.25[a]",
                        "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "23",
                        "-c:a", "aac", "-shortest", str(o)], check=True, capture_output=True)
        outs.append((loc, o))
    return outs
