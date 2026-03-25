import { getRoomState } from '../_lib/pollStore.mjs';

export default function handler(req, res) {
  const roomId = req.query.room || 'demo';
  const role = req.query.role === 'host' ? 'host' : 'audience';
  const clientId = typeof req.query.clientId === 'string' ? req.query.clientId : null;

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(getRoomState(roomId, role, clientId));
}
