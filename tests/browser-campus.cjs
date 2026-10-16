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
  assert.match(await page.locator('h1').innerText(), /Ofensiva/);
  await context.setOffline(false);
  await page.setViewportSize({width:390,height:844});
  await page.goto(base);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({path:'campus-mobile.png',fullPage:true});
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({journey:'home → concepts → course → quiz → progress → offline lesson',quizQuestions:answered,courses:courses.length,mobileWidth:390,pageErrors:errors.length}));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
