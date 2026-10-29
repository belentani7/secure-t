'use strict';
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const base = 'http://127.0.0.1:8765';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  try {
    const context = await browser.newContext({ locale: 'es-ES', viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));

    await page.goto(base + '/?lang=es');
    assert.equal(await page.locator('html').getAttribute('lang'), 'es');
    assert.equal(await page.locator('#language').inputValue(), 'es');
    assert.match(await page.locator('#hero-title').innerText(), /Seguridad digital/);

    await page.locator('#language').selectOption('pt');
    assert.equal(new URL(page.url()).searchParams.get('lang'), 'pt');
    assert.equal(await page.locator('html').getAttribute('lang'), 'pt');
    await page.reload();
    assert.equal(await page.locator('#language').inputValue(), 'pt');
    assert.match(await page.locator('#hero-title').innerText(), /Segurança digital/);

    await page.locator('#language').selectOption('en');
    assert.equal(new URL(page.url()).searchParams.get('lang'), 'en');
    await page.goto(base + '/');
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.match(await page.locator('#hero-title').innerText(), /Digital security/);

    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement?.classList.contains('skip-link')), true);
    await page.locator('a[href="campus/primeros-pasos.html"]').first().click();
    assert.match(page.url(), /campus\/primeros-pasos\.html$/);

    const noScriptContext = await browser.newContext({ javaScriptEnabled: false });
    const noScript = await noScriptContext.newPage();
    await noScript.goto(base + '/');
    assert.equal(await noScript.locator('html').getAttribute('lang'), 'pt');
    assert.equal(await noScript.locator('#language').inputValue(), 'pt');
    assert.match(await noScript.locator('#hero-title').innerText(), /Segurança digital/);

    const mobileContext = await browser.newContext({
      locale: 'es-ES',
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
    });
    const mobile = await mobileContext.newPage();
    mobile.on('pageerror', error => errors.push(error.message));
    await mobile.goto(base + '/?lang=es');
    assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.equal(await mobile.locator('a[href="campus/"]').first().isVisible(), true);
    assert.equal(await mobile.locator('#hero-title').isVisible(), true);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({
      journey: 'Spanish → Portuguese → reload → English → first mission',
      noScriptLanguage: 'pt',
      mobileWidth: 390,
      pageErrors: errors.length,
    }));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
