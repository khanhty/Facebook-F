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

test('GET / returns API info JSON', async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/`, {
      headers: { accept: 'application/json' },
    });
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.service, 'liveorder-f-api');
    assert.equal(Array.isArray(body.endpoints), true);
  });
});

test('GET / returns HTML for browser accept header', async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/`, {
      headers: { accept: 'text/html' },
    });
    const body = await res.text();
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('content-type').includes('text/html'), true);
    assert.equal(body.includes('LiveOrder F API'), true);
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
