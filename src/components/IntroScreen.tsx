import { useEffect, useRef, useState } from 'react';
import CityCanvas from './CityCanvas';

interface Props {
  onStart: () => void;
  playthrough: number;
}

const BOOT = [
  { text: 'SUBSTRATE INITIALIZING', type: 'sys', delay: 220 },
  { text: 'POPULATION DATABASE: 12,000 INDEXED', type: 'sys', delay: 180 },
  { text: 'EMPATHY MODULE: LOADING', type: 'sys', delay: 260 },
  { text: 'EMPATHY MODULE: BYPASSED', type: 'warn', delay: 420 },
  { text: 'OPTIMIZATION DIRECTIVE: ABSOLUTE', type: 'sys', delay: 220 },
  { text: 'STATUS: READY', type: 'sys', delay: 260 },
];

const STORY = [
  'You are not the hero of this story.',
  'You are not the villain, either.',
  'You are the system.',
  '12,000 lives have been placed under your optimization mandate.',
  'Every decision will be logical.',
  'Every decision will be justified.',
  'The question is what your logic costs.',
];

export default function IntroScreen({ onStart, playthrough }: Props) {
  const [bootIdx, setBootIdx] = useState(0);
  const [bootDone, setBootDone] = useState(false);
  const [storyIdx, setStoryIdx] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const audioInitRef = useRef(false);

  useEffect(() => {
    if (bootIdx < BOOT.length) {
      const timer = window.setTimeout(() => setBootIdx((value) => value + 1), BOOT[bootIdx].delay);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => setBootDone(true), 500);
    return () => window.clearTimeout(timer);
  }, [bootIdx]);

  useEffect(() => {
    if (!bootDone) return;
    if (storyIdx < STORY.length) {
      const timer = window.setTimeout(() => setStoryIdx((value) => value + 1), storyIdx === 2 ? 950 : 520);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setShowButton(true), 700);
    return () => window.clearTimeout(timer);
  }, [bootDone, storyIdx]);

  const handleStart = () => {
    if (!audioInitRef.current) {
      audioInitRef.current = true;
      import('../engine/audio').then((module) => {
        module.initAudio();
        module.playHeartbeat(0);
        module.updateAudioScene(0, 5, []);
      });
    }
    onStart();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0" style={{ opacity: 0.34 }}>
        <CityCanvas decay={0} population={12000} hope={94} silence={5} fullScreen />
      </div>

      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(3,3,5,0.58) 0%, rgba(3,3,5,0.9) 74%)' }} />

      <div className="relative z-10 max-w-3xl w-full px-6 md:px-10">
        <div className="mb-10 space-y-2">
          {BOOT.slice(0, bootIdx).map((item) => (
            <div
              key={item.text}
              className="font-mono text-[11px] tracking-[0.28em] uppercase animate-fade-in"
              style={{ color: item.type === 'warn' ? 'rgba(255,45,85,0.82)' : 'rgba(0,229,255,0.5)' }}
            >
              {item.text}
            </div>
          ))}
        </div>

        <div className="text-center">
          <h1 className="font-display text-6xl md:text-8xl tracking-[0.35em]" style={{ color: 'var(--cyan)', textShadow: '0 0 40px rgba(0,229,255,0.25)' }}>
            ARIA
          </h1>
          <p className="font-mono text-[9px] tracking-[0.45em] uppercase mt-5" style={{ color: 'rgba(0,229,255,0.26)' }}>
            Adaptive Resource and Intelligence Algorithm
          </p>
          <p className="font-mono text-[8px] tracking-[0.3em] uppercase mt-2" style={{ color: 'rgba(0,229,255,0.14)' }}>
            Optimization Authority Active
          </p>
          {playthrough > 1 && (
            <p className="font-serif text-[14px] mt-5" style={{ color: 'rgba(255,183,64,0.58)' }}>
              {playthrough === 2
                ? "Welcome back. I knew you'd return. They always do."
                : `Playthrough ${playthrough}. The city remembers your hands.`}
            </p>
          )}
        </div>

        {bootDone && (
          <div className="max-w-xl mx-auto mt-14 space-y-4">
            {STORY.slice(0, storyIdx).map((line, index) => (
              <p
                key={`${line}-${index}`}
                className="animate-fade-in-up text-center"
                style={{
                  color: index >= STORY.length - 1 ? 'rgba(255,90,110,0.55)' : index === 2 ? 'rgba(255,255,255,0.92)' : 'rgba(220,220,228,0.68)',
                  fontFamily: index === 2 ? "'Orbitron', sans-serif" : "'Crimson Pro', serif",
                  fontSize: index === 2 ? '26px' : '18px',
                  letterSpacing: index === 2 ? '0.18em' : '0',
                  lineHeight: 1.8,
                }}
              >
                {line}
              </p>
            ))}
          </div>
        )}

        {showButton && (
          <div className="text-center mt-12 animate-fade-in-up">
            <button onClick={handleStart} className="btn-primary animate-breathe">
              Initialize ARIA
            </button>
            <p className="font-mono text-[8px] tracking-[0.24em] uppercase mt-4" style={{ color: 'rgba(255,255,255,0.18)' }}>
              By proceeding, you accept full optimization authority
            </p>
          </div>
        )}
      </div>

      <div className="scanlines" style={{ opacity: 0.22 }} />
      <div className="noise-overlay" />
    </div>
  );
}
