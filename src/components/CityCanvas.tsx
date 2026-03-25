import { useRef, useEffect, useCallback } from 'react';
import { createCity, drawCity, CityQuality, CityState } from '../engine/city';

interface Props {
  decay: number;
  population: number;
  hope: number;
  silence: number;
  fullScreen?: boolean;
}

export default function CityCanvas({ decay, population, hope, silence, fullScreen = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const timeRef = useRef(0);
  const lastFrameRef = useRef(0);
  const perfSampleStartRef = useRef(0);
  const perfFrameCountRef = useRef(0);
  const qualityRef = useRef<CityQuality>({
    motionScale: 1,
    detailLevel: fullScreen ? 0.85 : 1,
    effectsLevel: fullScreen ? 0.85 : 1,
  });
  const cityRef = useRef(createCity());

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    const state: CityState = { decay, population, hope, silence };
    drawCity(
      ctx,
      w,
      h,
      timeRef.current,
      state,
      cityRef.current.buildings,
      cityRef.current.citizens,
      cityRef.current.stars,
      qualityRef.current
    );

    timeRef.current += 0.016 * qualityRef.current.motionScale;
  }, [decay, population, hope, silence]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dprCap = fullScreen ? 1.25 : 1.5;
      const dpr = Math.min(window.devicePixelRatio, dprCap);
      const w = fullScreen ? window.innerWidth : parent.clientWidth;
      const h = fullScreen ? window.innerHeight : parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    let running = true;
    const targetFrameTime = fullScreen ? 1000 / 30 : 1000 / 45;
    const loop = (now: number) => {
      if (!running) return;
      if (now - lastFrameRef.current >= targetFrameTime) {
        if (!perfSampleStartRef.current) {
          perfSampleStartRef.current = now;
        }
        draw();
        lastFrameRef.current = now;
        perfFrameCountRef.current += 1;

        const sampleDuration = now - perfSampleStartRef.current;
        if (sampleDuration >= 1500) {
          const fps = (perfFrameCountRef.current * 1000) / sampleDuration;
          const nextQuality = qualityRef.current;

          if (fullScreen) {
            if (fps < 22) {
              nextQuality.detailLevel = 0.42;
              nextQuality.effectsLevel = 0.32;
              nextQuality.motionScale = 0.8;
            } else if (fps < 27) {
              nextQuality.detailLevel = 0.58;
              nextQuality.effectsLevel = 0.48;
              nextQuality.motionScale = 0.88;
            } else if (fps < 33) {
              nextQuality.detailLevel = 0.72;
              nextQuality.effectsLevel = 0.68;
              nextQuality.motionScale = 0.94;
            } else {
              nextQuality.detailLevel = 0.85;
              nextQuality.effectsLevel = 0.85;
              nextQuality.motionScale = 1;
            }
          }

          qualityRef.current = { ...nextQuality };
          perfSampleStartRef.current = now;
          perfFrameCountRef.current = 0;
        }
      }
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [draw, fullScreen]);

  return (
    <canvas
      ref={canvasRef}
      className={fullScreen ? 'fixed inset-0 w-full h-full' : 'w-full h-full'}
      style={{ imageRendering: 'auto' }}
    />
  );
}
