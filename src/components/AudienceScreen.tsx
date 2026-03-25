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
    <div className="min-h-screen bg-[#020304] text-white">
      <div className="min-h-screen flex items-center justify-center p-5">
        <div className="max-w-3xl w-full story-panel">
          <p className="editorial-kicker" style={{ color: 'rgba(255,183,64,0.52)' }}>
            Audience Chamber
          </p>
          <div className="editorial-rule mt-5 max-w-[180px]" />
          <h1 className="font-serif text-[34px] md:text-[58px] leading-[0.98] tracking-[-0.03em] mt-6" style={{ color: 'rgba(248,244,236,0.94)' }}>
            {state.poll ? state.poll.title : 'Awaiting the next public decision'}
          </h1>
          <p className="font-mono text-[10px] mt-4 uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {state.connected ? `Connected to room ${roomId}` : 'Connecting to the chamber'}
          </p>

          {state.poll ? (
            <div className="mt-8 grid gap-4">
              {state.poll.options.map((option, index) => {
                const optionVotes = totals.find((item) => item.optionIndex === index)?.votes || 0;
                return (
                  <button
                    key={option.label}
                    onClick={() => {
                      setSelected(index);
                      actions.vote(index);
                    }}
                    className="decision-panel text-left transition-all"
                    style={{
                      borderColor: selected === index ? 'rgba(255,183,64,0.22)' : 'rgba(255,244,220,0.08)',
                      background: selected === index
                        ? 'radial-gradient(circle at top left, rgba(255,183,64,0.08), transparent 28%), linear-gradient(180deg, rgba(255,248,232,0.04), rgba(255,255,255,0.01))'
                        : undefined,
                    }}
                  >
                    <p className="font-display text-[11px] tracking-[0.12em] uppercase" style={{ color: 'rgba(248,244,236,0.9)' }}>
                      {option.label}
                    </p>
                    <p className="font-serif text-[16px] mt-3 leading-8" style={{ color: 'rgba(220,220,228,0.68)' }}>
                      {option.description}
                    </p>
                    <p className="font-mono text-[10px] mt-4" style={{ color: 'rgba(255,183,64,0.54)' }}>
                      {optionVotes} votes
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="font-serif text-[17px] mt-8 leading-8 max-w-[40ch]" style={{ color: 'rgba(220,217,208,0.7)' }}>
              Keep this page open. When the next decision begins, the chamber will ask for your vote.
            </p>
          )}

          {state.lastResult && (
            <div className="muted-surface p-4 mt-8">
              <p className="editorial-kicker" style={{ color: 'rgba(255,183,64,0.5)' }}>
                Last Result
              </p>
              <p className="font-serif text-[16px] mt-3" style={{ color: 'rgba(255,230,200,0.74)' }}>
                Option {state.lastResult.optionIndex + 1} won with {state.lastResult.votes} votes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
