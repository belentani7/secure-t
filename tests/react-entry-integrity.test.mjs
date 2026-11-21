import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const html=readFileSync(new URL('../client/index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../client/src/App.tsx',import.meta.url),'utf8');
test('Vite mounts the real React campus rather than a decorative canvas',()=>{
 assert.match(html, /id=["']root["']/);
 assert.match(html, /type=["']module["'][^>]*src=["']\/src\/main\.tsx["']/);
 assert.ok(existsSync(new URL('../client/src/main.tsx',import.meta.url)));
});
test('translation provider contains all translation hooks',()=>{
 assert.match(app, /return <I18nProvider><AppContent \/><\/I18nProvider>/);
 assert.ok(app.indexOf('function AppContent()') < app.indexOf('function App()'));
 assert.match(app, /const \{ t \} = useTranslation\(\)/);
});
