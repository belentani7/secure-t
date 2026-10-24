'use strict';
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const context=await browser.newContext({viewport:{width:1366,height:850}});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:8765/campus/';
  await page.goto(base+'observatorio/labs.html?topic=soc');
  const answers=await page.evaluate(()=>window.SecureTObservatoryLabs.lessons[0].questions.map(q=>q[2]));
  for(let i=0;i<2;i++){
   const q=page.locator('.lab-question').nth(i);
   await q.locator('input[type=radio]').nth(answers[i]).check();
   await q.locator('button[type=submit]').click();
  }
  await page.locator('#lab-notes').fill('Hechos: los eventos de autenticación son ficticios y no demuestran intrusión. Incertidumbre: falta conocer contexto del dispositivo y MFA. Verificación: contrastar registros de prueba con autorización documentada.');
  await page.locator('#lab-confirm').check();
  await page.locator('#lab-submit').click();
  assert.equal(await page.locator('#labs-total').innerText(),'1 / 14 completados');
  await page.goto(base+'workstation/mission.html');
  const decisions=await page.evaluate(()=>window.SecureTMissionControl.cases[0].steps.map(s=>s[2]));
  for(const choice of decisions){
   await page.locator('#decision-options input').nth(choice).check();
   await page.locator('#decision-submit').click();
   await page.locator('#decision-next').click();
  }
  await page.locator('[data-view=journal]').click();
  for(const [id,content] of [
   ['journal-facts','Cinco fallos y un inicio de sesión correcto constan en la muestra ficticia y nada más.'],
   ['journal-uncertainty','Sin datos suficientes de MFA y dispositivos no cabe afirmar autoría ni compromiso de identidad.'],
   ['journal-action','Con permiso del responsable validaría correlación con MFA y conservaría registros sin publicar detalles.']
  ])await page.locator('#'+id).fill(content);
  await page.locator('#journal-attest').check();
  await page.locator('#journal-form button[type=submit]').click();
  assert.equal(await page.locator('#stat-complete').innerText(),'1 / 6');
  await page.goto(base+'observatorio/');
  await page.locator('[data-section="mi-plan"]').click();
  assert.match(await page.locator('#plan-labs').innerText(),/1\/14 ejercicios/);
  assert.match(await page.locator('#plan-mission').innerText(),/1\/6 escenarios/);
  await page.reload();
  await page.locator('[data-section="mi-plan"]').click();
  assert.match(await page.locator('#plan-labs').innerText(),/1\/14/);
  assert.match(await page.locator('#plan-mission').innerText(),/1\/6/);
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({ok:true,labs:1,missions:1,localBridge:true,persisted:true,noServerAccount:true}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
