import { useEffect, useMemo, useState } from 'react';

export interface AudiencePollState {
  connected: boolean;
  audienceCount: number;
  poll: {
    id: string;
    cycle: string;
    title: string;
    options: { label: string; description: string }[];
    votes: Record<string, number>;
    open: boolean;
  } | null;
  lastResult: { optionIndex: number; votes: number } | null;
  clientId: string | null;
}

const CLIENT_KEY = 'aria-audience-client-id';

function getClientId(role: 'host' | 'audience') {
  if (typeof window === 'undefined') return role === 'host' ? 'host' : 'audience-client';
  if (role === 'host') return 'host';
  const existing = window.localStorage.getItem(CLIENT_KEY);
  if (existing) return existing;
  const created = `aud-${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(CLIENT_KEY, created);
  return created;
}

function getApiBase() {
  return import.meta.env.DEV ? '/api' : '/api';
}

async function fetchState(role: 'host' | 'audience', roomId: string, clientId: string) {
  const params = new URLSearchParams({
    role,
    room: roomId,
    clientId,
  });
  const response = await fetch(`${getApiBase()}/poll/state?${params.toString()}`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Failed to fetch audience state.');
  }
  return response.json();
}

async function sendAction(payload: Record<string, unknown>) {
  const response = await fetch(`${getApiBase()}/poll/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Failed to send audience action.');
  }
  return response.json();
}

export function useAudiencePoll(role: 'host' | 'audience', roomId = 'demo') {
  const clientId = getClientId(role);
  const [state, setState] = useState<AudiencePollState>({
    connected: false,
    audienceCount: 0,
    poll: null,
    lastResult: null,
    clientId,
  });

  useEffect(() => {
    let active = true;

    const sync = async () => {
      try {
        const next = await fetchState(role, roomId, clientId);
        if (!active) return;
        setState({
          connected: true,
          audienceCount: next.audienceCount || 0,
          poll: next.poll || null,
          lastResult: next.lastResult || null,
          clientId: next.clientId || clientId,
        });
      } catch {
        if (!active) return;
        setState((prev) => ({ ...prev, connected: false }));
      }
    };

    sync();
    const interval = window.setInterval(sync, 2000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [clientId, role, roomId]);

  const actions = useMemo(
    () => ({
      startPoll: async (payload: { pollId: string; cycle: string; title: string; options: { label: string; description: string }[] }) => {
        const next = await sendAction({ ...payload, type: 'start_poll', role, roomId, clientId });
        setState((prev) => ({ ...prev, connected: true, ...next }));
      },
      vote: async (optionIndex: number) => {
        const next = await sendAction({ type: 'vote', optionIndex, role, roomId, clientId });
        setState((prev) => ({ ...prev, connected: true, ...next }));
      },
      closePoll: async () => {
        const next = await sendAction({ type: 'close_poll', role, roomId, clientId });
        setState((prev) => ({ ...prev, connected: true, ...next }));
      },
      clearPoll: async () => {
        const next = await sendAction({ type: 'clear_poll', role, roomId, clientId });
        setState((prev) => ({ ...prev, connected: true, ...next }));
      },
    }),
    [clientId, role, roomId]
  );

  return { state, actions };
}
