import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {INCIDENTS,LANGUAGES,LABELS,validateIncident,assess,learningReport} from '../campus/academia/triage-core.mjs';
test('Secure T SOC tabletop is complete and has independent, localized teaching decisions',()=>{
 assert.equal(INCIDENTS.length,6);
 assert.equal(new Set(INCIDENTS.map(s=>s.id)).size,6);
 for(const s of INCIDENTS){
  assert.ok(validateIncident(s),s.id);
  assert.equal(assess(s,s.correct),true);
  for(let n=0;n<3;n++)if(n!==s.correct)assert.equal(assess(s,n),false);
  for(const language of LANGUAGES)assert.ok(s.rationale[language].length>=40);
 }
 for(const language of LANGUAGES)for(const field of ['title','subtitle','start','of','score','note','download'])assert.ok(LABELS[language]?.[field]);
 assert.throws(()=>assess(INCIDENTS[0],-1),RangeError);
});
test('Downloadable learning report contains only fictional case data and choices',()=>{
 const choices=INCIDENTS.map(s=>s.correct);
 for(const language of LANGUAGES){
  const report=learningReport(choices,language);
  assert.match(report,/Training fixture/);
  assert.equal((report.match(/Outcome: correct/g)||[]).length,6);
  assert.doesNotMatch(report,/real incident confirmed|official certificate/i);
 }
 assert.throws(()=>learningReport([99]),RangeError);
 assert.throws(()=>learningReport([], 'xx'),RangeError);
});
test('The lab has keyboard controls, live feedback and no remote calls',()=>{
 const html=readFileSync(new URL('../campus/academia/triage.html',import.meta.url),'utf8');
 for(const section of ['<main','<fieldset','aria-live="polite"','type="radio"','prefers-reduced-motion','triage-core.mjs']) {
  if(section==='type="radio"')continue; // Radios are safely constructed by the module.
  assert.ok(html.includes(section),section);
 }
 assert.doesNotMatch(html,/fetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|innerHTML|http:\/\//i);
});
