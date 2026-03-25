// Full-screen isometric city renderer
// This creates a living, breathing city that visually decays

export interface CityState {
  decay: number;
  population: number;
  hope: number;
  silence: number;
}

export interface CityQuality {
  motionScale: number;
  detailLevel: number;
  effectsLevel: number;
}

interface Building {
  x: number; y: number;
  w: number; h: number;
  floors: number;
  hue: number;
  type: 'residential' | 'commercial' | 'park' | 'monument';
  windowsLit: number; // 0-1
  alive: boolean;
}

interface Citizen {
  x: number; y: number;
  tx: number; ty: number;
  speed: number;
  hue: number;
  size: number;
  phase: number;
  alive: boolean;
}

interface Star {
  x: number; y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  phase: number;
}

function seeded(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

export function createCity(): { buildings: Building[]; citizens: Citizen[]; stars: Star[] } {
  const buildings: Building[] = [];
  const citizens: Citizen[] = [];
  const stars: Star[] = [];

  // Generate city grid
  for (let row = 0; row < 12; row++) {
    for (let col = 0; col < 18; col++) {
      const r = seeded(row * 100 + col);
      if (r < 0.15) continue; // empty lots

      const type: Building['type'] = 
        r < 0.35 ? 'park' : r < 0.65 ? 'residential' : r < 0.85 ? 'commercial' : 'monument';

      buildings.push({
        x: col * 5.5 + 1 + seeded(row * 50 + col * 7) * 2,
        y: row * 7 + 10 + seeded(row * 30 + col * 11) * 3,
        w: type === 'park' ? 4 + seeded(row + col * 3) * 3 : 2.5 + seeded(row * 3 + col) * 2.5,
        h: type === 'monument' ? 12 + seeded(row * 7 + col * 5) * 8
          : type === 'commercial' ? 6 + seeded(row * 5 + col * 3) * 10
          : type === 'residential' ? 3 + seeded(row * 4 + col * 2) * 7
          : 1 + seeded(row * 2 + col) * 1.5,
        floors: type === 'park' ? 0 : Math.ceil(2 + seeded(row * 6 + col * 8) * 6),
        hue: type === 'park' ? 120 + seeded(row + col) * 40
           : type === 'monument' ? 200 + seeded(row * 2 + col) * 30
           : type === 'residential' ? 30 + seeded(row * 3 + col * 2) * 30
           : 180 + seeded(row + col * 5) * 40,
        type,
        windowsLit: 0.6 + seeded(row * 8 + col * 9) * 0.4,
        alive: true,
      });
    }
  }

  // Citizens
  for (let i = 0; i < 200; i++) {
    const cx = seeded(i * 2 + 500) * 100;
    const cy = seeded(i * 3 + 600) * 80 + 15;
    citizens.push({
      x: cx, y: cy,
      tx: seeded(i * 5 + 700) * 100,
      ty: seeded(i * 7 + 800) * 80 + 15,
      speed: 0.003 + seeded(i * 11) * 0.008,
      hue: 30 + seeded(i * 13) * 30,
      size: 1.2 + seeded(i * 17) * 1.2,
      phase: seeded(i * 19) * Math.PI * 2,
      alive: true,
    });
  }

  // Stars  
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: seeded(i * 23 + 1000) * 100,
      y: seeded(i * 29 + 1100) * 40,
      size: 0.3 + seeded(i * 31) * 1.2,
      brightness: 0.3 + seeded(i * 37) * 0.7,
      twinkleSpeed: 0.5 + seeded(i * 41) * 2,
      phase: seeded(i * 43) * Math.PI * 2,
    });
  }

  buildings.sort((a, b) => a.y - b.y);
  return { buildings, citizens, stars };
}

