/**
 * Sonic Lock Initialization — extracted from index.html inline script
 * Loads with defer AFTER sonic-lock.js so window.SonicLock is available
 */

document.addEventListener('DOMContentLoaded', () => {
  const SonicLock = window.SonicLock;
  const MASTER_KEY_SEQUENCE = window.MASTER_KEY_SEQUENCE;
  const BELENTANI_SEQUENCE = window.BELENTANI_SEQUENCE;

  const container = document.getElementById('sonic-lock-container');
  if (!container || !SonicLock) {
    console.warn('[SonicLock] Container or SonicLock not found');
    return;
  }

  const lock = new SonicLock();

  // Renderizar visualizador de cuerdas
  const stringsHtml = MASTER_KEY_SEQUENCE.map((string, i) => `
    <div class="sonic-string sonic-string--${string.note.toLowerCase()}" data-index="${i}">
      <div class="sonic-string__color-bar" style="height: 0%;"></div>
      <span class="sonic-string__note">${string.note}</span>
      <span class="sonic-string__hz">${string.hz} Hz</span>
      <span class="sonic-string__meaning">${string.meaning}</span>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="sonic-lock" id="sonic-lock-widget">
      <h3 id="sonic-title">🔐 CANDADO SÓNICO</h3>
      <p class="subtitle">A llave no es una contraseña. Es resonancia.</p>

      <div class="sonic-strings">${stringsHtml}</div>

      <div class="sonic-btn-group">
        <button class="sonic-btn sonic-btn--primary" id="btn-sing">🎤 Cantar la llave</button>
        <button class="sonic-btn sonic-btn--secondary" id="btn-master">🎵 Llave Maestra</button>
        <button class="sonic-btn sonic-btn--tertiary" id="btn-belentani">🌌 Secuencia Belentani</button>
      </div>

      <div class="sonic-metrics">
        <div class="sonic-metric">
          <span class="sonic-metric__label">Intentos</span>
          <span class="sonic-metric__value" id="metric-attempts">0</span>
        </div>
        <div class="sonic-metric">
          <span class="sonic-metric__label">Resonancia</span>
          <span class="sonic-metric__value" id="metric-resonance">0%</span>
        </div>
        <div class="sonic-metric">
          <span class="sonic-metric__label">Estado</span>
          <span class="sonic-metric__value sonic-metric__value--locked" id="metric-status">🔒 CERRADO</span>
        </div>
      </div>

      <details class="sonic-details">
        <summary>Ver cuerdas (Teoría de Cuerdas)</summary>
        <pre>${MASTER_KEY_SEQUENCE.map(s =>
  `  ${s.note} (${s.hz}Hz) — ${s.meaning} [${s.color}]`
).join('\n')}</pre>
      </details>
    </div>
  `;

  // Referencias a elementos
  const widget = container.querySelector('#sonic-lock-widget');
  const btnSing = container.querySelector('#btn-sing');
  const btnMaster = container.querySelector('#btn-master');
  const btnBelentani = container.querySelector('#btn-belentani');
  const metricAttempts = container.querySelector('#metric-attempts');
  const metricResonance = container.querySelector('#metric-resonance');
  const metricStatus = container.querySelector('#metric-status');
  const strings = container.querySelectorAll('.sonic-string');

  // Callbacks
  lock.onResonanceChange = (level) => {
    metricResonance.textContent = (level * 100).toFixed(1) + '%';

    // Animar cuerdas según resonancia
    strings.forEach((str, i) => {
      const bar = str.querySelector('.sonic-string__color-bar');
      const targetHeight = level * 100;
      bar.style.height = targetHeight + '%';
      if (level > 0.1) {
        str.classList.add('resonating');
      } else {
        str.classList.remove('resonating');
      }
    });

    if (level > 0.15 && !lock.unlocked) {
      lock.isUnlocked = true;
      lock.onUnlock?.();
    }
  };

  lock.onAttempt = (attempt, success) => {
    metricAttempts.textContent = attempt;
  };

  lock.onUnlock = () => {
    widget.classList.add('unlocking');
    setTimeout(() => {
      widget.classList.remove('unlocking');
      widget.classList.add('sonic-lock--unlocked');
    }, 1000);
    metricStatus.textContent = '🔓 ABIERTO';
    metricStatus.classList.remove('sonic-metric__value--locked');
    metricStatus.classList.add('sonic-metric__value--unlocked');
  };

  // Event listeners
  btnSing?.addEventListener('click', async () => {
    if (btnSing.disabled) return;
    btnSing.disabled = true;
    btnSing.textContent = '🎧 Escuchando...';
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      btnSing.textContent = '🔬 Analizando...';
      await lock.attemptUnlockWithVoice(stream);
      stream.getTracks().forEach(t => t.stop());
    } catch (e) {
      console.warn('Micrófono no disponible:', e);
    }
    btnSing.disabled = false;
    btnSing.textContent = lock.unlocked ? '✅ Desbloqueado' : '🎤 Cantar la llave';
  });

  btnMaster?.addEventListener('click', async () => {
    btnMaster.disabled = true;
    await lock.playMasterKey();
    btnMaster.disabled = false;
  });

  btnBelentani?.addEventListener('click', async () => {
    btnBelentani.disabled = true;
    await lock.playBelentaniSequence();
    btnBelentani.disabled = false;
  });

  // Click en cuerdas para proximidad
  strings.forEach((str, i) => {
    str.addEventListener('click', () => {
      const rect = str.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      lock.checkResonanceByProximity(x, y, x, y);
    });
  });

  console.log('[SonicLock] Inicializado. Frecuencias:', MASTER_KEY_SEQUENCE.map(s => `${s.note}:${s.hz}Hz`).join(', '));
});
