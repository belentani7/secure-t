import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { Script } from "node:vm";

const root=path.resolve(import.meta.dirname,"..");
const site=path.join(root,"client/public/estudiar");
const source=JSON.parse(readFileSync(path.join(root,"campus/indice.json"),"utf8"));
const weeks=source.filter(entry=>/^cursos\/[^/]+\/semana-\d\d\.md$/.test(entry.ruta));
const landing=readFileSync(path.join(site,"index.html"),"utf8");
const reader=readFileSync(path.join(site,"reader.js"),"utf8");

test("landing has at least 1300 lines and live search controls",()=>{
 assert.ok(landing.split(/\r?\n/).length>=1300);
 assert.match(landing,/id="buscador"/);
 assert.equal((landing.match(/class="week-card"/g)||[]).length,80);
});

test("exactly 80 real source weeks with three HTML views",()=>{
 assert.equal(weeks.length,80);
 const keys=new Set();
 for(const item of weeks){
  const [,course,num]=item.ruta.match(/^cursos\/([^/]+)\/semana-(\d\d)\.md$/);
  assert.ok(existsSync(path.join(root,"campus",item.ruta)));
  for(const kind of ["lectura","practica","evidencia"]){
   const file=path.join(site,course,`semana-${num}-${kind}.html`);
   assert.ok(existsSync(file),file);
   const html=readFileSync(file,"utf8");
   assert.match(html,/href="\/estudiar\/styles.css"/);
   assert.match(html,/src="\/estudiar\/reader.js"/);
   assert.match(html,/id="lesson-config"/);
   keys.add(file);
  }
 }
 assert.equal(keys.size,240);
});

test("reader and landing inline script have valid JS syntax",()=>{
 assert.doesNotThrow(()=>new Script(reader));
 for(const [,block] of landing.matchAll(/<script>([\s\S]*?)<\/script>/g)){
  assert.doesNotThrow(()=>new Script(block));
 }
});

test("no fake credentials or bogus independent lesson claim",()=>{
 assert.doesNotMatch(landing,/certificaci[oó]n oficial garantizada/i);
 assert.match(landing,/tres puertas por semana/i);
});
