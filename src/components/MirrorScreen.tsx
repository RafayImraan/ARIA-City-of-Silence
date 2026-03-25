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
    const timer = window.setTimeout(() => setPhase('ending'), 1800);
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
          }, lineIndex === 0 ? 3000 : 5000);
        } else {
          window.setTimeout(() => setPhase('prompt'), 6000);
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
          <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at center, rgba(255,183,64,0.05), transparent 32%)' }} />

          {phase !== 'black' && (
            <div className="max-w-2xl">
              <p className="editorial-kicker mb-8" style={{ color: 'rgba(255,183,64,0.42)' }}>
                Final Assessment
              </p>
              {ENDING_LINES.slice(0, lineIndex).map((line) => (
                <p key={line} className="font-serif text-[30px] md:text-[46px] mb-9 leading-[1.2]" style={{ color: 'rgba(232,228,220,0.72)' }}>
                  {line}
                </p>
              ))}
              {phase === 'ending' && (
                <p className="font-serif text-[30px] md:text-[46px] leading-[1.2]" style={{ color: 'rgba(232,228,220,0.72)' }}>
                  {typed}
                  <span className="inline-block h-7 w-[2px] ml-3 bg-white/30 animate-pulse" />
                </p>
              )}
            </div>
          )}

          {phase === 'prompt' && (
            <button
              onClick={() => setPhase('review')}
              className="absolute bottom-10 right-10 font-serif text-[11px] tracking-[0.24em] uppercase"
              style={{ color: 'rgba(255,255,255,0.1)' }}
            >
              Was it worth it?
            </button>
          )}
        </div>
      )}

      {phase === 'review' && (
        <div className="absolute inset-0 overflow-y-auto px-6 py-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <p className="editorial-kicker" style={{ color: 'rgba(0,229,255,0.36)' }}>
                The Mirror
              </p>
              <div className="editorial-rule mt-5 max-w-[180px]" />
              <h1 className="font-serif text-[38px] md:text-[64px] leading-[0.96] tracking-[-0.03em] mt-6" style={{ color: 'rgba(248,244,236,0.92)' }}>
                I was never the one making decisions.
                <br />
                You were.
              </h1>
            </div>

            <div className="story-panel">
              <div className="flex items-center justify-between mb-6">
                <p className="editorial-kicker" style={{ color: 'rgba(255,45,85,0.5)' }}>
                  Review
                </p>
                <p className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.32)' }}>
                  {reviewIdx + 1}/{reviewSummary.length}
                </p>
              </div>

              <div className="muted-surface p-5 md:p-6">
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: 'rgba(0,229,255,0.34)' }}>
                  {reviewSummary[reviewIdx].cycle}
                </p>
                <h3 className="font-serif text-[28px] md:text-[42px] leading-tight mt-3" style={{ color: 'rgba(248,244,236,0.9)' }}>
                  {reviewSummary[reviewIdx].title}
                </h3>
                <p className="editorial-kicker mt-6" style={{ color: 'rgba(255,183,64,0.46)' }}>
                  You chose: {reviewSummary[reviewIdx].option.label}
                </p>
                <p className="font-serif text-[16px] mt-4 leading-8 max-w-[52ch]" style={{ color: 'rgba(220,220,228,0.68)' }}>
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
                      background: index <= reviewIdx ? 'rgba(255,183,64,0.45)' : 'rgba(255,255,255,0.08)',
                    }}
                  />
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
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
          <div className="max-w-4xl mx-auto story-panel">
            <button onClick={() => setPhase('review')} className="btn-ghost mb-8">
              Back To Mirror
            </button>
            <p className="editorial-kicker" style={{ color: 'rgba(255,183,64,0.4)' }}>
              Required Submission
            </p>
            <div className="editorial-rule mt-5 max-w-[180px]" />
            <div className="mt-6 whitespace-pre-wrap font-serif text-[16px] leading-8 max-w-[64ch]" style={{ color: 'rgba(223,223,230,0.7)' }}>
              {VILLAIN_LOGIC_DOCUMENT}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
