const http = require('http');
const { parseLiveComment } = require('./domain/comment-parser');
const { detectIntent } = require('./ai/intent-detector');

function json(res, code, payload) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function safeJsonParse(raw) {
  try {
    return { ok: true, data: JSON.parse(raw || '{}') };
  } catch {
    return { ok: false, data: null };
  }
}

function createServer() {
  return http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/') {
      json(res, 200, {
        service: 'liveorder-f-api',
        status: 'ok',
        endpoints: ['GET /health', 'POST /parse-comment', 'POST /detect-intent'],
      });
      return;
    }

    if (req.method === 'GET' && req.url === '/health') {
      json(res, 200, { status: 'ok', service: 'liveorder-f-api' });
      return;
    }

    if (req.method === 'POST' && req.url === '/parse-comment') {
      const body = await readBody(req);
      const payload = safeJsonParse(body);
      if (!payload.ok) {
        json(res, 400, { error: 'Invalid JSON body' });
        return;
      }

      const parsed = parseLiveComment(payload.data.text || '');
      json(res, 200, parsed);
      return;
    }

    if (req.method === 'POST' && req.url === '/detect-intent') {
      const body = await readBody(req);
      const payload = safeJsonParse(body);
      if (!payload.ok) {
        json(res, 400, { error: 'Invalid JSON body' });
        return;
      }

      const intent = detectIntent(payload.data.message || '');
      json(res, 200, intent);
      return;
    }

    json(res, 404, { error: 'Not Found' });
  });
}

function startServer(port = process.env.PORT || 3000) {
  const server = createServer();
  server.listen(port, () => {
    console.log(`LiveOrder F API listening on :${port}`);
  });
  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = { createServer, startServer };
