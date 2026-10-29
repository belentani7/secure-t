import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const workflow = readFileSync(
  fileURLToPath(new URL('../.github/workflows/cd.yml', import.meta.url)),
  'utf8',
);

test('CD requires explicit manual dispatch and refuses non-main production', () => {
  assert.match(workflow, /workflow_dispatch:/);
  assert.doesNotMatch(workflow, /^\s+push:/m);
  assert.match(workflow, /Production releases must be dispatched from main/);
  assert.match(workflow, /persist-credentials: false/);
});

test('Vercel CLI uses explicit token for pull, deploy, inspect and smoke test', () => {
  const commands = workflow.split('\n').map((line) => line.trim());
  for (const command of commands) {
    if (!/^(?:vercel (?:pull|inspect|curl)|DEPLOY_URL="\$\(vercel deploy)/.test(command)) continue;
    assert.match(command, /--token "\$VERCEL_TOKEN"/, `Unauthenticated: ${command}`);
  }
  assert.equal(commands.filter((line) => line.startsWith('vercel pull ')).length, 2);
  assert.equal(commands.filter((line) => line.startsWith('DEPLOY_URL="$(vercel deploy')).length, 2);
  assert.match(workflow, /vercel inspect "\$DEPLOY_URL" --wait/);
  assert.match(workflow, /vercel curl \/ --deployment "\$DEPLOY_URL" .* -fS/);
});

test('missing release secrets fail closed without leaking values', () => {
  assert.match(workflow, /Missing \$\{key\}/);
  assert.match(workflow, /for key in VERCEL_TOKEN VERCEL_ORG_ID VERCEL_PROJECT_ID/);
  assert.match(workflow, /set -euo pipefail/);
  assert.doesNotMatch(workflow, /steps\.creds\.outputs\.ready/);
});
