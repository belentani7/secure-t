'use strict';
const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.SECURE_T_URL || 'http://127.0.0.1:8765/campus/';

(async () => {
  const browser = await chromium.launch({headless: true});
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base, {waitUntil: 'load'});
    await page.getByRole('button', {name: 'Guardar cuatro cursos para estudiar offline'}).click();
    await page.waitForFunction(() => {
      const text = document.getElementById('offline-courses-status')?.textContent || '';
      return text.startsWith('Listo:') || text.startsWith('Descarga parcial:') ||
        text.startsWith('No se pudo') || text.startsWith('El modo offline');
    }, null, {timeout: 90000});
    const status = await page.locator('#offline-courses-status').innerText();
    assert.match(status, /^Listo: 112 recursos/, 'The offline pack must fully download: ' + status);
    await context.setOffline(true);
    for (const slug of ['ciber-ofensiva', 'ciber-defensiva', 'ia-aplicada-segura', 'gobernanza-compliance']) {
      const response = await page.goto(new URL('cursos/' + slug + '/index.html', base).href);
      assert.equal(response.status(), 200, 'offline course navigation: ' + slug);
      assert.equal(await page.locator('h1').count() > 0, true);
      for (const filename of ['semana-01.md', 'semana-20.md', 'glosario.md', 'quiz.json']) {
        const result = await page.evaluate(async url => {
          const r = await fetch(url);
          return {status: r.status, bytes: (await r.text()).length};
        }, new URL('cursos/' + slug + '/' + filename, base).href);
        assert.equal(result.status, 200, slug + '/' + filename);
        assert.ok(result.bytes > 40, 'Offline file has substantive content: ' + slug + '/' + filename);
      }
    }
    assert.deepEqual(errors, [], 'Offline student pages must have no uncaught JS errors');
    console.log(JSON.stringify({offlineCourses: 4, weeklyResources: 80, totalPack: 112, pageErrors: 0}));
  } finally {
    await browser.close();
  }
})().catch(error => {console.error(error); process.exitCode = 1;});
