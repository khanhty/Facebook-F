const http = require('http');
const { parseLiveComment } = require('./domain/comment-parser');
const { detectIntent } = require('./ai/intent-detector');

const ENDPOINTS = ['GET /', 'GET /health', 'POST /parse-comment', 'POST /detect-intent'];

function json(res, code, payload) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function html(res, code, body) {
  res.writeHead(code, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(body);
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

function renderHomePage() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>LiveOrder F API</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 760px; margin: 40px auto; line-height: 1.5; padding: 0 16px; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
    li { margin-bottom: 8px; }
  </style>
</head>
<body>
  <h1>LiveOrder F API</h1>
  <p>Status: <strong>ok</strong></p>
  <p>Available endpoints:</p>
  <ul>
    <li><code>GET /health</code></li>
    <li><code>POST /parse-comment</code></li>
    <li><code>POST /detect-intent</code></li>
  </ul>
  <p>Tip: Use <code>Accept: application/json</code> on <code>GET /</code> to receive JSON metadata.</p>
</body>
</html>`;
}

function createServer() {
  return http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/') {
      const accept = String(req.headers.accept || '');
      if (accept.includes('text/html')) {
        html(res, 200, renderHomePage());
        return;
      }

      json(res, 200, {
        service: 'liveorder-f-api',
        status: 'ok',
        endpoints: ENDPOINTS,
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
