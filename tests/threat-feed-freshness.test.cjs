'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'..','campus','amenazas.html'),'utf8');
const code=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
const make=()=>({textContent:'',innerHTML:'',style:{},classList:{add(){},remove(){},toggle(){}},dataset:{},disabled:false,addEventListener(){},replaceChildren(...x){this.children=x},append(...x){this.children=(this.children||[]).concat(x)}});
const buildData=()=>({
 generated_utc:'2026-10-01T04:13:24Z',
 kev:{catalog_version:'2026.09.30',recent:[{cve_id:'CVE-2026-54321',vendor:'Demo',product:'Fixture',short_description:'<img src=x onerror=alert(1)>',date_added:'2026-09-30',ransomware:false}]},
 nvd_critical_recent:[{cve_id:'<svg/onload=alert(1)>',description:'<img src=x onerror=alert(1)>',score:9.9,published:'2026-09-30',attack_vector:'"><img>'}],
 stats:{total_kev:1,ransomware_linked:0,ransomware_pct:0,top_vendors:[{vendor:'<svg/onload=alert(1)>',count:1}],top_cwes:[{cwe:'CWE-79',count:1}],timeline:[{month:'2026-09',count:1}]}
});
async function run(data){
 const els={};
 const document={getElementById:id=>els[id]||(els[id]=make()),createElement:make,querySelectorAll:()=>[]};
 let fetches=0;
 const fetch=async()=>{fetches++;return {ok:true,json:async()=>data};};
 const now=Date.parse('2026-10-24T09:00:00Z');
 const FakeDate=class extends Date{constructor(...args){super(...(args.length?args:[now]));}static now(){return now;}};
 vm.runInNewContext(code,{document,fetch,Date:FakeDate,window:{scrollTo(){}}});
 await new Promise(resolve=>setTimeout(resolve,0));
 return {els,fetches};
}
test('threat portal documents timestamp honestly instead of claiming live feed',()=>{
 assert.doesNotMatch(html,/<p class="eyebrow">Threat Intelligence · Live/);
 assert.doesNotMatch(html,/Datos en tiempo real desde/);
 assert.match(html,/id="freshness"/);
 assert.match(html,/href="observatorio\/"/);
});
test('old local data triggers explicit 23-day warning; official sources are linked',async()=>{
 const {els,fetches}=await run(buildData());
 assert.equal(fetches,1);
 assert.match(els.freshness.textContent,/23 días/);
 assert.match(els.freshness.textContent,/NO refleja nuevas alertas/);
 assert.match(html,/cisa.gov\/known-exploited-vulnerabilities-catalog/);
});
test('unsafe CVE, vendor and descriptions are encoded in every rendered panel',async()=>{
 const {els}=await run(buildData());
 assert.match(els['kev-table-wrap'].innerHTML,/&lt;img/);
 assert.match(els['nvd-list'].innerHTML,/&lt;svg/);
 assert.match(els['vendor-chart'].innerHTML,/&lt;svg/);
 assert.doesNotMatch(els['nvd-list'].innerHTML,/<svg\/onload/);
});
test('missing data yields stable error without echoing untrusted messages',async()=>{
 const els={};const document={getElementById:id=>els[id]||(els[id]=make()),createElement:make,querySelectorAll:()=>[]};
 const fetch=async()=>{throw new Error('<img src=x onerror=alert(1)>');};
 vm.runInNewContext(code,{document,fetch,Date,window:{scrollTo(){}}});
 await new Promise(resolve=>setTimeout(resolve,0));
 assert.match(els.freshness.textContent,/no disponibles/i);
 assert.doesNotMatch(els['kev-table-wrap'].children?.[0]?.textContent||'',/<img/);
});
