'use strict';
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const context=await browser.newContext({acceptDownloads:true,viewport:{width:1366,height:900}});
  const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:8765/campus/';
  await page.goto(base);await page.evaluate(()=>navigator.serviceWorker.ready);
  await page.goto(base+'observatorio/labs.html');
  assert.equal(await page.locator('.lab-side-button').count(),14);
  assert.equal(await page.locator('#labs-total').innerText(),'0 / 14 completados');
  const lessons=await page.evaluate(()=>window.SecureTObservatoryLabs.lessons.map(l=>({id:l.id,answers:l.questions.map(q=>q[2])})));
  for(let i=0;i<lessons.length;i++){
   const lesson=lessons[i];
   await page.goto(base+'observatorio/labs.html?topic='+lesson.id);
   assert.equal(await page.locator('#lab-questions .lab-question').count(),2);
   for(let j=0;j<2;j++){
    const question=page.locator('#lab-questions .lab-question').nth(j);
    await question.locator('input[type=radio]').nth(lesson.answers[j]).check();
    await question.locator('button[type=submit]').click();
    assert.match(await question.locator('.lab-answer-feedback').innerText(),/Correcto/);
   }
   await page.locator('#lab-notes').fill('Hechos: registros y eventos ficticios. Incertidumbre: no existe suficiente información para atribuir una causa ni una persona real. Verificación autorizada: comparar el contexto adicional bajo permiso escrito sin contactar terceros.');
   await page.locator('#lab-confirm').check();
   await page.locator('#lab-submit').click();
   assert.match(await page.locator('#lab-journal-status').innerText(),/autoevaluado/);
   assert.match(await page.locator('#labs-total').innerText(),new RegExp((i+1)+' \\/ 14'));
  }
  const dlPromise=page.waitForEvent('download');
  await page.locator('#lab-export').click();
  assert.equal((await dlPromise).suggestedFilename(),'secure-t-labs-cuaderno.json');
  await page.reload();
  assert.equal(await page.locator('#labs-total').innerText(),'14 / 14 completados');
  await page.locator('#lab-next').click();
  assert.notEqual(await page.locator('#lab-title').innerText(),'');
  await context.setOffline(true);await page.reload();
  assert.equal(await page.locator('.lab-side-button').count(),14);
  await context.setOffline(false);
  for(const width of [320,390,768,1366]){
   await page.setViewportSize({width,height:900});
   await page.reload();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'horizontal overflow '+width);
  }
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({ok:true,subjects:14,assessedDecisions:28,notebooks:14,export:true,offline:true,responsive:true}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
