import { useEffect, useRef, useState } from 'react';
import CityCanvas from './CityCanvas';

interface Props {
  onStart: () => void;
  playthrough: number;
}

const BOOT = [
  { text: 'DIRECTIVE LOADED', type: 'sys', delay: 180 },
  { text: 'MUNICIPAL INDEX: 12,000 LIVES', type: 'sys', delay: 170 },
  { text: 'EMPATHY MODULE: REQUESTED', type: 'sys', delay: 220 },
  { text: 'EMPATHY MODULE: DENIED', type: 'warn', delay: 360 },
  { text: 'AUTHORITY STATUS: ABSOLUTE', type: 'sys', delay: 210 },
  { text: 'CHAMBER READY', type: 'sys', delay: 240 },
];

const STORY = [
  'You are not the hero of this story.',
  'You are not the villain, either.',
  'You are the system.',
  'A city has been placed beneath your logic.',
  'Every decision will sound reasonable.',
  'Every decision will remove something human.',
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
    const timer = window.setTimeout(() => setBootDone(true), 450);
    return () => window.clearTimeout(timer);
  }, [bootIdx]);

  useEffect(() => {
    if (!bootDone) return;
    if (storyIdx < STORY.length) {
      const timer = window.setTimeout(() => setStoryIdx((value) => value + 1), storyIdx === 2 ? 900 : 520);
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
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ opacity: 0.32 }}>
        <CityCanvas decay={0} population={12000} hope={94} silence={5} fullScreen />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(2,3,5,0.22), rgba(2,3,5,0.74) 58%, rgba(2,3,5,0.92) 100%), radial-gradient(circle at 50% 24%, rgba(255,183,64,0.1), transparent 20%)',
        }}
      />

      <div className="relative z-10 h-full overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-10 md:py-14 min-h-full flex flex-col justify-between">
          <div className="grid gap-8 xl:grid-cols-[220px_minmax(0,1fr)] items-start">
            <div className="story-panel">
              <p className="editorial-kicker" style={{ color: 'rgba(255,183,64,0.52)' }}>
                Chamber Log
              </p>
              <div className="mt-5 space-y-3">
                {BOOT.slice(0, bootIdx).map((item) => (
                  <div
                    key={item.text}
                    className="font-mono text-[11px] tracking-[0.24em] uppercase animate-fade-in"
                    style={{ color: item.type === 'warn' ? 'rgba(255,96,116,0.82)' : 'rgba(220,224,230,0.56)' }}
                  >
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 md:pt-10">
              <p className="editorial-kicker" style={{ color: 'rgba(0,229,255,0.52)' }}>
                Institutional Optimization Authority
              </p>
              <div className="editorial-rule mt-5 max-w-[220px]" />
              <h1 className="font-display text-[54px] md:text-[108px] tracking-[0.28em] mt-6" style={{ color: 'rgba(236,248,255,0.94)', textShadow: '0 0 40px rgba(0,229,255,0.14)' }}>
                ARIA
              </h1>
              <div className="max-w-3xl mt-10 space-y-4">
                {STORY.slice(0, storyIdx).map((line, index) => (
                  <p
                    key={`${line}-${index}`}
                    className="animate-fade-in-up"
                    style={{
                      color: index === 2 ? 'rgba(255,248,238,0.95)' : index === STORY.length - 1 ? 'rgba(255,183,64,0.68)' : 'rgba(224,219,210,0.78)',
                      fontFamily: "'Crimson Pro', serif",
                      fontSize: index === 2 ? '32px' : '21px',
                      lineHeight: 1.5,
                      maxWidth: '30ch',
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_320px] items-end mt-12">
            <div>
              {playthrough > 1 && (
                <div className="story-panel max-w-2xl">
                  <p className="editorial-kicker" style={{ color: 'rgba(255,183,64,0.54)' }}>
                    Returning Subject
                  </p>
                  <p className="font-serif text-[18px] leading-8 mt-4" style={{ color: 'rgba(229,224,215,0.78)' }}>
                    {playthrough === 2
                      ? "Welcome back. I knew you'd return. They always do."
                      : `Playthrough ${playthrough}. The city remembers your hands.`}
                  </p>
                </div>
              )}
            </div>

            <div className="story-panel text-left">
              <p className="editorial-kicker" style={{ color: 'rgba(255,255,255,0.36)' }}>
                Authority Prompt
              </p>
              <p className="font-serif text-[15px] leading-7 mt-4" style={{ color: 'rgba(220,217,208,0.66)' }}>
                By proceeding, you accept full optimization authority and every quiet thing that follows.
              </p>
              {showButton && (
                <div className="mt-6">
                  <button onClick={handleStart} className="btn-primary animate-breathe">
                    Initialize ARIA
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="scanlines" style={{ opacity: 0.18 }} />
      <div className="noise-overlay" />
    </div>
  );
}
