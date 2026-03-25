import { applyAction, touchPresence } from '../_lib/pollStore.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const action = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const roomId = action.roomId || 'demo';
  const role = action.role === 'host' ? 'host' : 'audience';
  const clientId = action.clientId || null;

  touchPresence(roomId, role, clientId);
  const state = applyAction(roomId, action);
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(state);
}
