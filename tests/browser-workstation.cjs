const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  const root = 'http://127.0.0.1:8765';

  await page.goto(root + '/campus/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.locator('a[href="workstation/"]').click();
  assert.match(page.url(), /\/campus\/workstation\//);
  assert.match(await page.locator('#dashboard-title').innerText(), /aprender a defender/);
  assert.equal(await page.locator('#dashboard-cases .scenario').count(), 3);

  await page.locator('[data-panel="terminal"]').click();
  await page.locator('#terminal-command').fill('grep FAILED /cases/auth.log');
  await page.locator('#terminal-form button[type="submit"]').click();
  const output = page.locator('#terminal-output');
  assert.match(await output.innerText(), /FAILED/);
  await page.locator('#terminal-command').fill('curl https://real-site.invalid');
  await page.locator('#terminal-form button[type="submit"]').click();
  assert.match(await output.innerText(), /Comando no disponible|no admite shell/);

  await page.locator('[data-panel="cases"]').click();
  assert.equal(await page.locator('#case-list button').count(), 3);
  assert.match(await page.locator('#case-detail').innerText(), /198\.51\.100\.24/);

  await page.locator('[data-panel="notebook"]').click();
  await page.locator('#evidence-action').selectOption('verify');
  await page.locator('#evidence-notes').fill(
    'Hecho observable: cinco intentos fallidos seguidos de un éxito desde una IP de documentación. ' +
    'Hipótesis: puede ser un inicio legítimo o un evento de riesgo. Falta verificar la identidad, ' +
    'el dispositivo, el estado de MFA y el origen con los equipos autorizados. No hay prueba de intrusión.'
  );
  await page.locator('#evidence-attest').check();
  await page.locator('#evidence-form button[type="submit"]').click();
  assert.match(await page.locator('#evidence-result').innerText(), /Autoevaluación estructural superada/);

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#export-evidence').click();
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), 'secure-t-cuaderno.json');

  await page.reload();
  await page.locator('[data-panel="dashboard"]').click();
  assert.match(await page.locator('#progress-count').innerText(), /1 \/ 3/);

  await context.setOffline(true);
  await page.reload();
  assert.equal(await page.locator('#dashboard-cases .scenario').count(), 3, 'pre-cached workstation must work offline');
  await context.setOffline(false);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true,
    'workstation should not overflow horizontally at 390px');
  assert.deepEqual(errors, [], 'no uncaught browser errors');
  console.log(JSON.stringify({ workstation: 'student journey + terminal + SOC + evidence + export + persistence + offline + mobile',
    scenarios: 3, mobileWidth: 390, pageErrors: errors.length }));
  await browser.close();
})().catch(err => { console.error(err); process.exit(1); });
