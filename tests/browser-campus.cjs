const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const browser = await chromium.launch({headless:true,
    ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? {executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH} : {})});
  const context = await browser.newContext({colorScheme:'dark'});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const base = 'http://127.0.0.1:8765';
  // Verify the real landing while third-party networks are unavailable.
  await context.route('**/*', route => route.request().url().startsWith(base + '/')
    ? route.continue() : route.abort());
  await page.goto(base);
  await page.locator('a[href="conceptos/index.html"]').click();
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
  assert.equal(await page.locator('#mobile-menu').isHidden(),true);
  await page.locator('#menu-btn').click();
  assert.equal(await page.locator('#menu-btn').getAttribute('aria-expanded'),'true');
  assert.equal(await page.locator('#mobile-menu').isVisible(),true);
  await page.locator('#menu-btn').click();
  assert.equal(await page.locator('#mobile-menu').isHidden(),true);
  assert.ok(await page.locator('svg.lucide').count() > 10, 'icons must load locally');
  for (const width of [320,390,768,1024,1440]) {
    await page.setViewportSize({width,height:844});
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true,
      'landing must fit viewport width '+width);
  }
  await page.setViewportSize({width:390,height:844});
  // Scroll through the actual page so entrance animations can finish before QA.
  for (let y=0; y<await page.evaluate(() => document.body.scrollHeight); y+=650) {
    await page.evaluate(y => scrollTo(0,y),y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => scrollTo(0,0));
  await page.waitForTimeout(600);
  await page.screenshot({path:'campus-mobile.png',fullPage:true});
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({journey:'home → concepts → course → quiz → progress → offline lesson',quizQuestions:answered,courses:courses.length,mobileWidth:390,pageErrors:errors.length}));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
