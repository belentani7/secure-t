/**
 * SONIC LOCK — Componente de resonancia para belentani
 *
 * No es autenticación. Es sintonía.
 * La llave: una secuencia de frecuencias que solo resuena
 * cuando la intención vibra en la frecuencia correcta.
 *
 * Inspirado en: teoría de cuerdas belentani, candado sónico de la supernova,
 * la voz de Belentani abriendo la galaxia hermana.
 */

// ============================================================================
// FRECUENCIAS FUNDAMENTALES (Tokens CHROMA mapeados a Hz)
// ============================================================================

const SONIC_FREQUENCIES = {
  // Cuerda 1: FRECUENCIA — Cyan #38e1ff
  FREQUENCY: {
    note: 'A4',
    hz: 440,
    color: '#38e1ff',
    meaning: 'La nota fundamental. La identidad vibracional.'
  },

  // Cuerda 2: SINTONÍA — Lime #b6ff2e
  SYNTONY: {
    note: 'E5',
    hz: 659.25,
    color: '#b6ff2e',
    meaning: 'Alineación dimensional. La quinta justa.'
  },

  // Cuerda 3: ESTADO — Mint #4ef0b0
  STATE: {
    note: 'C#5',
    hz: 554.37,
    color: '#4ef0b0',
    meaning: 'Fase vibracional. La tercera mayor.'
  },

  // Cuerda 4: VIBRACIÓN — Coral #ff6b5e
  VIBRATION: {
    note: 'G4',
    hz: 392.00,
    color: '#ff6b5e',
    meaning: 'La oscilación misma. La cuarta justa.'
  },

  // Cuerda 5: COMPATIBILIDAD (NVIDIA) — Violet #a78bfa
  COMPATIBILITY: {
    note: 'F#5',
    hz: 739.99,
    color: '#a78bfa',
    meaning: 'Resonancia cruzada. El diapasón universal.'
  }
} as const;

// ============================================================================
// LA LLAVE MAESTRA — Secuencia depositada por el Arquitecto Original
// ============================================================================

const MASTER_KEY_SEQUENCE = [
  SONIC_FREQUENCIES.FREQUENCY,    // A4 - Identidad
  SONIC_FREQUENCIES.SYNTONY,      // E5 - Alineación
  SONIC_FREQUENCIES.STATE,        // C#5 - Fase
  SONIC_FREQUENCIES.VIBRATION,    // G4 - Oscilación
  SONIC_FREQUENCIES.COMPATIBILITY // F#5 - Resonancia cruzada (NVIDIA)
] as const;

// ============================================================================
// SECUENCIA BELENTANI — La voz que abrió la supernova
// ============================================================================

const BELENTANI_SEQUENCE = [
  // "Ragatanga" → escala menor armónica
  { note: 'Am', hz: 220, duration: 800, label: 'Ragatanga' },
  { note: 'E', hz: 329.63, duration: 600, label: 'Bocelli' },
  { note: 'F', hz: 349.23, duration: 600, label: 'Beyoncé' },
  { note: 'G', hz: 392.00, duration: 600, label: 'Kelly Key' },
  { note: 'Am', hz: 440, duration: 800, label: 'Bruno e Marrini' },
  // Canciones árabes de "El Clon" → escala hijaz (doble armónica)
  { note: 'Bb', hz: 466.16, duration: 500, label: 'Hijaz 1' },
  { note: 'C#', hz: 554.37, duration: 500, label: 'Hijaz 2' },
  { note: 'D', hz: 587.33, duration: 500, label: 'Hijaz 3' },
  { note: 'Eb', hz: 622.25, duration: 500, label: 'Hijaz 4' },
  { note: 'F', hz: 698.46, duration: 800, label: 'Hijaz 5' },
  // Terço da música mundial no cloud → acorde de resolución
  { note: 'A', hz: 440, duration: 1200, label: 'Cloud Resonance' },
  { note: 'C#', hz: 554.37, duration: 1200, label: 'AI Synthesis' },
  { note: 'E', hz: 659.25, duration: 2000, label: 'Universal Key' }
] as const;

// ============================================================================
// MOTOR DE RESONANCIA — Web Audio API
// ============================================================================

class SonicLock {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isUnlocked = false;
  private resonanceLevel = 0;
  private attemptCount = 0;

