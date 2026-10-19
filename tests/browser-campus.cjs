const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const browser = await chromium.launch({headless:true});
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const base = 'http://127.0.0.1:8765';
  // Five-year academy: actual Portuguese entry, filters, study evidence and offline shell.
  await page.goto(base + '/campus/academia/');
  assert.equal(await page.locator('html').getAttribute('lang'), 'pt-BR');
  assert.equal(await page.locator('.course-card').count(), 60);
  assert.match(await page.locator('#clock-rio').innerText(), /\d{2}:\d{2}/);
  assert.match(await page.locator('#clock-barcelona').innerText(), /\d{2}:\d{2}/);
  assert.match(await page.locator('#clock-dublin').innerText(), /\d{2}:\d{2}/);
  await page.locator('#year-filters button').nth(1).click();
  assert.equal(await page.locator('.course-card').count(), 12);
  await page.locator('#year-filters button').first().click();
  await page.locator('button[data-lang="es"]').click();
  assert.equal(await page.locator('html').getAttribute('lang'), 'es');
  assert.match(await page.locator('#hero-title').innerText(), /conocimiento/i);
  await page.locator('.course-card').first().locator('button').click();
  assert.match(await page.locator('.lesson h4').first().innerText(), /Arquitectura de computadores/);
  await page.locator('button[data-lang="en"]').click();
  assert.match(await page.locator('.lesson h4').first().innerText(), /Computer architecture/);
  await page.locator('button[data-lang="pt"]').click();
  assert.match(await page.locator('.lesson h4').first().innerText(), /Arquitetura de computadores/);
  assert.equal(await page.locator('.lesson').count(), 4);
  const firstLesson = page.locator('.lesson').first();
  assert.equal(await firstLesson.locator('input[type="checkbox"]').isDisabled(), true);
  await firstLesson.locator('textarea').fill('Estudei os objetivos do módulo com atenção. Registrei um exemplo documentado, os limites e como validaria as evidências num laboratório autorizado.');
  await firstLesson.locator('input[type="checkbox"]').check();
  assert.equal(await page.locator('#count-progress').innerText(), '0.4%'); // First of 240 units must be visible to the learner.
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('stt-academia-progress'))['ST-011/0']), true);
  // Seamless reading-to-understanding journey, including localized feedback.
  await page.locator('#course-self-check').click();
  assert.match(await page.locator('#check-prompt').innerText(), /diferença entre programa e processo/i);
  assert.equal(await page.locator('.check-choice').count(),3);
  await page.locator('.check-choice input').first().check();
  await page.locator('#check-submit').click();
  assert.match(await page.locator('#check-feedback').innerText(), /correta/i);
  await page.locator('button[data-lang="es"]').click();
  assert.match(await page.locator('#check-title').innerText(), /comprendido/i);
  assert.equal(await page.locator('#check-course-select option').count(),24);
  await page.locator('button[data-lang="en"]').click();
  assert.match(await page.locator('#check-title').innerText(), /understood/i);
  await page.locator('button[data-lang="pt"]').click();
  assert.deepEqual(errors,[], 'Trilingual formative checks must be interactive without errors');

  const academyUpload = page.waitForEvent('filechooser');
  await page.locator('#import-progress').click();
  const academyChooser = await academyUpload;
  await academyChooser.setFiles({name:'academia-bad.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({version:1,progress:{'outside':true},evidence:{'outside':'x'.repeat(90)}}))});
  assert.match(await page.locator('#data-status').innerText(), /inválido|inválida/i);
  assert.deepEqual(errors, [], 'New academy must not throw browser exceptions');

  // Authentic first semester: the learner can read, rehearse, and schedule locally.
  await page.goto(base + '/campus/academia/');
  assert.match(await page.locator('#review-task').innerText(), /Desenhe um diagrama/);
  await page.locator('#review-reveal').click();
  assert.equal(await page.locator('#review-solution').isVisible(),true);
  assert.match(await page.locator('#review-explanation').innerText(), /arquitetura distingue CPU/i);
  await page.locator('[data-review-score="2"]').click();
  const review = await page.evaluate(() => JSON.parse(localStorage.getItem('stt-academia-review-v1')));
  assert.equal(review['ST-011/0'].count,1);
  assert.ok(review['ST-011/0'].next > Date.now());
  await page.locator('button[data-lang="en"]').click();
  assert.match(await page.locator('#review-task').innerText(), /Inspect your device/);
  assert.deepEqual(errors, [], 'Spaced-repetition room must not throw browser errors');

  // Complete privacy lifecycle: export notes + review schedule, restore
  // validated data, then erase only this academy's records.
  await page.evaluate(() => {
    const original = URL.createObjectURL.bind(URL);
    URL.createObjectURL = blob => {
      window.__academyBackupBlob = blob;
      return original(blob);
    };
  });
  await page.locator('#export-progress').click();
  const portableBackup = await page.evaluate(async () => JSON.parse(await window.__academyBackupBlob.text()));
  assert.equal(portableBackup.version, 1);
  assert.equal(portableBackup.progress['ST-011/0'],true);
  assert.ok(portableBackup.evidence['ST-011/0'].length >= 80);
  assert.equal(portableBackup.review['ST-011/0'].count, 1);
  const beforeLocale = await page.evaluate(() => localStorage.getItem('stt-academia-lang'));

  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#clear-learning-data').click();
  await page.waitForLoadState();
  assert.deepEqual(await page.evaluate(() => ({
    progress:localStorage.getItem('stt-academia-progress'),
    evidence:localStorage.getItem('stt-academia-evidence'),
    review:localStorage.getItem('stt-academia-review-v1'),
  })),{progress:null,evidence:null,review:null});
  assert.equal(await page.evaluate(() => localStorage.getItem('stt-academia-lang')),beforeLocale);
  const importPromise = page.waitForEvent('filechooser');
  await page.locator('#import-progress').click();
  const backupPicker = await importPromise;
  await backupPicker.setFiles({name:'academy-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(portableBackup))});
  await page.waitForLoadState();
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('stt-academia-progress'))['ST-011/0']),true);
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('stt-academia-review-v1'))['ST-011/0'].count),1);
  assert.deepEqual(errors, [], 'The backup, restore, and erase operations must not throw browser errors');


  // Third semester lesson: real reading and exercise, localized across PT/ES/EN.
  await page.goto(base + '/campus/academia/');
  await page.locator('#year-filters button').nth(2).click();
  assert.equal(await page.locator('.course-card').count(), 12);
  await page.locator('.course-card').first().locator('button').click();
  assert.match(await page.locator('.lesson h4').first().innerText(), /Hash e integridade/);
  assert.match(await page.locator('.lesson-reading').first().innerText(), /função hash criptográfica/i);
  assert.match(await page.locator('.lesson-practice').first().innerText(), /impressão digital/i);
  await page.locator('button[data-lang="es"]').click();
  assert.match(await page.locator('.lesson-reading').first().innerText(), /función hash criptográfica/i);
  await page.locator('button[data-lang="en"]').click();
  assert.match(await page.locator('.lesson-reading').first().innerText(), /cryptographic hash/i);
  assert.deepEqual(errors, [], 'Third-semester authored lessons must render without exceptions');

  // Consent-based speech tutor: one microphone gesture yields one question,
  // and Stop must suppress any late transcript from a cancelled session.
  await page.addInitScript(() => {
    window.confirm = () => true;
    window.SpeechRecognition = class SyntheticRecognition {
      start() {
        setTimeout(() => {
          this.onresult?.({results:[[{transcript:'Explique Zero Trust'}]]});
          this.onend?.();
        }, 25);
      }
      abort() { this.onend?.(); }
    };
  });
  await page.goto(base + '/campus/academia/');
  const voiceAuto = page.locator('#voice-auto-send');
  await voiceAuto.click();
  assert.equal(await voiceAuto.getAttribute('aria-pressed'),'true');
  await page.locator('#voice-listen').click();
  await page.locator('.chat-message.mine').last().waitFor();
  assert.match(await page.locator('.chat-message.mine').last().innerText(), /Explique Zero Trust/);
  await page.locator('.chat-message:not(.mine)').last().waitFor();
  const voiceCount = await page.locator('.chat-message.mine').count();
  await page.locator('#voice-listen').click();
  await page.locator('#voice-stop').click();
  await page.waitForTimeout(80);
  assert.equal(await page.locator('.chat-message.mine').count(),voiceCount,
    'Stopping the mic must not send late recognized text');
  assert.deepEqual(errors, [], 'Voice tutor must not throw in the browser');


  await page.goto(base);
  await page.locator('a[href="conceptos/index.html"]').first().click();
  assert.match(page.url(), /conceptos/);
  let answered = 0;
  const courses = ['ciber-ofensiva', 'ciber-defensiva', 'ia-aplicada-segura', 'gobernanza-compliance'];
  for (const slug of courses) {
    await page.goto(base);
    await page.locator(`a[href^="campus/cursos/${slug}/"]`).first().click();
    await page.locator('#quiz').scrollIntoViewIfNeeded();
    assert.deepEqual(errors, [], `Course ${slug} must initialize without errors`);
    const answers = await page.evaluate(() => QUIZ.map(q => q.opciones[q.correcta]));
    for (const answer of answers) {
      await page.getByRole('button', {name:answer,exact:true}).click();
      await page.locator('#q-next').click();
    }
    assert.match(await page.locator('#q-titulo').innerText(), /Terminado/);
    assert.equal(await page.evaluate(slug => JSON.parse(localStorage.getItem('stt-progreso'))[slug + '/quiz'], slug), true);
    answered += answers.length;
  }
  await page.goto(base + '/campus/progreso.html');
  assert.equal(await page.locator('input[type="checkbox"]:checked').count(), courses.length);
  // Broken browser storage must not crash progress or permit malformed imports.
  const previousProgress = await page.evaluate(() => localStorage.getItem('stt-progreso'));
  await page.evaluate(() => localStorage.setItem('stt-progreso', '{not-json'));
  await page.reload();
  assert.deepEqual(errors, [], 'Corrupted localStorage must be handled safely');
  const uploadPromise = page.waitForEvent('filechooser');
  await page.locator('#importar').click();
  const chooser = await uploadPromise;
  await chooser.setFiles({
    name: 'malformed-progress.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({version:1,estado:{"outside/unsafe":true}})),
  });
  assert.match(await page.locator('#estado').innerText(), /No se pudo importar/);
  await page.evaluate(previous => localStorage.setItem('stt-progreso', previous), previousProgress);
  await page.reload();
  assert.deepEqual(errors, [], 'Restoring progress must not create JS errors');

  // Exercise the complete local-only verification path; never mistake a hash
  // for an issuer's signature or a diploma.
  await page.evaluate(() => {
    const p = JSON.parse(localStorage.getItem('stt-progreso') || '{}');
    for (let week = 1; week <= 20; week++) {
      p['ciber-ofensiva/semana-' + String(week).padStart(2, '0')] = true;
    }
    for (const part of ['quiz', 'laboratorio', 'proyecto', 'examen']) {
      p['ciber-ofensiva/' + part] = true;
    }
    localStorage.setItem('stt-progreso', JSON.stringify(p));
  });
  await page.goto(base + '/campus/credencial.html');
  await page.locator('#evidencia').fill('Laboratorio local SOC: análisis documentado de alertas.');
  await page.locator('#sellar').click();
  const output = await page.locator('#salida').innerText();
  const block = JSON.parse(output.slice(output.indexOf('{')));
  assert.equal(block.v, 2);
  assert.equal('token' in block, false);
  await page.locator('#bloque').fill(JSON.stringify(block));
  await page.locator('#btn-verificar').click();
  assert.match(await page.locator('#veredicto').innerText(), /Huella coherente/);
  await page.locator('#bloque').fill(JSON.stringify({...block, evidencia: 'alterado'}));
  await page.locator('#btn-verificar').click();
  assert.match(await page.locator('#veredicto').innerText(), /Huella diferente/);
  await page.goto(base + '/campus/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.goto(base + '/campus/cursos/ciber-ofensiva/index.html');
  await page.reload();
  await page.waitForFunction(async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith('secure-t-campus:') && await (await caches.open(name)).match(location.href)) return true;
    }
    return false;
  });
  await context.setOffline(true);
  await page.reload();
  assert.match(await page.locator('h1').first().innerText(), /Ofensiva/);
  await context.setOffline(false);
  await page.setViewportSize({width:390,height:844});
  await page.goto(base);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({path:'campus-mobile.png',fullPage:true});
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({journey:'home → concepts → course → quiz → progress → offline lesson',quizQuestions:answered,courses:courses.length,mobileWidth:390,pageErrors:errors.length}));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
