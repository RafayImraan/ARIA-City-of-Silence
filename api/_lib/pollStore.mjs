const ROOM_TTL_MS = 15_000;

function createRoom() {
  return {
    hostLastSeen: 0,
    audience: new Map(),
    currentPoll: null,
    lastResult: null,
  };
}

const store = globalThis.__ARIA_POLL_STORE__ || new Map();
globalThis.__ARIA_POLL_STORE__ = store;

function cleanupAudience(room) {
  const now = Date.now();
  for (const [clientId, timestamp] of room.audience.entries()) {
    if (now - timestamp > ROOM_TTL_MS) {
      room.audience.delete(clientId);
    }
  }
}

export function getRoom(roomId) {
  if (!store.has(roomId)) {
    store.set(roomId, createRoom());
  }
  const room = store.get(roomId);
  cleanupAudience(room);
  return room;
}

export function touchPresence(roomId, role, clientId) {
  const room = getRoom(roomId);
  const now = Date.now();
  if (role === 'host') {
    room.hostLastSeen = now;
  } else if (clientId) {
    room.audience.set(clientId, now);
  }
  cleanupAudience(room);
  return room;
}

export function voteTotals(poll) {
  if (!poll) return [];
  const totals = poll.options.map((_, optionIndex) => ({ optionIndex, votes: 0 }));
  Object.values(poll.votes).forEach((optionIndex) => {
    if (typeof optionIndex === 'number' && totals[optionIndex]) {
      totals[optionIndex].votes += 1;
    }
  });
  return totals;
}

export function majorityChoice(poll) {
  return [...voteTotals(poll)].sort((a, b) => b.votes - a.votes || a.optionIndex - b.optionIndex)[0] || null;
}

export function getRoomState(roomId, role, clientId) {
  const room = touchPresence(roomId, role, clientId);
  return {
    audienceCount: room.audience.size,
    poll: room.currentPoll,
    lastResult: room.lastResult,
    clientId: clientId || null,
  };
}

export function applyAction(roomId, action) {
  const room = getRoom(roomId);

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

  cleanupAudience(room);
  return {
    audienceCount: room.audience.size,
    poll: room.currentPoll,
    lastResult: room.lastResult,
  };
}
