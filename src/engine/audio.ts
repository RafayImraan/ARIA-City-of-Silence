let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let droneOsc: OscillatorNode | null = null;
let droneGain: GainNode | null = null;
let heartbeatInterval: number | null = null;
let sceneInterval: number | null = null;
let started = false;

function pulseTone(frequency: number, duration: number, volume: number, type: OscillatorType = 'sine') {
  if (!ctx || !masterGain) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration + 0.05);
  } catch {
    // ignore
  }
}

export function initAudio() {
  if (started) return;
  try {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.15;
    masterGain.connect(ctx.destination);

    droneOsc = ctx.createOscillator();
    droneOsc.type = 'sine';
    droneOsc.frequency.value = 55;
    droneGain = ctx.createGain();
    droneGain.gain.value = 0.08;
    droneOsc.connect(droneGain);
    droneGain.connect(masterGain);
    droneOsc.start();

    started = true;
  } catch {
    // Audio unsupported
  }
}

export function updateAudioDecay(decay: number) {
  if (!ctx || !masterGain || !droneGain || !droneOsc) return;
  const now = ctx.currentTime;
  masterGain.gain.linearRampToValueAtTime(0.15 * (1 - decay * 0.9), now + 0.4);
  droneOsc.frequency.linearRampToValueAtTime(55 - decay * 20, now + 0.8);
  droneGain.gain.linearRampToValueAtTime(0.08 * (1 - decay * 0.45), now + 0.5);
}

export function updateAudioScene(cycle: number, silence: number, choices: number[]) {
  if (sceneInterval) clearInterval(sceneInterval);
  if (!ctx || !masterGain) return;

  const silenceRatio = silence / 100;
  const keepHumanity = choices.filter((choice) => choice === 1).length;

  sceneInterval = window.setInterval(() => {
    const baseChance = Math.max(0, 0.9 - silenceRatio - cycle * 0.06);
    const humanChance = Math.min(0.8, baseChance + keepHumanity * 0.03);

    if (Math.random() < humanChance) {
      const humanTones = [
        { frequency: 440, duration: 0.12, volume: 0.018, type: 'triangle' as OscillatorType },
        { frequency: 660, duration: 0.08, volume: 0.014, type: 'sine' as OscillatorType },
        { frequency: 520, duration: 0.1, volume: 0.012, type: 'triangle' as OscillatorType },
      ];
      const tone = humanTones[(cycle + Math.floor(Math.random() * humanTones.length)) % humanTones.length];
      pulseTone(tone.frequency, tone.duration, tone.volume * (1 - silenceRatio), tone.type);
    } else if (Math.random() < 0.55) {
      pulseTone(90 - cycle * 3, 0.18, 0.015 + silenceRatio * 0.012, 'sawtooth');
    }
  }, Math.max(2200, 5200 - cycle * 240));
}

export function playDecisionSound(decay: number) {
  pulseTone(decay < 0.5 ? 440 : 220, 0.5, 0.1 * (1 - decay * 0.7));
}

export function playHeartbeat(decay: number) {
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  if (!ctx || !masterGain) return;

  const bpm = Math.max(20, 72 - decay * 60);
  const interval = (60 / bpm) * 1000;

  heartbeatInterval = window.setInterval(() => {
    pulseTone(60, 0.15, 0.04 * (1 - decay * 0.8));
  }, interval);
}

export function stopAudio() {
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  if (sceneInterval) clearInterval(sceneInterval);
  if (droneOsc) {
    try {
      droneOsc.stop();
    } catch {
      // ignore
    }
  }
  if (ctx) {
    try {
      ctx.close();
    } catch {
      // ignore
    }
  }
  started = false;
  ctx = null;
}
