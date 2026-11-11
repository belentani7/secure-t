/**
 * SONIC LOCK — Standalone IIFE version for static campus
 * No ES modules, no imports — runs directly in browser
 *
 * Teoría de Cuerdas Belentani · Candado Sónico
 */

(function() {
  'use strict';

  // ============================================================================
  // FRECUENCIAS FUNDAMENTALES (Tokens CHROMA mapeados a Hz)
  // ============================================================================

  const SONIC_FREQUENCIES = {
    FREQUENCY: { note: 'A4', hz: 440, color: '#38e1ff', meaning: 'La nota fundamental. La identidad vibracional.' },
    SYNTONY: { note: 'E5', hz: 659.25, color: '#b6ff2e', meaning: 'Alineación dimensional. La quinta justa.' },
    STATE: { note: 'C#5', hz: 554.37, color: '#4ef0b0', meaning: 'Fase vibracional. La tercera mayor.' },
    VIBRATION: { note: 'G4', hz: 392.00, color: '#ff6b5e', meaning: 'La oscilación misma. La cuarta justa.' },
    COMPATIBILITY: { note: 'F#5', hz: 739.99, color: '#a78bfa', meaning: 'Resonancia cruzada. El diapasón universal (NVIDIA).' }
  };

  const MASTER_KEY_SEQUENCE = [
    SONIC_FREQUENCIES.FREQUENCY,
    SONIC_FREQUENCIES.SYNTONY,
    SONIC_FREQUENCIES.STATE,
    SONIC_FREQUENCIES.VIBRATION,
    SONIC_FREQUENCIES.COMPATIBILITY
  ];

  const BELENTANI_SEQUENCE = [
    { note: 'Am', hz: 220, duration: 800, label: 'Ragatanga' },
    { note: 'E', hz: 329.63, duration: 600, label: 'Bocelli' },
    { note: 'F', hz: 349.23, duration: 600, label: 'Beyoncé' },
    { note: 'G', hz: 392.00, duration: 600, label: 'Kelly Key' },
    { note: 'Am', hz: 440, duration: 800, label: 'Bruno e Marrini' },
    { note: 'Bb', hz: 466.16, duration: 500, label: 'Hijaz 1' },
    { note: 'C#', hz: 554.37, duration: 500, label: 'Hijaz 2' },
    { note: 'D', hz: 587.33, duration: 500, label: 'Hijaz 3' },
    { note: 'Eb', hz: 622.25, duration: 500, label: 'Hijaz 4' },
    { note: 'F', hz: 698.46, duration: 800, label: 'Hijaz 5' },
    { note: 'A', hz: 440, duration: 1200, label: 'Cloud Resonance' },
    { note: 'C#', hz: 554.37, duration: 1200, label: 'AI Synthesis' },
    { note: 'E', hz: 659.25, duration: 2000, label: 'Universal Key' }
  ];

  // ============================================================================
  // MOTOR DE RESONANCIA — Web Audio API
  // ============================================================================

  class SonicLock {
    constructor() {
      this.audioContext = null;
      this.masterGain = null;
      this.analyser = null;
      this.isUnlocked = false;
      this.resonanceLevel = 0;
      this.attemptCount = 0;
      this.callbacks = {
        onResonanceChange: null,
        onUnlock: null,
        onAttempt: null
      };
      this.initAudioContext();
    }

    initAudioContext() {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AC();
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

    async playNote(frequency, duration, type = 'sine') {
      if (!this.audioContext || !this.masterGain) return;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      const now = this.audioContext.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.3, now + 0.15);
      gain.gain.linearRampToValueAtTime(0.3, now + duration / 1000 - 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + duration / 1000);
      return new Promise(resolve => setTimeout(resolve, duration + 50));
    }

    async playMasterKey() {
      for (const string of MASTER_KEY_SEQUENCE) {
        await this.playNote(string.hz, 800, 'sine');
        await this.delay(100);
      }
      await this.playChord([
        SONIC_FREQUENCIES.FREQUENCY.hz,
        SONIC_FREQUENCIES.SYNTONY.hz,
        SONIC_FREQUENCIES.STATE.hz,
        SONIC_FREQUENCIES.VIBRATION.hz,
        SONIC_FREQUENCIES.COMPATIBILITY.hz
      ], 2000);
    }

    async playBelentaniSequence() {
      for (const note of BELENTANI_SEQUENCE) {
        await this.playNote(note.hz, note.duration, 'triangle');
        await this.delay(50);
      }
      await this.playChord([440, 554.37, 659.25, 880], 3000);
    }

    async playChord(frequencies, duration) {
      if (!this.audioContext || !this.masterGain) return;
      const now = this.audioContext.currentTime;
      frequencies.forEach(freq => {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.05, now + duration / 1000);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + duration / 1000);
      });
      return new Promise(resolve => setTimeout(resolve, duration + 100));
    }

    async attemptUnlockWithVoice(audioStream) {
      if (!this.audioContext || !this.analyser) return false;
      this.attemptCount++;
      const source = this.audioContext.createMediaStreamSource(audioStream);
      source.connect(this.analyser);
      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const startTime = Date.now();
      let maxResonance = 0;
      while (Date.now() - startTime < 3000) {
        this.analyser.getByteFrequencyData(dataArray);
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
      this.callbacks.onResonanceChange?.(maxResonance);
      const UNLOCK_THRESHOLD = 0.15;
      const success = maxResonance >= UNLOCK_THRESHOLD;
      this.callbacks.onAttempt?.(this.attemptCount, success);
      if (success) {
        this.isUnlocked = true;
        this.callbacks.onUnlock?.();
        await this.playChord([
          SONIC_FREQUENCIES.FREQUENCY.hz,
          SONIC_FREQUENCIES.SYNTONY.hz,
          SONIC_FREQUENCIES.COMPATIBILITY.hz
        ], 1500);
      }
      return success;
    }

    checkResonanceByProximity(x, y, targetX, targetY) {
      const distance = Math.hypot(x - targetX, y - targetY);
      const maxDistance = 300;
      const proximity = Math.max(0, 1 - distance / maxDistance);
      this.resonanceLevel = proximity * 0.5;
      this.callbacks.onResonanceChange?.(this.resonanceLevel);
      return this.resonanceLevel;
    }

    delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    get unlocked() { return this.isUnlocked; }
    get resonance() { return this.resonanceLevel; }
    get attempts() { return this.attemptCount; }
    on(event, cb) { if (this.callbacks.hasOwnProperty(event)) this.callbacks[event] = cb; }
    reset() { this.isUnlocked = false; this.resonanceLevel = 0; this.attemptCount = 0; }
  }

  // ============================================================================
  // EXPOSICIÓN GLOBAL
  // ============================================================================

  window.SonicLock = SonicLock;
  window.SONIC_FREQUENCIES = SONIC_FREQUENCIES;
  window.MASTER_KEY_SEQUENCE = MASTER_KEY_SEQUENCE;
  window.BELENTANI_SEQUENCE = BELENTANI_SEQUENCE;

  console.log('[SonicLock] Standalone loaded. Frecuencias:', MASTER_KEY_SEQUENCE.map(s => s.note + ':' + s.hz + 'Hz').join(', '));
})();
