import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';
import test from 'node:test';
import { setTimeout as pause } from 'node:timers/promises';

// Test the real compiled/served Express API, not just a static source assertion.
async function freePort() {
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = server.address().port;
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  return port;
}

async function withApi(environment, callback) {
  const port = await freePort();
  const child = spawn('./node_modules/.bin/tsx', ['index.ts'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: String(port),
      ...environment,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', chunk => { output += chunk.toString().slice(0, 2000); });
  child.stderr.on('data', chunk => { output += chunk.toString().slice(0, 2000); });
  const origin = 'http://127.0.0.1:' + port;
  try {
    let started = false;
    for (let attempt = 0; attempt < 80; attempt++) {
      if (child.exitCode !== null) break;
      try {
        const response = await fetch(origin + '/api/health', {
          signal: AbortSignal.timeout(400),
        });
        if (response.ok) { started = true; break; }
      } catch (_) { /* booting */ }
      await pause(100);
    }
    assert.equal(started, true, 'API failed to start: ' + output.slice(0, 1500));
    await callback(origin);
  } finally {
    if (child.exitCode === null) {
      child.kill('SIGTERM');
      await Promise.race([once(child, 'exit'), pause(1000)]);
      if (child.exitCode === null) child.kill('SIGKILL');
    }
  }
}

test('production tutor is private by default, public progress is labelled demo', async () => {
  await withApi({SECURE_T_TUTOR_API_KEY: ''}, async origin => {
    const progress = await fetch(origin + '/api/progress');
    assert.equal(progress.status, 200);
    assert.equal(progress.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(progress.headers.get('cache-control'), 'no-store');
    assert.equal(progress.headers.has('x-powered-by'), false);
    const body = await progress.json();
    assert.equal(body.demo, true);
    assert.equal(body.verified, false);
    assert.equal(body.persisted, false);

    const disabled = await fetch(origin + '/api/tutor', {
      method: 'POST', headers: {'content-type': 'application/json'},
      body: JSON.stringify({message: '¿Qué es una matriz de riesgos?'}),
    });
    assert.equal(disabled.status, 503);

    const invalid = await fetch(origin + '/api/tutor', {
      method: 'POST', headers: {'content-type': 'application/json'},
      body: JSON.stringify({message: 'hola', context: ['unexpected']}),
    });
    assert.equal(invalid.status, 400);
  });
});

test('tutor requires server-side secret when enabled', async () => {
  await withApi({SECURE_T_TUTOR_API_KEY: 'local-test-credential-not-real'}, async origin => {
    const forbidden = await fetch(origin + '/api/tutor', {
      method: 'POST', headers: {'content-type': 'application/json'},
      body: JSON.stringify({message: 'Buenas tardes'}),
    });
    assert.equal(forbidden.status, 401);
    const health = await (await fetch(origin + '/api/health')).json();
    assert.equal(health.mode, 'demo');
    assert.equal(health.tutorConfigured, true);
  });
});


test('tutor throttles authenticated requests before external model calls', async () => {
  await withApi({
    SECURE_T_TUTOR_API_KEY: 'local-test-credential-not-real',
    OLLAMA_URL: 'http://127.0.0.1:1',
  }, async origin => {
    for (let n = 0; n < 11; n++) {
      const result = await fetch(origin + '/api/tutor', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-secure-t-key': 'local-test-credential-not-real',
        },
        body: JSON.stringify({ message: 'Explica una medida de defensa de red.' }),
      });
      assert.equal(result.status, n < 10 ? 200 : 429);
      if (n === 10) assert.ok(Number(result.headers.get('retry-after')) > 0);
    }
  });
});