export function drawCity(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  time: number,
  state: CityState,
  buildings: Building[],
  citizens: Citizen[],
  stars: Star[],
  quality: CityQuality
) {
  const { decay, population, hope, silence } = state;
  const { detailLevel, effectsLevel } = quality;
  const popRatio = population / 12000;
  const hopeRatio = hope / 100;
  const satMult = Math.max(0, 1 - decay * 1.3);
  const brightMult = Math.max(0.08, 1 - decay * 0.75);
  const detail = Math.max(0.3, detailLevel);
  const effects = Math.max(0.2, effectsLevel);

  // === SKY ===
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.6);
  const skyHue = 220 + decay * 10;
  const skySat = Math.max(0, 15 - decay * 15);
  const skyLight = Math.max(2, 8 - decay * 6);
  skyGrad.addColorStop(0, `hsl(${skyHue}, ${skySat}%, ${skyLight}%)`);
  skyGrad.addColorStop(0.5, `hsl(${skyHue - 10}, ${skySat * 0.5}%, ${skyLight * 0.7}%)`);
  skyGrad.addColorStop(1, `hsl(${skyHue}, ${skySat * 0.3}%, ${skyLight * 1.2}%)`);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // === STARS ===
  const visibleStars = Math.floor(stars.length * Math.max(0.2, (1 - decay * 0.5) * detail));
  for (let i = 0; i < visibleStars; i++) {
    const s = stars[i];
    const twinkle = Math.sin(time * s.twinkleSpeed + s.phase) * 0.5 + 0.5;
    const opacity = s.brightness * twinkle * (0.5 + (1 - decay) * 0.5) * effects;
    if (opacity < 0.02) continue;

    const sx = s.x * w / 100;
    const sy = s.y * h / 100;
    
    // Star glow
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.size * 4);
    glow.addColorStop(0, `rgba(200, 220, 255, ${opacity * 0.8})`);
    glow.addColorStop(0.4, `rgba(200, 220, 255, ${opacity * 0.2})`);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(sx, sy, s.size * 4, 0, Math.PI * 2);
    ctx.fill();

    // Star core
    ctx.fillStyle = `rgba(240, 245, 255, ${opacity})`;
    ctx.beginPath();
    ctx.arc(sx, sy, s.size * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // === AURORA / ATMOSPHERE (fades with decay) ===
  if (decay < 0.6 && effects > 0.45) {
    const auroraOpacity = 0.03 * (1 - decay * 1.5) * effects;
    const auroraPhase = time * 0.15;
    const auroraBands = effects > 0.75 ? 3 : 2;
    for (let i = 0; i < auroraBands; i++) {
      const ax = w * 0.2 + Math.sin(auroraPhase + i * 2) * w * 0.3;
      const ay = h * 0.1 + Math.cos(auroraPhase * 0.7 + i) * h * 0.05;
      const ag = ctx.createRadialGradient(ax, ay, 0, ax, ay, w * 0.25);
      const aHue = 160 + i * 40 + Math.sin(time * 0.3) * 20;
      ag.addColorStop(0, `hsla(${aHue}, ${60 * satMult}%, 50%, ${auroraOpacity})`);
      ag.addColorStop(1, 'transparent');
      ctx.fillStyle = ag;
      ctx.fillRect(0, 0, w, h * 0.4);
    }
  }

  // === HORIZON LINE ===
  const horizonY = h * 0.42;
  const horizonGrad = ctx.createLinearGradient(0, horizonY - 20, 0, horizonY + 20);
  const horizonGlow = Math.max(0, 0.15 - decay * 0.12);
  horizonGrad.addColorStop(0, 'transparent');
  horizonGrad.addColorStop(0.4, `hsla(30, ${40 * satMult}%, 50%, ${horizonGlow})`);
  horizonGrad.addColorStop(0.6, `hsla(20, ${30 * satMult}%, 40%, ${horizonGlow * 0.6})`);
  horizonGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = horizonGrad;
  ctx.fillRect(0, horizonY - 20, w, 40);

  // === BUILDINGS ===
  const sortedBuildings = buildings;
  const aliveBuildings = Math.floor(sortedBuildings.length * Math.max(0.3, popRatio));
  
  sortedBuildings.forEach((b, idx) => {
    const bx = (b.x / 100) * w;
    const depthScale = 0.4 + (b.y / 100) * 0.6;
    const by = horizonY + (b.y - 10) * (h - horizonY) / 100;
    const bw = (b.w / 100) * w * depthScale;
    const bh = (b.h / 100) * h * depthScale * 1.5;
    const isAlive = idx < aliveBuildings;

    if (b.type === 'park') {
      // Parks: green patches that gray out
      const parkSat = isAlive ? 50 * satMult : 5;
      const parkLight = isAlive ? 25 * brightMult : 8;
      const parkOp = isAlive ? (0.4 * brightMult) : 0.1;
      
      // Park ground
      ctx.fillStyle = `hsla(${b.hue}, ${parkSat}%, ${parkLight}%, ${parkOp})`;
      ctx.beginPath();
      ctx.ellipse(bx, by, bw * 0.8, bw * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Trees
      if (isAlive && decay < 0.7 && detail > 0.5) {
        const treeCount = Math.max(0, Math.min(3, Math.floor(1 + detail * 2) - Math.floor(decay * 4)));
        for (let t = 0; t < treeCount; t++) {
          const tx = bx - bw * 0.3 + t * bw * 0.3;
          const ty = by - 3 * depthScale;
          ctx.fillStyle = `hsla(${100 + t * 20}, ${40 * satMult}%, ${30 * brightMult}%, ${parkOp * 0.8})`;
          ctx.beginPath();
          ctx.arc(tx, ty, 3 * depthScale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      return;
    }

    // Building body
    const bodyHue = isAlive ? b.hue : 220;
    const bodySat = isAlive ? 20 * satMult : 3;
    const bodyLight = isAlive ? (12 + 5 * brightMult) : 5;
    const bodyOp = 0.85;

    // Shadow
    ctx.fillStyle = `rgba(0, 0, 0, ${0.2 * depthScale})`;
    ctx.fillRect(bx + 2, by - bh + 2, bw, bh);

    // Main face
    ctx.fillStyle = `hsla(${bodyHue}, ${bodySat}%, ${bodyLight}%, ${bodyOp})`;
    ctx.fillRect(bx, by - bh, bw, bh);

    // Right face (3D effect)
    const faceW = bw * 0.15;
    ctx.fillStyle = `hsla(${bodyHue}, ${bodySat}%, ${bodyLight * 0.6}%, ${bodyOp * 0.8})`;
    ctx.fillRect(bx + bw, by - bh, faceW, bh);

    // Top face
    ctx.fillStyle = `hsla(${bodyHue}, ${bodySat}%, ${bodyLight * 1.4}%, ${bodyOp * 0.6})`;
    ctx.beginPath();
    ctx.moveTo(bx, by - bh);
    ctx.lineTo(bx + faceW, by - bh - faceW * 0.6);
    ctx.lineTo(bx + bw + faceW, by - bh - faceW * 0.6);
    ctx.lineTo(bx + bw, by - bh);
    ctx.closePath();
    ctx.fill();

    // Windows
    if (b.floors > 0 && isAlive) {
      const windowsPerFloor = Math.max(1, Math.floor((bw / 5) * (0.65 + detail * 0.35)));
      const floorH = bh / b.floors;
      const litMultiplier = b.windowsLit * hopeRatio * (1 - decay * 0.8);
      
      for (let f = 0; f < b.floors; f++) {
        for (let wc = 0; wc < windowsPerFloor; wc++) {
          const isLit = seeded(b.x * 1000 + b.y * 100 + f * 10 + wc) < litMultiplier;
          if (!isLit) continue;

          const wx = bx + 2 + wc * (bw - 4) / windowsPerFloor;
          const wy = by - bh + f * floorH + 2;
          const ww = Math.max(1.5, (bw - 4) / windowsPerFloor - 1.5);
          const wh = Math.max(2, floorH - 3);

          // Window flicker
          const flicker = Math.sin(time * 2 + f * 0.5 + wc * 0.3) > (decay * 2 - 1) ? 1 : 0.3;

          const windowHue = 40 + seeded(f * 7 + wc * 3) * 20;
          const windowOp = Math.max(0, (0.4 + flicker * 0.3) * (1 - decay * 0.9)) * brightMult;
          
          // Window glow
          if (windowOp > 0.05 && decay < 0.6 && effects > 0.5) {
            const glowSize = 3;
            const wg = ctx.createRadialGradient(wx + ww/2, wy + wh/2, 0, wx + ww/2, wy + wh/2, glowSize);
            wg.addColorStop(0, `hsla(${windowHue}, ${60 * satMult}%, 65%, ${windowOp * 0.4})`);
            wg.addColorStop(1, 'transparent');
            ctx.fillStyle = wg;
            ctx.fillRect(wx - glowSize, wy - glowSize, ww + glowSize * 2, wh + glowSize * 2);
          }

          ctx.fillStyle = `hsla(${windowHue}, ${50 * satMult}%, ${55 * brightMult}%, ${windowOp})`;
          ctx.fillRect(wx, wy, ww, wh);
        }
      }
    }

    // Building glow from top (monuments/tall buildings)
    if (b.type === 'monument' && isAlive && decay < 0.5 && effects > 0.6) {
      const tgOp = 0.15 * (1 - decay * 2) * effects;
      const tg = ctx.createRadialGradient(bx + bw/2, by - bh, 0, bx + bw/2, by - bh, bh * 0.3);
      tg.addColorStop(0, `hsla(${b.hue}, ${50 * satMult}%, 60%, ${tgOp})`);
      tg.addColorStop(1, 'transparent');
      ctx.fillStyle = tg;
      ctx.beginPath();
      ctx.arc(bx + bw/2, by - bh, bh * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // === CITIZENS ===
  const visibleCitizens = Math.floor(citizens.length * popRatio * detail);
  
  citizens.forEach((c, i) => {
    if (i >= visibleCitizens) {
      // Ghost citizen
      if (decay > 0.3 && effects > 0.45) {
        const ghostOp = Math.min(0.06, (decay - 0.3) * 0.08);
        ctx.fillStyle = `rgba(60, 65, 80, ${ghostOp})`;
        const gx = (c.x / 100) * w;
        const gy = horizonY + (c.y - 10) * (h - horizonY) / 100;
        ctx.beginPath();
        ctx.arc(gx, gy, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }

    // Move toward target
    const dx = c.tx - c.x;
    const dy = c.ty - c.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const moveSpeed = c.speed * Math.max(0.05, 1 - decay * 0.95);
    
    if (dist < 1) {
      c.tx = seeded(time * 100 + i * 7) * 100;
      c.ty = seeded(time * 100 + i * 11) * 80 + 15;
    } else {
      c.x += (dx / dist) * moveSpeed * 30;
      c.y += (dy / dist) * moveSpeed * 30;
    }

    const cx = (c.x / 100) * w;
    const depthScale = 0.4 + (c.y / 100) * 0.6;
    const cy = horizonY + (c.y - 10) * (h - horizonY) / 100;
    const cSize = c.size * depthScale;
    const isHopeful = i < visibleCitizens * hopeRatio;

    const pulse = Math.sin(time * 2 + c.phase) * 0.3 + 0.7;
    const cSat = c.hue > 0 ? 50 * satMult : 0;
    const cLight = 50 * brightMult;
    const cOp = isHopeful
      ? (0.3 + pulse * 0.4) * (1 - decay * 0.5)
      : (0.08 + pulse * 0.05) * (1 - decay * 0.7);

    // Citizen glow
    if (isHopeful && decay < 0.6 && effects > 0.55) {
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cSize * 5);
      cg.addColorStop(0, `hsla(${c.hue}, ${cSat}%, ${cLight}%, ${cOp * 0.4})`);
      cg.addColorStop(1, 'transparent');
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(cx, cy, cSize * 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Citizen dot
    ctx.fillStyle = `hsla(${c.hue}, ${cSat}%, ${cLight}%, ${cOp})`;
    ctx.beginPath();
    ctx.arc(cx, cy, cSize, 0, Math.PI * 2);
    ctx.fill();
  });

  // === CONNECTION LINES between citizens (community) ===
  if (decay < 0.6 && effects > 0.5) {
    const lineOp = Math.max(0, 0.04 - decay * 0.06);
    const visibleForLines = citizens.slice(0, Math.min(visibleCitizens, Math.floor(20 + detail * 40)));
    for (let i = 0; i < visibleForLines.length; i++) {
      for (let j = i + 1; j < Math.min(i + 3, visibleForLines.length); j++) {
        const c1 = visibleForLines[i];
        const c2 = visibleForLines[j];
        const ddx = c1.x - c2.x;
        const ddy = c1.y - c2.y;
        const d = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < 15) {
          const lOp = lineOp * (1 - d / 15);
          ctx.strokeStyle = `rgba(255, 200, 120, ${lOp})`;
          ctx.lineWidth = 0.5;
          const x1 = (c1.x / 100) * w;
          const y1 = horizonY + (c1.y - 10) * (h - horizonY) / 100;
          const x2 = (c2.x / 100) * w;
          const y2 = horizonY + (c2.y - 10) * (h - horizonY) / 100;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
    }
  }

  // === GRID OVERLAY (control — appears with decay) ===
  if (decay > 0.25 && effects > 0.35) {
    const gridOp = (decay - 0.25) * 0.08 * effects;
    ctx.strokeStyle = `rgba(0, 180, 220, ${gridOp})`;
    ctx.lineWidth = 0.5;
    const gridSize = effects > 0.65 ? 50 : 70;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, horizonY);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = horizonY; y < h; y += gridSize * 0.5) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }

  // === FLOATING WORDS ===
  if (decay < 0.75 && effects > 0.45) {
    const words = ['laughter', 'music', 'voices', 'footsteps', 'birdsong', 'children playing', 'dreams', 'hope'];
    const visibleWords = Math.max(2, Math.floor(words.length * effects));
    words.slice(0, visibleWords).forEach((word, i) => {
      const threshold = i * 0.09;
      if (decay > threshold + 0.15) return;
      const wordOp = Math.max(0, 0.08 - decay * 0.12 - i * 0.008);
      if (wordOp < 0.01) return;
      
      const wx = (12 + (i * 31) % 76) * w / 100;
      const wy = horizonY + (15 + (i * 43) % 50) * (h - horizonY) / 100;
      const wobble = Math.sin(time * 0.25 + i * 1.7) * 8;
      const floatY = Math.sin(time * 0.15 + i * 2.3) * 5;
      
      ctx.font = `${Math.max(7, 10 - decay * 4)}px 'Crimson Pro', serif`;
      ctx.fillStyle = `hsla(${30 + i * 25}, ${40 * satMult}%, 65%, ${wordOp})`;
      ctx.fillText(word, wx + wobble, wy + floatY);
    });
  }

  // === RAIN / STATIC (appears with high decay) ===
  if (decay > 0.5 && effects > 0.4) {
    const rainCount = Math.floor((decay - 0.5) * 200 * effects);
    const rainOp = (decay - 0.5) * 0.15 * effects;
    for (let i = 0; i < rainCount; i++) {
      const rx = seeded(time * 1000 + i * 3) * w;
      const ry = seeded(time * 1000 + i * 7) * h;
      ctx.fillStyle = `rgba(100, 110, 130, ${rainOp * seeded(i * 11 + time * 50)})`;
      ctx.fillRect(rx, ry, 1, 2 + seeded(i) * 3);
    }
  }

  // === WATER REFLECTIONS at bottom ===
  const waterY = h * 0.88;
  const waterH = h - waterY;
  if (waterH > 0) {
    // Water surface
    const waterGrad = ctx.createLinearGradient(0, waterY, 0, h);
    waterGrad.addColorStop(0, `rgba(5, 8, 18, ${0.3 + decay * 0.3})`);
    waterGrad.addColorStop(1, `rgba(3, 5, 12, ${0.5 + decay * 0.3})`);
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, waterY, w, waterH);

    // Reflections of building lights
    if (decay < 0.7 && effects > 0.45) {
      sortedBuildings.forEach((b, index) => {
        if (index % (detail > 0.7 ? 1 : 2) !== 0) return;
        if (b.type === 'park') return;
        const bx = (b.x / 100) * w;
        const depthScale = 0.4 + (b.y / 100) * 0.6;
        const bw = (b.w / 100) * w * depthScale;
        const reflOp = Math.max(0, 0.04 * (1 - decay * 1.3));
        
        // Reflection streak
        const rx = bx + bw / 2;
        const reflGrad = ctx.createLinearGradient(rx, waterY, rx, h);
        reflGrad.addColorStop(0, `hsla(${b.hue}, ${20 * satMult}%, 50%, ${reflOp})`);
        reflGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = reflGrad;
        ctx.fillRect(rx - 2, waterY, 4, waterH * 0.6);
      });
    }

    // Water shimmer
    const shimmerCount = Math.max(10, Math.floor(30 * effects));
    for (let i = 0; i < shimmerCount; i++) {
      const sx = seeded(i * 47 + time * 3) * w;
      const sy = waterY + seeded(i * 53 + time * 5) * waterH;
      const shimmerOp = Math.max(0, 0.04 * (1 - decay * 0.8)) * (Math.sin(time * 2 + i) * 0.5 + 0.5);
      ctx.fillStyle = `rgba(100, 160, 220, ${shimmerOp})`;
      ctx.fillRect(sx, sy, 8 + seeded(i) * 12, 0.5);
    }
  }

  // === ATMOSPHERIC FOG LAYERS ===
  if (decay < 0.9 && effects > 0.45) {
    const fogLayers = effects > 0.7 ? 3 : 2;
    for (let layer = 0; layer < fogLayers; layer++) {
      const fogY = horizonY + (h - horizonY) * (0.15 + layer * 0.25);
      const fogOp = Math.max(0, (0.03 + layer * 0.01) * (1 - decay * 0.5));
      const fogGrad = ctx.createLinearGradient(0, fogY - 15, 0, fogY + 15);
      fogGrad.addColorStop(0, 'transparent');
      fogGrad.addColorStop(0.5, `rgba(15, 20, 35, ${fogOp})`);
      fogGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, fogY - 15, w, 30);
    }
  }

  // === EMBERS / FIREFLIES ===
  if (decay < 0.8 && effects > 0.4) {
    const emberCount = Math.max(0, Math.floor(25 * (1 - decay * 1.1) * effects));
    for (let i = 0; i < emberCount; i++) {
      const ex = (seeded(i * 67 + 2000) * 100 + Math.sin(time * 0.5 + i * 1.3) * 5);
      const ey = (seeded(i * 73 + 2100) * 60 + 20 + Math.sin(time * 0.3 + i * 0.7) * 3);
      const epulse = Math.sin(time * (1 + seeded(i * 83) * 2) + seeded(i * 89) * 6) * 0.5 + 0.5;
      const eOp = epulse * 0.35 * (1 - decay * 1.2);
      if (eOp < 0.01) continue;
      
      const px = (ex / 100) * w;
      const py = horizonY + (ey - 10) * (h - horizonY) / 100;
      const eSize = (0.8 + seeded(i * 97) * 1.5);
      
      const eg = ctx.createRadialGradient(px, py, 0, px, py, eSize * 5);
      eg.addColorStop(0, `hsla(${35 + seeded(i * 101) * 25}, ${70 * satMult}%, 65%, ${eOp})`);
      eg.addColorStop(1, 'transparent');
      ctx.fillStyle = eg;
      ctx.beginPath();
      ctx.arc(px, py, eSize * 5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = `hsla(${40 + seeded(i * 103) * 20}, ${80 * satMult}%, 75%, ${eOp * 1.5})`;
      ctx.beginPath();
      ctx.arc(px, py, eSize * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // === VIGNETTE ===
  const vigStr = 0.3 + decay * 0.55;
  const vig = ctx.createRadialGradient(w / 2, h / 2, w * 0.15, w / 2, h / 2, w * 0.65);
  vig.addColorStop(0, 'rgba(3, 3, 5, 0)');
  vig.addColorStop(1, `rgba(3, 3, 5, ${vigStr})`);
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);

  // === HUD OVERLAY TEXT ===
  const hudOp = Math.max(0.05, 0.3 - decay * 0.2);
  ctx.font = "9px 'Orbitron', sans-serif";
  ctx.fillStyle = `rgba(0, 200, 230, ${hudOp})`;
  ctx.fillText('CITY OVERVIEW — LIVE FEED', 16, 24);

  ctx.textAlign = 'right';
  ctx.fillStyle = `rgba(180, 185, 200, ${hudOp * 0.7})`;
  ctx.font = "9px 'IBM Plex Mono', monospace";
  ctx.fillText(`POP ${population.toLocaleString()} | HOPE ${hope}% | SILENCE ${silence}%`, w - 16, 24);
  ctx.textAlign = 'left';

  // Hope ember
  if (hope > 0) {
    const hopePulse = Math.sin(time * 1.5) * 0.3 + 0.7;
    const hx = 20, hy = h - 24;
    const hopeSize = 3 * hopePulse * (hope / 100);
    
    const hGrad = ctx.createRadialGradient(hx, hy, 0, hx, hy, hopeSize * 6);
    hGrad.addColorStop(0, `hsla(45, ${70 * satMult}%, 65%, ${(hope / 100) * 0.5})`);
    hGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = hGrad;
    ctx.beginPath();
    ctx.arc(hx, hy, hopeSize * 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `hsla(45, ${70 * satMult}%, 60%, ${(hope / 100) * 0.7})`;
    ctx.beginPath();
    ctx.arc(hx, hy, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "8px 'IBM Plex Mono', monospace";
    ctx.fillStyle = `hsla(45, ${40 * satMult}%, 55%, ${hope / 250})`;
    const label = hope > 60 ? 'life persists' : hope > 30 ? 'fading...' : hope > 10 ? '...' : '';
    ctx.fillText(label, hx + 12, hy + 3);
  }

  // Silence label
  if (silence > 30) {
    ctx.textAlign = 'right';
    ctx.font = "8px 'IBM Plex Mono', monospace";
    ctx.fillStyle = `rgba(100, 105, 120, ${silence / 250})`;
    ctx.fillText(silence > 80 ? '...' : `silence: ${silence}%`, w - 16, h - 20);
    ctx.textAlign = 'left';
  }
}
