import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { webcrypto } from "node:crypto";
import { runInNewContext } from "node:vm";

const js=readFileSync(new URL("../campus/academia/lab-hash.js",import.meta.url),"utf8");
const html=readFileSync(new URL("../campus/academia/index.html",import.meta.url),"utf8");

function boot(){
  const controls={},languages=[];
  const node=id=>controls[id] ||= {
    id,value:"",textContent:"",hidden:false,disabled:false,attributes:{},handlers:{},
    addEventListener(event,fn){this.handlers[event]=fn},
    setAttribute(name,value){this.attributes[name]=value},
    click(){return this.handlers.click?.()}
  };
  for(const id of ["lab-hash","lab-tab-hash","lab-tab-web","lab-tab-soc","lab-web","lab-soc","hash-left","hash-right","hash-compare","hash-left-result","hash-right-result","hash-verdict"])node(id);
  const doc={documentElement:{lang:"pt-BR"},getElementById:node,querySelectorAll:selector=>selector==="[data-lang]"?languages:[]};
  const window={};
  runInNewContext(js,{window,document:doc,crypto:webcrypto,TextEncoder,Uint8Array,Promise},{timeout:4000});
  return {doc,window,controls,node};
}

test("real SHA-256 browser lab matches NIST known digest",async()=>{
  const page=boot();
  assert.equal(await page.window.SecureTHashLab.sha256("abc"),
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
});
test("comparison reveals an actual changed digest without network",async()=>{
  const p=boot();
  p.node("hash-left").value="Secure T";
  p.node("hash-right").value="Secure T!";
  await p.node("hash-compare").click();
  assert.match(p.node("hash-left-result").textContent,/^[a-f0-9]{64}$/);
  assert.match(p.node("hash-right-result").textContent,/^[a-f0-9]{64}$/);
  assert.notEqual(p.node("hash-left-result").textContent,p.node("hash-right-result").textContent);
  assert.match(p.node("hash-verdict").textContent,/diferentes/);
  assert.ok(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon/.test(js));
});
test("same text creates matching fingerprints",async()=>{
  const p=boot();
  p.node("hash-left").value=p.node("hash-right").value="Aprender";
  await p.node("hash-compare").click();
  assert.equal(p.node("hash-left-result").textContent,p.node("hash-right-result").textContent);
  assert.match(p.node("hash-verdict").textContent,/iguais/);
});
test("three lab tabs never claim to be the same active tab",()=>{
  const p=boot();
  p.node("lab-tab-hash").click();
  assert.equal(p.node("lab-hash").hidden,false);
  assert.equal(p.node("lab-web").hidden,true);
  assert.equal(p.node("lab-tab-hash").attributes["aria-selected"],"true");
  p.node("lab-tab-soc").click();
  assert.equal(p.node("lab-hash").hidden,true);
  assert.equal(p.node("lab-tab-hash").attributes["aria-selected"],"false");
  assert.ok(html.includes('src="lab-hash.js"'));
  assert.ok(html.includes('id="hash-compare"'));
});
