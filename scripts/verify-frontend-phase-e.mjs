#!/usr/bin/env node
// Independent Phase E gate. Fails on missing, empty, simulated, or incomplete evidence.
import {readFile, stat} from 'node:fs/promises';
import {join} from 'node:path';
const repo=process.env.PHASE_E_REPO||'secure-t';
const dir=join('.audit',repo,'tools');
const read=async name=>JSON.parse(await readFile(join(dir,name),'utf8'));
const required=[
 'chrome-devtools','playwright','axe-devtools','cdp','web-validator','w3c','midos',
 'uimax','frontend-inspo','frontend-qa-scan','frontend-qa-bundle',
 'frontend-qa-static','lighthouse-ci','pa11y','html-validate','webperf','axe-cli',
 'screenshot-desktop','screenshot-tablet','screenshot-mobile',
 'foxhole','webby','web-quality','sytecheck','accesslumens','lo-eyes','a11y-copilot'
];
const errors=[];
let manifest, gate;
try{manifest=await read('manifest.json');gate=await read('GATE.json')}catch(e){throw Error('Evidence missing or not JSON: '+e)}
const actual=new Map((manifest.records||[]).map(x=>[x.name,x]));
const url=manifest.target;
if(!url || !url.includes('127.0.0.1:4173/')) errors.push('Audit URL is not the repository local server');
if(manifest.repo!==repo)errors.push('Repository mismatch');
for(const name of required){
 const rec=actual.get(name);
 if(!rec){errors.push(name+': no command recorded');continue;}
 if(!rec.command || !rec.at){errors.push(name+': no command/timestamp');continue;}
 if(rec.status!=='passed'){errors.push(name+': '+rec.status+' '+(rec.error||''));continue;}
 if(rec.command.startsWith('npm view'))errors.push(name+': registry metadata is not a tool execution');
 if(name==='chrome-devtools'||name==='playwright'||name==='w3c'){
   try{
    const m=await read(name+'-mcp.json');
    if(!m.responses?.some(x=>x.id===3&&!x.error&&!x.result?.isError))errors.push(name+': MCP tools/call not proven');
   }catch(e){errors.push(name+': missing MCP evidence '+e)}
 }else{
   try{
    const report=await read(name+'-attempt.json');
    if(report.exitCode!==0)errors.push(name+': nonzero exit code');
    if(name.startsWith('screenshot-')){
      const filename='playwright-'+name.slice('screenshot-'.length)+'.png';
      if((await stat(join(dir,filename))).size<1000)errors.push(filename+': file too small');
    }
   }catch(e){errors.push(name+': missing CLI evidence '+e)}
 }
}
if(gate.gate!=='PASS'||manifest.status!=='PASS')errors.push('Phase E gate itself is not PASS');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log('PHASE E PASS: '+repo+' '+url);
