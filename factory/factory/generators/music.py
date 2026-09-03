"""Música procedural numpy + jingle de marca (3 s → notificador)."""
import subprocess

import numpy as np

PROG = [[220, 261.6, 329.6], [174.6, 220, 261.6], [196, 246.9, 293.7], [146.8, 174.6, 220]]


def render_track(seed, seconds=120, out="music.wav"):
    import wave

    sr = 44100
    rng = np.random.default_rng(seed)
    t = np.linspace(0, seconds, sr * seconds, endpoint=False)
    sig = np.zeros_like(t)
    for i in range(int(seconds / 8)):
        ch = PROG[rng.integers(0, len(PROG))]
        t0 = i * 8
        mask = (t >= t0) & (t < t0 + 9.5)
        env = np.exp(-0.22 * np.clip(t - t0, 0, None))
        for f in ch:
            sig[mask] += 0.16 * np.sin(2 * np.pi * f * t[mask] + 0.3 * np.sin(2 * np.pi * 0.2 * t[mask])) * env[mask]
    sig += 0.01 * np.random.default_rng(seed + 1).standard_normal(len(t))
    sig[: 2 * sr] *= np.linspace(0, 1, 2 * sr)
    sig[-3 * sr :] *= np.linspace(1, 0, 3 * sr)
    wav = (sig / np.max(np.abs(sig)) * 0.8 * 32767).astype("<i2")
    with wave.open(out, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(wav.tobytes())
    mp3 = out.replace(".wav", ".mp3")
    subprocess.run(["ffmpeg", "-y", "-i", out, "-b:a", "192k", mp3], check=True, capture_output=True)
    return mp3


def render_jingle(out="jingle.mp3"):
    import wave

    sr = 44100
    t = np.linspace(0, 3, 3 * sr, endpoint=False)
    s = sum(0.3 * np.sin(2 * np.pi * f * t) * np.exp(-1.2 * np.clip(t - t0, 0, None)) for t0, f in [(0, 880), (0.4, 1174.7), (0.8, 1568), (1.6, 2093)])
    wavp = out.replace(".mp3", ".wav")
    with wave.open(wavp, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(((s / np.max(np.abs(s))) * 0.9 * 32767).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-y", "-i", wavp, "-b:a", "192k", out], check=True, capture_output=True)
    return out