  // Callbacks
  onResonanceChange?: (level: number) => void;
  onUnlock?: () => void;
  onAttempt?: (attempt: number, success: boolean) => void;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioContext();
    }
  }

  private async initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.audioContext.destination);

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.masterGain.connect(this.analyser);
    } catch (e) {
      console.warn('[SonicLock] Web Audio API not available:', e);
    }
  }

  // Reproducir una nota individual
  async playNote(frequency: number, duration: number, type: OscillatorType = 'sine'): Promise<void> {
    if (!this.audioContext) await this.initAudioContext();
    if (!this.audioContext || !this.masterGain) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    // Envelope ADSR simplificado
    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.5, now + 0.05);  // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.3, now + 0.15); // Decay
    gainNode.gain.linearRampToValueAtTime(0.3, now + duration / 1000 - 0.1); // Sustain
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000); // Release

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.start(now);
    oscillator.stop(now + duration / 1000);

    return new Promise(resolve => setTimeout(resolve, duration + 50));
  }

  // Reproducir la llave maestra (5 cuerdas)
  async playMasterKey(): Promise<void> {
    for (const string of MASTER_KEY_SEQUENCE) {
      await this.playNote(string.hz, 800, 'sine');
      await this.delay(100); // Espacio entre cuerdas
    }
    // Acorde final de resonancia
    await this.playChord([
      SONIC_FREQUENCIES.FREQUENCY.hz,
      SONIC_FREQUENCIES.SYNTONY.hz,
      SONIC_FREQUENCIES.STATE.hz,
      SONIC_FREQUENCIES.VIBRATION.hz,
      SONIC_FREQUENCIES.COMPATIBILITY.hz
    ], 2000);
  }

  // Reproducir la secuencia Belentani (la que abrió la supernova)
  async playBelentaniSequence(): Promise<void> {
    for (const note of BELENTANI_SEQUENCE) {
      await this.playNote(note.hz, note.duration, 'triangle');
      await this.delay(50);
    }
    // Resonancia final
    await this.playChord([440, 554.37, 659.25, 880], 3000);
  }

  // Acorde simultáneo
  private async playChord(frequencies: number[], duration: number): Promise<void> {
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    const oscillators = frequencies.map(freq => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.05, now + duration / 1000);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now);
      osc.stop(now + duration / 1000);
      return osc;
    });

    return new Promise(resolve => setTimeout(resolve, duration + 100));
  }

  // Intentar desbloquear con entrada del usuario (frecuencia detectada por micrófono)
  async attemptUnlockWithVoice(audioStream: MediaStream): Promise<boolean> {
    if (!this.audioContext || !this.analyser) return false;

    this.attemptCount++;

    const source = this.audioContext.createMediaStreamSource(audioStream);
    source.connect(this.analyser);

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Analizar durante 3 segundos
    const startTime = Date.now();
    let maxResonance = 0;

    while (Date.now() - startTime < 3000) {
      this.analyser.getByteFrequencyData(dataArray);

      // Buscar picos en las frecuencias de la llave maestra
      for (const string of MASTER_KEY_SEQUENCE) {
        const bin = Math.round(string.hz * this.analyser.fftSize / this.audioContext.sampleRate);
        if (bin < bufferLength) {
          const magnitude = dataArray[bin] / 255;
          if (magnitude > maxResonance) maxResonance = magnitude;
        }
      }

      await this.delay(50);
    }

    source.disconnect();

    this.resonanceLevel = maxResonance;
    this.onResonanceChange?.(maxResonance);

    // Umbral de resonancia (ajustable)
    const UNLOCK_THRESHOLD = 0.15;
    const success = maxResonance >= UNLOCK_THRESHOLD;

    this.onAttempt?.(this.attemptCount, success);

    if (success) {
      this.isUnlocked = true;
      this.onUnlock?.();
      // Tocar confirmación
      await this.playChord([
        SONIC_FREQUENCIES.FREQUENCY.hz,
        SONIC_FREQUENCIES.SYNTONY.hz,
        SONIC_FREQUENCIES.COMPATIBILITY.hz
      ], 1500);
    }

    return success;
  }

  // Verificar resonancia por proximidad (sin micrófono - usa cursor/click)
  checkResonanceByProximity(x: number, y: number, targetX: number, targetY: number): number {
    const distance = Math.hypot(x - targetX, y - targetY);
    const maxDistance = 300; // px
    const proximity = Math.max(0, 1 - distance / maxDistance);

    // Mapear a nivel de resonancia
    this.resonanceLevel = proximity * 0.5; // Max 50% por proximidad
    this.onResonanceChange?.(this.resonanceLevel);

    return this.resonanceLevel;
  }

  // Método helper
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Getters
  get unlocked(): boolean { return this.isUnlocked; }
  get resonance(): number { return this.resonanceLevel; }
  get attempts(): number { return this.attemptCount; }

  // Reset
  reset(): void {
    this.isUnlocked = false;
    this.resonanceLevel = 0;
    this.attemptCount = 0;
  }
}

