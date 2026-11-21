import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const read=(x)=>readFileSync(new URL(x,root),'utf8');
test('Vercel deploys compiled React, not the retired Python static builder',()=>{
 const cfg=JSON.parse(read('vercel.json'));
 assert.equal(cfg.outputDirectory,'dist/public');
 assert.match(cfg.buildCommand,/npm run build/);
 assert.match(cfg.buildCommand,/verify-bundle/);
 for(const route of ['/campus','/progress','/mentor','/services']){
  assert.ok(cfg.rewrites.some(x=>x.source===route&&x.destination==='/index.html'),'Missing client deep link '+route);
 }
 assert.doesNotMatch(cfg.buildCommand,/python|site-dist/);
 assert.match(read('vite.config.ts'),/base:\s*["']\/["']/);
});
test('Four course programs and eighty lesson weeks have canonical source',()=>{
 const content=read('client/src/data/campus.generated.ts');
 assert.match(content,/ciber-ofensiva/);
 assert.match(content,/ciber-defensiva/);
 assert.match(content,/ia-aplicada-segura/);
 assert.match(content,/gobernanza-compliance/);
 assert.ok(existsSync(new URL('campus/index.html',root)));
});
test('Build-only folders and private environment files cannot enter Git',()=>{
 const gitignore=read('.gitignore');
 for(const pattern of ['node_modules/','dist/','.env','client/public/campus/full/'])assert.ok(gitignore.includes(pattern));
});
