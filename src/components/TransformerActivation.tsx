import { useEffect, useRef } from 'react';

const SEQ_LEN = 14;
const NUM_LAYERS = 6;
const ACCENT = [54, 181, 160]; // #36b5a0
const WAVE_SPEED = 0.006;
const TOKEN_RADIUS = 2.5;
const MAX_PARTICLES = 120;

// Deterministic pseudo-random for reproducible attention patterns
function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 12345) % 2147483647;
    return (s & 0x7fffffff) / 0x7fffffff;
  };
}

type Arc = [number, number, number]; // [from, to, weight]

function generateAttentionPatterns(): Arc[][] {
  const patterns: Arc[][] = [];

  for (let layer = 0; layer < NUM_LAYERS; layer++) {
    const arcs: Arc[] = [];
    const rng = seededRng(layer * 1337 + 42);

    if (layer < 2) {
      // Early layers: mostly local / positional attention
      for (let i = 0; i < SEQ_LEN; i++) {
        const reach = 2 + Math.floor(rng() * 2);
        for (let d = 1; d <= reach; d++) {
          if (i + d < SEQ_LEN) arcs.push([i, i + d, 0.6 + rng() * 0.4]);
          if (i - d >= 0 && rng() > 0.3) arcs.push([i, i - d, 0.3 + rng() * 0.4]);
        }
      }
    } else if (layer < NUM_LAYERS - 1) {
      // Middle layers: mix of local + long-range + anchor tokens
      for (let i = 0; i < SEQ_LEN; i++) {
        // Local
        if (i > 0 && rng() > 0.2) arcs.push([i, i - 1, 0.3 + rng() * 0.4]);
        if (i < SEQ_LEN - 1 && rng() > 0.2) arcs.push([i, i + 1, 0.3 + rng() * 0.4]);
        // Long-range
        const nLong = 1 + Math.floor(rng() * 3);
        for (let c = 0; c < nLong; c++) {
          const j = Math.floor(rng() * SEQ_LEN);
          if (j !== i) arcs.push([i, j, 0.2 + rng() * 0.6]);
        }
        // Anchor to first token (BOS / [CLS] pattern)
        if (i > 0 && rng() > 0.4) arcs.push([i, 0, 0.35 + rng() * 0.35]);
      }
    } else {
      // Final layer: focused on specific important positions
      const anchors = [0, 1, Math.floor(SEQ_LEN * 0.5), SEQ_LEN - 1];
      for (let i = 0; i < SEQ_LEN; i++) {
        for (const a of anchors) {
          if (a !== i && rng() > 0.25) arcs.push([i, a, 0.4 + rng() * 0.6]);
        }
      }
    }

    patterns.push(arcs);
  }

  return patterns;
}

interface Particle {
  alive: boolean;
  x: number;
  y: number;
  progress: number;
  speed: number;
  // Path definition — quadratic bezier
  x0: number; y0: number;
  cx: number; cy: number;
  x1: number; y1: number;
  brightness: number;
}

function lerpBezier(p: Particle, t: number) {
  const u = 1 - t;
  p.x = u * u * p.x0 + 2 * u * t * p.cx + t * t * p.x1;
  p.y = u * u * p.y0 + 2 * u * t * p.cy + t * t * p.y1;
}

