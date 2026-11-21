import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'dist','public');
const htmlPath=path.join(out,'index.html');
assert.ok(existsSync(htmlPath),'Missing Vite production index.html');
const html=readFileSync(htmlPath,'utf8');
assert.match(html,/id=["']root["']/,'React root missing in production');
const urls=[...html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css))["']/g)].map(m=>m[1]);
assert.ok(urls.some(u=>u.endsWith('.js')),'No JS bundle: this is only a decorative HTML shell');
for(const url of urls){
  const rel=url.replace(/^(?:\.\/|\/)/,'').split('?')[0];
  assert.ok(existsSync(path.join(out,rel)),'Missing compiled asset: '+url);
}
for(const name of ['campus/full/index.html','campus/full/cursos','ui/institutional.css']){
 assert.ok(existsSync(path.join(out,name)),'Missing educational static resource: '+name);
}
console.log('VERIFIED Secure T: React bundle with',urls.length,'compiled assets and independently accessible campus resources');
