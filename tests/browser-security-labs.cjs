// Browser-level contract for complete SOC and threat-modeling user journeys.
// Uses the same Chromium installation as tests/browser-campus.cjs.
// Run against static built site-dist: SECURE_T_BASE_URL=http://127.0.0.1:8765
// PLAYWRIGHT_MODULE=/path/to/playwright node tests/browser-security-labs.cjs
const assert=require('node:assert/strict');
const {mkdirSync}=require('node:fs');
const {join}=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');

async function main(){
  const browser=await chromium.launch({headless:true});
  const origin=process.env.SECURE_T_BASE_URL||'http://127.0.0.1:8765';
  let passed=0;
  try {
    for(const lab of [
      {name:'SOC Decision Lab',path:'/campus/academia/triage.html',input:'decision',submit:'#submit',summary:'#summary',number:6},
      {name:'Threat Modeling Studio',path:'/campus/academia/threat-studio.html',input:'control',submit:'#check',summary:'#finished',number:5},
    ]){
      const page=await browser.newPage({viewport:{width:390,height:844},acceptDownloads:true});
      const exceptions=[];
      page.on('pageerror',x=>exceptions.push(x.message));
      const opened=await page.goto(new URL(lab.path,origin).href,{waitUntil:'domcontentloaded'});
      assert.equal(opened?.status(),200,lab.name+' route');
      await page.locator('#lang').waitFor();
      const choices=page.locator('input[name="'+lab.input+'"]');
      await choices.first().waitFor(); // ES modules load after DOMContentLoaded.
      assert.equal(await choices.count(),3,lab.name+' starts with three alternatives');

      // Partially complete question, switch language and verify the same choice survives.
      await choices.nth(0).check();
      await page.locator('#lang').selectOption('en');
      assert.ok(await choices.nth(0).isChecked(),lab.name+' draft decision persisted');
      // A mobile learner refreshing a tab must not lose the pending answer or language.
      await page.reload({waitUntil:'domcontentloaded'});
      await choices.first().waitFor();
      assert.equal(await page.locator('#lang').inputValue(),'en',lab.name+' restores language after reload');
      assert.ok(await choices.nth(0).isChecked(),lab.name+' restores unfinished answer after reload');
      await page.locator(lab.submit).click();
      await page.locator('#feedback:not([hidden])').waitFor();
      assert.ok(await choices.nth(0).isChecked(),lab.name+' graded decision highlighted');
      assert.ok(await choices.nth(0).isDisabled(),lab.name+' graded decision locked');
      await page.locator('#lang').selectOption('es');
      assert.ok(await choices.nth(0).isChecked(),lab.name+' choice visible after feedback translation');
      assert.ok(await choices.nth(0).isDisabled(),lab.name+' answer remains locked across translations');
      await page.reload({waitUntil:'domcontentloaded'});
      await page.locator('#feedback:not([hidden])').waitFor();
      assert.equal(await page.locator('#lang').inputValue(),'es',lab.name+' reviewed language restored');
      assert.ok(await choices.nth(0).isChecked(),lab.name+' review survives refresh');
      assert.ok(await choices.nth(0).isDisabled(),lab.name+' reviewed state stays locked');
      await page.locator('#next').click();
      assert.equal(await page.locator('#case-meter').getAttribute('value'),'2',lab.name+' visual progress advances');
      assert.equal(await page.evaluate(()=>document.activeElement?.id),'question',lab.name+' new question receives keyboard focus');
      for(let number=1;number<lab.number;number++){
        await page.locator('input[name="'+lab.input+'"]').first().check();
        await page.locator(lab.submit).click();
        await page.locator('#feedback:not([hidden])').waitFor();
        await page.locator('#next').click();
      }
      await page.locator(lab.summary+':not([hidden])').waitFor();
      await page.reload({waitUntil:'domcontentloaded'});
      await page.locator(lab.summary+':not([hidden])').waitFor();
      const score=(await page.locator('#score').innerText()).trim();
      assert.ok(score.endsWith(' / '+lab.number),lab.name+' score total: '+score);
      const downloadWait=page.waitForEvent('download');
      await page.locator('#download').click();
      const downloaded=await downloadWait;
      assert.match(downloaded.suggestedFilename(),/\.txt$/);
      mkdirSync('tests/browser-artifacts',{recursive:true});
      await page.screenshot({path:join('tests/browser-artifacts',lab.input+'-completed-mobile.png'),fullPage:true});
      await page.locator('#restart').click();
      assert.ok(await page.locator('input[name="'+lab.input+'"]').first().isEnabled(),lab.name+' reset starts new attempt');
      await page.reload({waitUntil:'domcontentloaded'});
      const fresh=page.locator('input[name="'+lab.input+'"]');
      await fresh.first().waitFor();
      assert.equal(await page.locator('#lang').inputValue(),'pt',lab.name+' cleared session starts in default language');
      assert.equal(await fresh.first().isChecked(),false,lab.name+' reset clears remembered answers');
      assert.equal(await page.locator('#case-meter').getAttribute('value'),'1',lab.name+' reset shows first case');
      await page.locator('#lang').selectOption('pt');
      assert.equal(await page.locator('#lang').inputValue(),'pt');
      const dimensions=await page.evaluate(()=>({body:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
      assert.ok(dimensions.body<=dimensions.viewport+3,lab.name+' responsive horizontal overflow '+JSON.stringify(dimensions));
      assert.deepEqual(exceptions,[],lab.name+' browser errors');
      console.log('PASS',lab.name,'review, localization, completion, download, reset, mobile');
      passed++;
      await page.close();
    }
    console.log('PASS',passed,'security education lab journeys');
  } finally {await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
