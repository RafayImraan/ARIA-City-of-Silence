import { useMemo, useState } from 'react';
import { useAudiencePoll } from '../hooks/useAudiencePoll';

interface Props {
  roomId: string;
  audiencePoll: ReturnType<typeof useAudiencePoll>;
}

export default function AudienceScreen({ roomId, audiencePoll }: Props) {
  const { state, actions } = audiencePoll;
  const [selected, setSelected] = useState<number | null>(null);

  const totals = useMemo(() => {
    if (!state.poll) return [];
    const counts = state.poll.options.map((_, index) => ({ optionIndex: index, votes: 0 }));
    Object.values(state.poll.votes || {}).forEach((optionIndex) => {
      if (typeof optionIndex === 'number' && counts[optionIndex]) counts[optionIndex].votes += 1;
    });
    return counts;
  }, [state.poll]);

  return (
    <div className="min-h-screen bg-[#030305] text-white flex items-center justify-center p-5">
      <div className="max-w-2xl w-full glass p-5 md:p-8">
        <p className="font-display text-[10px] tracking-[0.35em] uppercase" style={{ color: 'rgba(0,229,255,0.45)' }}>
          Audience Vote
        </p>
        <h1 className="text-2xl md:text-4xl mt-3" style={{ color: 'rgba(255,255,255,0.88)' }}>
          {state.poll ? state.poll.title : 'Waiting for the next decision'}
        </h1>
        <p className="font-mono text-[10px] mt-3 uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {state.connected ? `Connected to room ${roomId}` : 'Connecting to poll server'}
        </p>

        {state.poll ? (
          <div className="mt-6 space-y-3">
            {state.poll.options.map((option, index) => {
              const optionVotes = totals.find((item) => item.optionIndex === index)?.votes || 0;
              return (
                <button
                  key={option.label}
                  onClick={() => {
                    setSelected(index);
                    actions.vote(index);
                  }}
                  className="w-full text-left rounded-2xl border p-4 transition-all"
                  style={{
                    borderColor: selected === index ? 'rgba(0,229,255,0.35)' : 'rgba(255,255,255,0.08)',
                    background: selected === index ? 'rgba(0,229,255,0.06)' : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <p className="font-display text-[11px] tracking-[0.12em] uppercase" style={{ color: 'rgba(255,255,255,0.84)' }}>
                    {option.label}
                  </p>
                  <p className="font-serif text-[14px] mt-2 leading-7" style={{ color: 'rgba(215,220,230,0.6)' }}>
                    {option.description}
                  </p>
                  <p className="font-mono text-[10px] mt-3" style={{ color: 'rgba(255,183,64,0.5)' }}>
                    {optionVotes} votes
                  </p>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="font-serif text-[15px] mt-8 leading-8" style={{ color: 'rgba(215,220,230,0.58)' }}>
            Keep this page open. When the next decision starts, your vote will appear here.
          </p>
        )}

        {state.lastResult && (
          <div className="mt-6 rounded-2xl border border-amber-200/10 bg-amber-200/[0.03] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: 'rgba(255,183,64,0.5)' }}>
              Last Result
            </p>
            <p className="font-serif text-[15px] mt-2" style={{ color: 'rgba(255,230,200,0.7)' }}>
              Option {state.lastResult.optionIndex + 1} won with {state.lastResult.votes} votes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