export function TransformerActivation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    let w = 0;
    let h = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);

    const attentionPatterns = generateAttentionPatterns();

    // Particle pool
    const particles: Particle[] = Array.from({ length: MAX_PARTICLES }, () => ({
      alive: false, x: 0, y: 0, progress: 0, speed: 0,
      x0: 0, y0: 0, cx: 0, cy: 0, x1: 0, y1: 0, brightness: 0,
    }));

    function spawnParticle(
      x0: number, y0: number,
      cx: number, cy: number,
      x1: number, y1: number,
      brightness: number
    ) {
      for (let i = 0; i < particles.length; i++) {
        if (!particles[i].alive) {
          const p = particles[i];
          p.alive = true;
          p.progress = 0;
          p.speed = 0.008 + Math.random() * 0.012;
          p.x0 = x0; p.y0 = y0;
          p.cx = cx; p.cy = cy;
          p.x1 = x1; p.y1 = y1;
          p.brightness = brightness;
          lerpBezier(p, 0);
          return;
        }
      }
    }

    // Track spawning to avoid flooding
    let lastSpawnPhase = -1;

    function getTokenX(t: number): number {
      const marginX = w * 0.12;
      const usable = w * 0.76;
      return marginX + (t / (SEQ_LEN - 1)) * usable;
    }

    function getLayerY(layer: number): number {
      const marginY = h * 0.13;
      const usable = h * 0.74;
      return marginY + (layer / (NUM_LAYERS - 1)) * usable;
    }

    function draw() {
      phaseRef.current += WAVE_SPEED;
      const totalCycle = NUM_LAYERS + 3;
      if (phaseRef.current > totalCycle) phaseRef.current -= totalCycle;
      const phase = phaseRef.current;

      ctx!.clearRect(0, 0, w, h);

      // Residual / skip connections — faint vertical lines per token
      ctx!.lineWidth = 0.6;
      for (let t = 0; t < SEQ_LEN; t++) {
        const x = getTokenX(t);
        ctx!.beginPath();
        ctx!.moveTo(x, getLayerY(0));
        ctx!.lineTo(x, getLayerY(NUM_LAYERS - 1));
        ctx!.strokeStyle = `rgba(${ACCENT[0]}, ${ACCENT[1]}, ${ACCENT[2]}, 0.035)`;
        ctx!.stroke();
      }

      // Determine which layer to spawn particles on (once per layer crossing)
      const spawnLayer = Math.floor(phase);
      const shouldSpawn = spawnLayer !== lastSpawnPhase && spawnLayer >= 0 && spawnLayer < NUM_LAYERS;
      if (shouldSpawn) lastSpawnPhase = spawnLayer;

      // Draw layers
      for (let layer = 0; layer < NUM_LAYERS; layer++) {
        const y = getLayerY(layer);
        const dist = phase - layer;
        const activation = Math.exp(-dist * dist * 0.6);

        // Self-attention arcs
        const arcs = attentionPatterns[layer];
        for (const [from, to, weight] of arcs) {
          const x0 = getTokenX(from);
          const x1 = getTokenX(to);
          const midX = (x0 + x1) * 0.5;
          const span = Math.abs(to - from);
          const arcH = Math.min(span * 14, 55);
          const midY = y - arcH;

          const arcOpacity = 0.03 + activation * weight * 0.28;

          ctx!.beginPath();
          ctx!.moveTo(x0, y);
          ctx!.quadraticCurveTo(midX, midY, x1, y);
          ctx!.strokeStyle = `rgba(${ACCENT[0]}, ${ACCENT[1]}, ${ACCENT[2]}, ${arcOpacity})`;
          ctx!.lineWidth = 0.4 + activation * weight * 1.2;
          ctx!.stroke();

          // Spawn particles along arcs when wave arrives
          if (shouldSpawn && layer === spawnLayer && Math.random() < weight * 0.4) {
            spawnParticle(x0, y, midX, midY, x1, y, weight);
          }
        }

        // FFN connections to next layer (vertical per-token)
        if (layer < NUM_LAYERS - 1) {
          const nextY = getLayerY(layer + 1);
          const ffnDist = dist - 0.5;
          const ffnActivation = Math.exp(-ffnDist * ffnDist * 1.2);

          for (let t = 0; t < SEQ_LEN; t++) {
            const x = getTokenX(t);
            const opacity = 0.025 + ffnActivation * 0.14;

            ctx!.beginPath();
            ctx!.moveTo(x, y);
            ctx!.lineTo(x, nextY);
            ctx!.strokeStyle = `rgba(${ACCENT[0]}, ${ACCENT[1]}, ${ACCENT[2]}, ${opacity})`;
            ctx!.lineWidth = 0.5 + ffnActivation * 0.8;
            ctx!.stroke();

            // Spawn downward particles for FFN pass
            if (shouldSpawn && layer === spawnLayer && Math.random() < 0.25) {
              const midFfn = (y + nextY) * 0.5;
              spawnParticle(x, y, x, midFfn, x, nextY, 0.6);
            }
          }
        }

        // Token nodes
        for (let t = 0; t < SEQ_LEN; t++) {
          const x = getTokenX(t);
          const nodeAct = activation * (0.6 + 0.4 * Math.sin(t * 0.7 + layer * 1.1));
          const r = TOKEN_RADIUS + nodeAct * 2;
          const opacity = 0.12 + nodeAct * 0.55;

          // Glow
          const grad = ctx!.createRadialGradient(x, y, 0, x, y, r * 4);
          grad.addColorStop(
            0,
            `rgba(${ACCENT[0]}, ${ACCENT[1]}, ${ACCENT[2]}, ${opacity * 0.7})`
          );
          grad.addColorStop(
            0.45,
            `rgba(${ACCENT[0]}, ${ACCENT[1]}, ${ACCENT[2]}, ${opacity * 0.12})`
          );
          grad.addColorStop(1, 'rgba(54, 181, 160, 0)');
          ctx!.beginPath();
          ctx!.arc(x, y, r * 4, 0, Math.PI * 2);
          ctx!.fillStyle = grad;
          ctx!.fill();

          // Core
          ctx!.beginPath();
          ctx!.arc(x, y, r, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${ACCENT[0]}, ${ACCENT[1]}, ${ACCENT[2]}, ${Math.min(1, opacity + 0.25)})`;
          ctx!.fill();
        }
      }

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p.alive) continue;

        p.progress += p.speed;
        if (p.progress >= 1) {
          p.alive = false;
          continue;
        }

        lerpBezier(p, p.progress);

        const fade = Math.sin(p.progress * Math.PI); // 0 → 1 → 0
        const r = 1.5 + fade * 1.5;
        const opacity = fade * p.brightness * 0.9;

        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
        grad.addColorStop(
          0,
          `rgba(${ACCENT[0]}, ${ACCENT[1]}, ${ACCENT[2]}, ${opacity})`
        );
        grad.addColorStop(
          0.5,
          `rgba(${ACCENT[0]}, ${ACCENT[1]}, ${ACCENT[2]}, ${opacity * 0.3})`
        );
        grad.addColorStop(1, 'rgba(54, 181, 160, 0)');
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
        ctx!.fillStyle = grad;
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
        ctx!.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ opacity: 0.55 }}
      aria-hidden="true"
    />
  );
}