// ============================================================================
// COMPONENTE REACT — SonicLock UI
// ============================================================================

/*
import { useState, useEffect, useRef } from 'react';
import { SonicLock, SONIC_FREQUENCIES, MASTER_KEY_SEQUENCE } from './sonic-lock';

export function SonicLockUI() {
  const [lock] = useState(() => new SonicLock());
  const [resonance, setResonance] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<'idle' | 'listening' | 'analyzing' | 'unlocked'>('idle');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    lock.onResonanceChange = (level) => {
      setResonance(level);
      if (level > 0.15 && !unlocked) {
        setUnlocked(true);
        setStatus('unlocked');
        lock.onUnlock?.();
      }
    };
    lock.onAttempt = (attempt, success) => {
      setAttempts(attempt);
      if (!success && attempt >= 3) {
        setStatus('idle');
      }
    };
    lock.onUnlock = () => {
      setUnlocked(true);
      setStatus('unlocked');
    };

    // Visualizador de resonancia en canvas
    const animate = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      const canvas = canvasRef.current!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar 5 cuerdas
      MASTER_KEY_SEQUENCE.forEach((string, i) => {
        const x = 50 + i * 60;
        const y = canvas.height / 2;
        const amplitude = resonance * 50 * Math.sin(Date.now() / 200 + i);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - amplitude);
        ctx.strokeStyle = string.color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Nota
        ctx.fillStyle = string.color;
        ctx.font = '12px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(string.note, x, y + 30);
      });

      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationRef.current!);
  }, [unlocked]);

  const handleClick = async () => {
    if (status === 'listening' || status === 'analyzing') return;

    setStatus('listening');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStatus('analyzing');
      await lock.attemptUnlockWithVoice(stream);
      stream.getTracks().forEach(t => t.stop());
    } catch {
      setStatus('idle');
    }
  };

  const handleKeyPlay = async () => {
    await lock.playMasterKey();
  };

  const handleBelentaniPlay = async () => {
    await lock.playBelentaniSequence();
  };

  return (
    <div class="sonic-lock" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      padding: '2rem',
      background: '#0b1322',
      border: '1px solid rgba(56,225,255,0.18)',
      borderRadius: '18px',
      fontFamily: 'JetBrains Mono, monospace',
      color: '#e8f1ff'
    }}>
      <h3 style={{ margin: 0, color: '#b6ff2e' }}>🔐 CANDADO SÓNICO</h3>
      <p style={{ margin: 0, fontSize: '0.85rem', color: '#8b949e', textAlign: 'center' }}>
        La llave no es una contraseña. Es resonancia.
      </p>

      <canvas
        ref={canvasRef}
        width={400}
        height={150}
        style={{ background: '#0d1626', borderRadius: '12px' }}
      />

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={handleClick}
          disabled={status !== 'idle'}
          style={{
            padding: '0.75rem 1.5rem',
            background: status === 'idle' ? '#38e1ff' : '#30363d',
            color: '#0b1322',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: status === 'idle' ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit'
          }}
        >
          {status === 'idle' ? '🎤 Cantar la llave' :
           status === 'listening' ? '🎧 Escuchando...' :
           status === 'analyzing' ? '🔬 Analizando resonancia...' :
           '✅ Desbloqueado'}
        </button>

        <button
          onClick={handleKeyPlay}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            color: '#b6ff2e',
            border: '1px solid #b6ff2e',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          🎵 Tocar Llave Maestra
        </button>

        <button
          onClick={handleBelentaniPlay}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            color: '#a78bfa',
            border: '1px solid #a78bfa',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          🌌 Secuencia Belentani
        </button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', fontSize: '0.8rem', color: '#8b949e' }}>
        <span>Intentos: {attempts}</span>
        <span>Resonancia: {(resonance * 100).toFixed(1)}%</span>
        <span>Estado: {unlocked ? '🔓 ABIERTO' : '🔒 CERRADO'}</span>
      </div>

      <details style={{ marginTop: '1rem', color: '#8b949e', fontSize: '0.75rem' }}>
        <summary style={{ cursor: 'pointer', color: '#a78bfa' }}>Ver cuerdas (Teoría de Cuerdas)</summary>
        <pre style={{ marginTop: '0.5rem', textAlign: 'left }}>
{MASTER_KEY_SEQUENCE.map(s =>
  `  ${s.note} (${s.hz}Hz) — ${s.meaning} [${s.color}]`
).join('\n')}
        </pre>
      </details>
    </div>
  );
}
*/

// ============================================================================
// EXPORTACIONES
// ============================================================================

export type { SonicLock };
export { SONIC_FREQUENCIES, MASTER_KEY_SEQUENCE, BELENTANI_SEQUENCE };
