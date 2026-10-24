'use strict';
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.SECURE_T_URL||'http://127.0.0.1:8765/campus/';
(async()=>{
 const browser=await chromium.launch({headless:true});
 const paths=[
  ['observatorio/labs.html','Laboratorios guiados'],
  ['observatorio/','Observatorio'],
  ['workstation/mission.html','Mission Control'],
  ['workstation/','Workstation']
 ];
 let passed=0;
 try{
  for(const [path,title] of paths){
   const context=await browser.newContext();
   try{
    const page=await context.newPage();
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const online=await page.goto(new URL(path,base).href);
    assert.equal(online.status(),200);
    const scope=await page.evaluate(()=>Promise.race([
      navigator.serviceWorker.ready.then(r=>r.scope),
      new Promise((_,reject)=>setTimeout(()=>reject(new Error('SW unavailable from direct entry')),15000))
    ]));
    assert.equal(new URL(scope).pathname,new URL(base).pathname);
    await context.setOffline(true);
    const response=await page.reload({waitUntil:'domcontentloaded'});
    assert.equal(response.status(),200);
    assert.match(await page.title(),new RegExp(title));
    assert.deepEqual(errors,[]);
    passed++;
   }finally{await context.close();}
  }
  // Invalid routes must not silently masquerade as the home page offline.
  const context=await browser.newContext();
  try{
   const page=await context.newPage();
   await page.goto(new URL('observatorio/labs.html',base).href);
   await page.evaluate(()=>navigator.serviceWorker.ready);
   await context.setOffline(true);
   await assert.rejects(()=>page.goto(new URL('observatorio/not-a-real-page-404.html',base).href));
  }finally{await context.close();}
  console.log(JSON.stringify({ok:true,deepLinks:passed,offline:false /* intentionally no connection */,homeFallbackForUnknown:false}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
