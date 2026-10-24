'use strict';
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async()=>{
  const browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({acceptDownloads:true,viewport:{width:1365,height:900}});
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:8765/campus/');
    await page.evaluate(()=>navigator.serviceWorker.ready);
    await page.goto('http://127.0.0.1:8765/campus/workstation/mission.html');
    assert.equal(await page.locator('.case-option').count(),6);
    assert.equal(await page.locator('#stat-due').innerText(),'48');
    const right=await page.evaluate(()=>window.SecureTMissionControl.cases[0].steps.map(s=>s[2]));
    await page.locator('#decision-options input').nth((right[0]+1)%3).check();
    await page.locator('#decision-submit').click();
    assert.match(await page.locator('#decision-feedback').innerText(),/no está sustentada/);
    for(const index of right){
      await page.locator('#decision-options input').nth(index).check();
      await page.locator('#decision-submit').click();
      assert.match(await page.locator('#decision-feedback').innerText(),/Decisión fundamentada/);
      await page.locator('#decision-next').click();
    }
    assert.match(await page.locator('#decision-count').innerText(),/4\/4/);
    await page.locator('[data-view="journal"]').click();
    await page.locator('#journal-facts').fill('Hay cinco fallos y un inicio correcto en los datos sintéticos. Son los hechos que tenemos.');
    await page.locator('#journal-uncertainty').fill('Un inicio válido posterior a errores puede ser legítimo; falta contexto de dispositivo e identidad.');
    await page.locator('#journal-action').fill('Correlacionaría MFA y sesión con el equipo autorizado, conservaría las trazas y evitaría divulgar datos.');
    await page.locator('#journal-attest').check();
    await page.locator('#journal-form button[type="submit"]').click();
    assert.equal(await page.locator('#stat-complete').innerText(),'1 / 6');
    await page.locator('[data-view="cards"]').click();
    await page.locator('#show-answer').click();
    await page.locator('[data-rating="2"]').click();
    assert.equal(await page.locator('#stat-due').innerText(),'47');
    const ready=page.waitForEvent('download');
    await page.locator('#export-state').click();
    const download=await ready;
    assert.equal(download.suggestedFilename(),'secure-t-mission-control.json');
    await page.reload();
    assert.equal(await page.locator('#stat-complete').innerText(),'1 / 6');
    assert.equal(await page.locator('#stat-due').innerText(),'47');
    await context.setOffline(true);
    await page.reload();
    assert.equal(await page.locator('.case-option').count(),6);
    await context.setOffline(false);
    await page.setViewportSize({width:390,height:840});
    await page.reload();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({success:true,cases:6,decisions:24,cards:48,notes:true,localStorage:true,offline:true,viewport:390}));
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
