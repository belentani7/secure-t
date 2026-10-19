const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const browser = await chromium.launch({headless:true});
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const base = 'http://127.0.0.1:8765';
  await page.goto(base);
  await page.locator('a[href="./conceptos/index.html"]').click();
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
