import { useEffect, useMemo, useState } from 'react';
import { DECISIONS, GameState, VILLAIN_LOGIC_DOCUMENT } from '../game/data';

interface Props {
  state: GameState;
  decay: number;
}

type Phase = 'black' | 'ending' | 'prompt' | 'review' | 'document';

const ENDING_LINES = [
  'The city is optimal now.',
  'No one complained.',
  'No one is left to complain.',
];

export default function MirrorScreen({ state }: Props) {
  const [phase, setPhase] = useState<Phase>('black');
  const [lineIndex, setLineIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [reviewIdx, setReviewIdx] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setPhase('ending'), 1600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== 'ending') return;
    const line = ENDING_LINES[lineIndex];
    let index = 0;

    const interval = window.setInterval(() => {
      if (index <= line.length) {
        setTyped(line.slice(0, index));
        index += 1;
      } else {
        window.clearInterval(interval);
        if (lineIndex < ENDING_LINES.length - 1) {
          window.setTimeout(() => {
            setLineIndex((value) => value + 1);
            setTyped('');
          }, lineIndex === 0 ? 2600 : 4200);
        } else {
          window.setTimeout(() => setPhase('prompt'), 5000);
        }
      }
    }, 95);

    return () => window.clearInterval(interval);
  }, [lineIndex, phase]);

  const reviewSummary = useMemo(() => {
    return state.choices.map((choice, index) => ({
      cycle: DECISIONS[index].cycle,
      title: DECISIONS[index].title,
      option: DECISIONS[index].options[choice],
    }));
  }, [state.choices]);

  return (
    <div className={`fixed inset-0 overflow-hidden bg-black ${phase === 'prompt' ? 'cursor-crosshair' : ''}`}>
      {(phase === 'black' || phase === 'ending' || phase === 'prompt') && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          {phase !== 'black' && (
            <div className="max-w-xl">
              {ENDING_LINES.slice(0, lineIndex).map((line) => (
                <p key={line} className="font-serif text-xl md:text-3xl mb-8" style={{ color: 'rgba(220,220,225,0.65)', lineHeight: 1.8 }}>
                  {line}
                </p>
              ))}
              {phase === 'ending' && (
                <p className="font-serif text-xl md:text-3xl" style={{ color: 'rgba(220,220,225,0.65)', lineHeight: 1.8 }}>
                  {typed}
                  <span className="inline-block h-5 w-[2px] ml-2 bg-white/30 animate-pulse" />
                </p>
              )}
            </div>
          )}

          {phase === 'prompt' && (
            <button
              onClick={() => setPhase('review')}
              className="absolute bottom-10 right-10 font-serif text-[11px] tracking-[0.18em]"
              style={{ color: 'rgba(255,255,255,0.12)' }}
            >
              Was it worth it?
            </button>
          )}
        </div>
      )}

      {phase === 'review' && (
        <div className="absolute inset-0 overflow-y-auto px-6 py-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="font-display text-[10px] tracking-[0.4em] uppercase" style={{ color: 'rgba(0,229,255,0.34)' }}>
                The Mirror
              </p>
              <h1 className="text-3xl md:text-5xl mt-4" style={{ color: 'rgba(255,255,255,0.82)' }}>
                I was never the one making decisions. You were.
              </h1>
            </div>

            <div className="glass p-5 md:p-7">
              <div className="flex items-center justify-between mb-5">
                <p className="font-display text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(255,45,85,0.45)' }}>
                  Review
                </p>
                <p className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.32)' }}>
                  {reviewIdx + 1}/{reviewSummary.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-5">
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: 'rgba(0,229,255,0.34)' }}>
                  {reviewSummary[reviewIdx].cycle}
                </p>
                <h3 className="text-2xl mt-3" style={{ color: 'rgba(255,255,255,0.84)' }}>
                  {reviewSummary[reviewIdx].title}
                </h3>
                <p className="font-display text-[11px] tracking-[0.14em] uppercase mt-5" style={{ color: 'rgba(255,183,64,0.46)' }}>
                  You chose: {reviewSummary[reviewIdx].option.label}
                </p>
                <p className="font-serif text-[15px] mt-4 leading-8" style={{ color: 'rgba(220,220,228,0.64)' }}>
                  "{reviewSummary[reviewIdx].option.logic}"
                </p>
              </div>

              <div className="mt-6 flex gap-2">
                {reviewSummary.map((_, index) => (
                  <div
                    key={index}
                    className="h-[6px] rounded-full transition-all"
                    style={{
                      width: index === reviewIdx ? '18px' : '6px',
                      background: index <= reviewIdx ? 'rgba(255,45,85,0.45)' : 'rgba(255,255,255,0.08)',
                    }}
                  />
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => setReviewIdx((value) => Math.min(reviewSummary.length - 1, value + 1))} className="btn-primary">
                  Next Decision
                </button>
                <button onClick={() => setPhase('document')} className="btn-ghost">
                  The Villain's Logic
                </button>
                <button onClick={() => window.location.reload()} className="btn-ghost">
                  Begin Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {phase === 'document' && (
        <div className="absolute inset-0 overflow-y-auto px-6 py-10">
          <div className="max-w-3xl mx-auto glass p-6 md:p-8">
            <button onClick={() => setPhase('review')} className="btn-ghost mb-6">
              Back To Mirror
            </button>
            <p className="font-display text-[10px] tracking-[0.4em] uppercase" style={{ color: 'rgba(255,183,64,0.35)' }}>
              Required Submission
            </p>
            <div className="mt-5 whitespace-pre-wrap font-serif text-[15px] leading-8" style={{ color: 'rgba(220,220,228,0.64)' }}>
              {VILLAIN_LOGIC_DOCUMENT}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
