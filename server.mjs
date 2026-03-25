import http from 'node:http';
import { applyAction, getRoomState } from './api/_lib/pollStore.mjs';

const PORT = Number(process.env.POLL_PORT || 8787);

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'content-type': 'application/json',
    'cache-control': 'no-store',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'Content-Type',
  });
  response.end(JSON.stringify(payload));
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host}`);

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET,POST,OPTIONS',
      'access-control-allow-headers': 'Content-Type',
    });
    response.end();
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/poll/state') {
    const roomId = url.searchParams.get('room') || 'demo';
    const role = url.searchParams.get('role') === 'host' ? 'host' : 'audience';
    const clientId = url.searchParams.get('clientId');
    sendJson(response, 200, getRoomState(roomId, role, clientId));
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/poll/action') {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      try {
        const action = body ? JSON.parse(body) : {};
        const roomId = action.roomId || 'demo';
        sendJson(response, 200, applyAction(roomId, action));
      } catch (error) {
        sendJson(response, 400, { error: error instanceof Error ? error.message : 'Invalid request.' });
      }
    });
    return;
  }

  if (request.method === 'GET' && url.pathname === '/') {
    sendJson(response, 200, { ok: true, port: PORT });
    return;
  }

  sendJson(response, 404, { error: 'Not found.' });
});

server.listen(PORT, () => {
  console.log(`Audience poll API running on http://localhost:${PORT}`);
});
