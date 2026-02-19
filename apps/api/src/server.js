const http = require('http');
const { parseLiveComment } = require('./domain/comment-parser');
const { detectIntent } = require('./ai/intent-detector');

const port = process.env.PORT || 3000;

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

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'liveorder-f-api' }));
    return;
  }

  if (req.method === 'POST' && req.url === '/parse-comment') {
    const body = await readBody(req);
    const payload = JSON.parse(body || '{}');
    const parsed = parseLiveComment(payload.text || '');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(parsed));
    return;
  }

  if (req.method === 'POST' && req.url === '/detect-intent') {
    const body = await readBody(req);
    const payload = JSON.parse(body || '{}');
    const intent = detectIntent(payload.message || '');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(intent));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(port, () => {
  console.log(`LiveOrder F API listening on :${port}`);
});
