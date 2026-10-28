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
   // Different browsers surface an uncached offline navigation as a rejected
   // goto, a network error response, or an explicit not-found status.
   // Never accept a successful (200) home-page fallback for an unknown route.
   const missingUrl = new URL('observatorio/not-a-real-page-404.html',base).href;
   let missing;
   try {
    const response = await page.goto(missingUrl,{waitUntil:'domcontentloaded'});
    missing = {status:response?.status(),url:page.url(),title:await page.title()};
   } catch(error) {
    missing = {error:String(error?.message||error)};
   }
   assert.ok(missing.error || missing.status===404 || missing.status===410,
     'Unknown offline route must not masquerade as success: '+JSON.stringify(missing));
  }finally{await context.close();}
  console.log(JSON.stringify({ok:true,deepLinks:passed,offline:true,homeFallbackForUnknown:false}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
