import { useEffect, useMemo, useState } from 'react';
import { WalkScene } from '../game/data';

interface Props {
  scene: WalkScene;
  decay: number;
  onContinue: () => void;
}

const STREET_WIDTH = 1800;
const VIEWPORT_WIDTH = 100;

export default function StreetWalk({ scene, decay, onContinue }: Props) {
  const [position, setPosition] = useState(8);
  const [activeMarker, setActiveMarker] = useState(scene.markers[0]);

  useEffect(() => {
    setPosition(8);
  }, [scene]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
        setPosition((prev) => Math.min(92, prev + 3.5));
      }
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
        setPosition((prev) => Math.max(5, prev - 3.5));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    let nearest = scene.markers[0];
    let best = Infinity;
    scene.markers.forEach((marker) => {
      const distance = Math.abs(marker.x - position);
      if (distance < best) {
        best = distance;
        nearest = marker;
      }
    });
    setActiveMarker(nearest);
  }, [position, scene]);

  const offset = useMemo(() => Math.max(0, Math.min(position - VIEWPORT_WIDTH / 2, 100 - VIEWPORT_WIDTH)), [position]);
  const reachedEnd = position >= 88;

  return (
    <div className="story-panel">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="font-display text-[10px] tracking-[0.35em] uppercase" style={{ color: 'rgba(0,229,255,0.45)' }}>
            Walking Exploration
          </p>
          <h3 className="text-xl md:text-2xl font-semibold mt-2" style={{ color: 'rgba(255,255,255,0.82)' }}>
            {scene.title}
          </h3>
          <p className="font-serif text-[14px] mt-2" style={{ color: 'rgba(215,215,225,0.55)' }}>
            {scene.mood}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[9px] tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Ambient
          </p>
          <p className="font-mono text-[10px] mt-1" style={{ color: 'rgba(255,183,64,0.45)' }}>
            {scene.ambientLabel}
          </p>
        </div>
      </div>

      <div className="rounded-[28px] overflow-hidden border border-white/7 mb-5 shadow-[0_28px_70px_rgba(0,0,0,0.24)]" style={{ background: '#06080d' }}>
        <div className="relative h-[280px] md:h-[340px] overflow-hidden" style={{ background: scene.sky }}>
          <div className="absolute inset-x-0 bottom-0 h-[42%]" style={{ background: scene.ground }} />

          <div className="absolute inset-x-0 bottom-[34%] h-px bg-white/10" />

          <div
            className="absolute inset-y-0"
            style={{
              width: `${STREET_WIDTH}px`,
              transform: `translateX(calc(${-offset}% + ${VIEWPORT_WIDTH / 2 - position}%))`,
              transition: 'transform 220ms ease-out',
            }}
          >
            {scene.markers.map((marker, index) => (
              <div key={marker.title} className="absolute bottom-[28%]" style={{ left: `${marker.x}%` }}>
                <div
                  className="absolute bottom-0 w-[70px] md:w-[90px] rounded-t-[18px]"
                  style={{
                    height: `${70 + index * 18}px`,
                    background: `linear-gradient(180deg, rgba(10,14,22,0.2), rgba(5,8,12,${0.75 + decay * 0.15}))`,
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.03)',
                  }}
                />
                <div className="absolute -left-2 bottom-[78px] h-[42px] w-[2px] bg-cyan-200/20" />
              </div>
            ))}

            <div
              className="absolute bottom-[24%] flex flex-col items-center"
              style={{ left: `${position}%`, transition: 'left 220ms ease-out' }}
            >
              <div className="h-14 w-10 rounded-t-full rounded-b-[12px]" style={{ background: 'linear-gradient(180deg, rgba(220,230,245,0.85), rgba(35,40,54,0.95))' }} />
              <div className="mt-2 h-2 w-12 rounded-full bg-cyan-300/20 blur-[2px]" />
            </div>
          </div>

          <div className="absolute left-4 top-4 rounded-full border border-white/10 px-3 py-1">
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {scene.instruction}
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-4 items-start">
        <div className="muted-surface p-4 min-h-[132px]">
          <p className="font-display text-[10px] tracking-[0.28em] uppercase" style={{ color: 'rgba(0,229,255,0.4)' }}>
            Nearby
          </p>
          <h4 className="text-lg mt-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {activeMarker.title}
          </h4>
          <p className="font-serif text-[14px] mt-2 leading-7" style={{ color: 'rgba(210,210,220,0.58)' }}>
            {activeMarker.text}
          </p>
        </div>

        <div className="muted-surface p-4">
          <p className="font-display text-[10px] tracking-[0.28em] uppercase" style={{ color: 'rgba(255,183,64,0.45)' }}>
            Street Detail
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {scene.details.map((detail) => (
              <span key={detail} className="rounded-full border border-white/8 px-3 py-1 font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.42)' }}>
                {detail}
              </span>
            ))}
          </div>
          <div className="mt-5">
            <button onClick={onContinue} className="btn-primary w-full" disabled={!reachedEnd} style={{ opacity: reachedEnd ? 1 : 0.45 }}>
              {reachedEnd ? 'Continue' : 'Walk To The End'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
