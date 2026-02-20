const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('../src/server');

async function withServer(run) {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('GET / returns API info instead of 404', async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/`);
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.service, 'liveorder-f-api');
  });
});

test('invalid JSON on POST /parse-comment returns 400', async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/parse-comment`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{invalid',
    });
    const body = await res.json();
    assert.equal(res.status, 400);
    assert.equal(body.error, 'Invalid JSON body');
  });
});
