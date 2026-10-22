import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LANGUAGES,THREATS,WORDS,riskScore,riskTier,isValidThreat,assessControl,exportThreatReport} from '../campus/academia/threat-core.mjs';
test('Five localized defensive threat models include assets, boundaries, risk and evidence',()=>{
 assert.equal(THREATS.length,5);
 assert.equal(new Set(THREATS.map(t=>t.id)).size,THREATS.length);
 for(const item of THREATS){
  assert.ok(isValidThreat(item),item.id);
  assert.ok(riskScore(item)>=1&&riskScore(item)<=25);
  assert.ok(['high','medium','low'].includes(riskTier(item)));
  assert.equal(assessControl(item,item.correct),true);
  for(let i=0;i<3;i++)if(i!==item.correct)assert.equal(assessControl(item,i),false);
 }
 for(const l of LANGUAGES)for(const key of ['title','subtitle','boundary','check','evidence','done','download','note'])assert.ok(WORDS[l]?.[key]);
 assert.throws(()=>assessControl(THREATS[0],3),RangeError);
 assert.throws(()=>riskScore({likelihood:100,impact:2}),RangeError);
});
test('Learning report is only from fictional curated cases',()=>{
 const answers=THREATS.map(t=>t.correct);
 for(const l of LANGUAGES){
  const report=exportThreatReport(answers,l);
  assert.equal((report.match(/Result|Defesa adequada|Controles adecuados|Appropriate safeguard|Appropriate controls|true/g)||[]).length>0,true);
  assert.equal((report.match(/SYNTHETIC LEARNING DATA/g)||[]).length,1);
  for(const item of THREATS)assert.ok(report.includes(item.id)||report.includes(item.asset[l]));
 }
 assert.throws(()=>exportThreatReport([], 'es'),RangeError);
 assert.throws(()=>exportThreatReport(answers,'zz'),RangeError);
});
test('Studio is keyboard-friendly and does not send requests',()=>{
 const html=readFileSync(new URL('../campus/academia/threat-studio.html',import.meta.url),'utf8');
 for(const phrase of ['aria-live="polite"','<fieldset','<legend','name="viewport"','threat-core.mjs','type="module"','prefers-reduced-motion'])assert.ok(html.includes(phrase),phrase);
 assert.doesNotMatch(html,/XMLHttpRequest|fetch\s*\(|sendBeacon|localStorage|innerHTML|<script[^>]*src="https?:/i);
});
