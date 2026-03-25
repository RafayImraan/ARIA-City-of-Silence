const ROOM_TTL_MS = 15_000;
const KV_PREFIX = 'aria-room:';

function createRoom() {
  return {
    hostLastSeen: 0,
    audience: {},
    currentPoll: null,
    lastResult: null,
  };
}

const memoryStore = globalThis.__ARIA_POLL_STORE__ || new Map();
globalThis.__ARIA_POLL_STORE__ = memoryStore;

function hasKv() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function roomKey(roomId) {
  return `${KV_PREFIX}${roomId}`;
}

async function kvGet(roomId) {
  const response = await fetch(`${process.env.KV_REST_API_URL}/get/${encodeURIComponent(roomKey(roomId))}`, {
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
    },
  });
  if (!response.ok) throw new Error('Failed to read from Vercel KV.');
  const data = await response.json();
  return data.result ? JSON.parse(data.result) : null;
}

async function kvSet(roomId, room) {
  const payload = encodeURIComponent(JSON.stringify(room));
  const response = await fetch(`${process.env.KV_REST_API_URL}/set/${encodeURIComponent(roomKey(roomId))}/${payload}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
    },
  });
  if (!response.ok) throw new Error('Failed to write to Vercel KV.');
}

function cleanupAudience(room) {
  const now = Date.now();
  const nextAudience = Object.fromEntries(
    Object.entries(room.audience || {}).filter(([, timestamp]) => now - Number(timestamp) <= ROOM_TTL_MS)
  );
  return {
    ...room,
    audience: nextAudience,
  };
}

async function readRoom(roomId) {
  if (hasKv()) {
    const room = (await kvGet(roomId)) || createRoom();
    return cleanupAudience(room);
  }

  if (!memoryStore.has(roomId)) {
    memoryStore.set(roomId, createRoom());
  }
  const room = memoryStore.get(roomId);
  const cleaned = cleanupAudience(room);
  memoryStore.set(roomId, cleaned);
  return cleaned;
}

async function writeRoom(roomId, room) {
  const cleaned = cleanupAudience(room);
  if (hasKv()) {
    await kvSet(roomId, cleaned);
    return cleaned;
  }
  memoryStore.set(roomId, cleaned);
  return cleaned;
}

export function voteTotals(poll) {
  if (!poll) return [];
  const totals = poll.options.map((_, optionIndex) => ({ optionIndex, votes: 0 }));
  Object.values(poll.votes || {}).forEach((optionIndex) => {
    if (typeof optionIndex === 'number' && totals[optionIndex]) {
      totals[optionIndex].votes += 1;
    }
  });
  return totals;
}

export function majorityChoice(poll) {
  return [...voteTotals(poll)].sort((a, b) => b.votes - a.votes || a.optionIndex - b.optionIndex)[0] || null;
}

export async function touchPresence(roomId, role, clientId) {
  const room = await readRoom(roomId);
  const now = Date.now();
  if (role === 'host') {
    room.hostLastSeen = now;
  } else if (clientId) {
    room.audience[clientId] = now;
  }
  return writeRoom(roomId, room);
}

export async function getRoomState(roomId, role, clientId) {
  const room = await touchPresence(roomId, role, clientId);
  return {
    audienceCount: Object.keys(room.audience || {}).length,
    poll: room.currentPoll,
    lastResult: room.lastResult,
    clientId: clientId || null,
    persistence: hasKv() ? 'kv' : 'memory',
  };
}

export async function applyAction(roomId, action) {
  const room = await readRoom(roomId);

  switch (action.type) {
    case 'start_poll':
      room.currentPoll = {
        id: action.pollId,
        cycle: action.cycle,
        title: action.title,
        options: action.options,
        votes: {},
        open: true,
      };
      room.lastResult = null;
      break;
    case 'vote':
      if (room.currentPoll?.open && action.clientId) {
        room.currentPoll.votes[action.clientId] = action.optionIndex;
      }
      break;
    case 'close_poll':
      if (room.currentPoll) {
        room.currentPoll.open = false;
        room.lastResult = majorityChoice(room.currentPoll);
      }
      break;
    case 'clear_poll':
      room.currentPoll = null;
      room.lastResult = null;
      break;
    default:
      throw new Error('Unsupported poll action.');
  }

  const nextRoom = await writeRoom(roomId, room);
  return {
    audienceCount: Object.keys(nextRoom.audience || {}).length,
    poll: nextRoom.currentPoll,
    lastResult: nextRoom.lastResult,
    persistence: hasKv() ? 'kv' : 'memory',
  };
}
