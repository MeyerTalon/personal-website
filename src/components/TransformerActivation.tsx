import { useEffect, useMemo, useRef } from "react";

type RGB = readonly [number, number, number];
type Point = { x: number; y: number };

const ACCENT: RGB = [54, 181, 160]; // #36b5a0
const NEUTRAL: RGB = [210, 220, 230];

const LAYERS = 6;          // transformer blocks
const SEQ_LEN = 10;        // tokens
const HEADS = 4;           // attention heads
const SPEED = 0.35;        // animation speed (units/sec)
const MAX_DPR = 2;

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function smoothstep(t: number) {
  t = clamp01(t);
  return t * t * (3 - 2 * t);
}

function gauss(x: number, s: number) {
  const z = x / s;
  return Math.exp(-0.5 * z * z);
}

function rgba([r, g, b]: RGB, a: number) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Small deterministic PRNG for stable “wiring”
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function quadCurve(ctx: CanvasRenderingContext2D, a: Point, b: Point, bend: number) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;

  // Perp direction for curvature
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len;
  const py = dx / len;

  const cx = mx + px * bend;
  const cy = my + py * bend;

  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.quadraticCurveTo(cx, cy, b.x, b.y);
}

type LayerWiring = {
  // heads -> for each token i, pick a few target tokens (keys) to draw curves to
  headEdges: Array<Array<{ from: number; to: number; w: number }>>;
};

function buildWiring(): LayerWiring[] {
  const out: LayerWiring[] = [];
  for (let l = 0; l < LAYERS; l++) {
    const rand = mulberry32(1337 + l * 97);
    const headEdges: LayerWiring["headEdges"] = [];
    for (let h = 0; h < HEADS; h++) {
      const edges: Array<{ from: number; to: number; w: number }> = [];
      // Sparse-ish: 2–3 edges per token per head
      for (let i = 0; i < SEQ_LEN; i++) {
        const k = 2 + Math.floor(rand() * 2);
        for (let e = 0; e < k; e++) {
          const j = Math.floor(rand() * SEQ_LEN);
          const w = 0.25 + 0.75 * rand(); // “attention weight”
          edges.push({ from: i, to: j, w });
        }
      }
      headEdges.push(edges);
    }
    out.push({ headEdges });
  }
  return out;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function TransformerActivation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const t0Ref = useRef<number>(0);

  const wiring = useMemo(() => buildWiring(), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    if (prefersReducedMotion()) return;

    let w = 0;
    let h = 0;
    let dpr = 1;

    // Layout metrics (computed on resize)
    let layerXs: number[] = [];
    let tokenYs: number[] = [];
    let blockW = 0;
    let attnInset = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = Math.max(1, Math.floor(w * dpr));
      canvas!.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Geometry
      const leftPad = w * 0.08;
      const rightPad = w * 0.06;
      const usableW = Math.max(1, w - leftPad - rightPad);

      blockW = usableW / (LAYERS + 0.8);
      attnInset = blockW * 0.18;

      layerXs = Array.from({ length: LAYERS }, (_, i) => leftPad + blockW * (i + 0.6));

      const topPad = h * 0.18;
      const botPad = h * 0.18;
      const usableH = Math.max(1, h - topPad - botPad);
      tokenYs = Array.from({ length: SEQ_LEN }, (_, i) => topPad + (usableH * i) / (SEQ_LEN - 1));
    }

    function drawBlockChrome() {
      // very subtle “block” silhouettes: attn + mlp inside each layer
      for (let l = 0; l < LAYERS; l++) {
        const x = layerXs[l];
        const y0 = tokenYs[0];
        const y1 = tokenYs[tokenYs.length - 1];
        const height = y1 - y0;

        // outer block
        ctx.globalAlpha = 1;
        ctx.strokeStyle = rgba(NEUTRAL, 0.06);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x - blockW * 0.48, y0 - height * 0.08, blockW * 0.96, height * 1.16, 10);
        ctx.stroke();

        // divider between attention and mlp regions
        ctx.strokeStyle = rgba(NEUTRAL, 0.05);
        ctx.beginPath();
        ctx.moveTo(x + blockW * 0.06, y0 - height * 0.05);
        ctx.lineTo(x + blockW * 0.06, y1 + height * 0.05);
        ctx.stroke();
      }
    }

    function tokenPoint(layer: number, tok: number): Point {
      return { x: layerXs[layer], y: tokenYs[tok] };
    }

    function draw(now: number) {
      if (!t0Ref.current) t0Ref.current = now;
      const t = (now - t0Ref.current) / 1000; // seconds
      const time = t * SPEED;

      ctx.clearRect(0, 0, w, h);

      // Background haze (keeps it soft on any page)
      const bg = ctx.createRadialGradient(w * 0.55, h * 0.5, 0, w * 0.55, h * 0.5, Math.max(w, h) * 0.7);
      bg.addColorStop(0, "rgba(0,0,0,0.00)");
      bg.addColorStop(1, "rgba(0,0,0,0.05)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      drawBlockChrome();

      // Residual stream: base rails between layers for each token
      for (let tok = 0; tok < SEQ_LEN; tok++) {
        ctx.strokeStyle = rgba(NEUTRAL, 0.08);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(layerXs[0] - blockW * 0.48, tokenYs[tok]);
        ctx.lineTo(layerXs[LAYERS - 1] + blockW * 0.48, tokenYs[tok]);
        ctx.stroke();
      }

      // Traveling “activation packet” along the residual stream
      // One packet per token with slight phase offset
      for (let tok = 0; tok < SEQ_LEN; tok++) {
        const tokPhase = (time + tok * 0.12) % (LAYERS + 1);
        const l0 = Math.floor(tokPhase);
        const frac = tokPhase - l0;

        const xA = (l0 <= 0 ? layerXs[0] - blockW * 0.48 : layerXs[Math.min(LAYERS - 1, l0 - 1)] + blockW * 0.48);
        const xB = (l0 >= LAYERS ? layerXs[LAYERS - 1] + blockW * 0.48 : layerXs[Math.min(LAYERS - 1, l0)] - blockW * 0.48);

        const x = xA + (xB - xA) * smoothstep(frac);
        const y = tokenYs[tok];

        const glow = 0.22 + 0.38 * gauss(frac - 0.5, 0.23);

        // soft glow
        const g = ctx.createRadialGradient(x, y, 0, x, y, 22);
        g.addColorStop(0, rgba(ACCENT, 0.35 * glow));
        g.addColorStop(0.4, rgba(ACCENT, 0.10 * glow));
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fill();

        // core
        ctx.fillStyle = rgba(ACCENT, 0.75 * glow);
        ctx.beginPath();
        ctx.arc(x, y, 3.2 + 2.8 * glow, 0, Math.PI * 2);
        ctx.fill();
      }

      // Per-layer: Attention (intra-token mixing) and MLP (per-token transform)
      for (let l = 0; l < LAYERS; l++) {
        const x = layerXs[l];

        // Phase inside this block: attention then mlp
        // Use a local cycle per layer, so multiple layers are “alive” at once (more realistic than a single wave)
        const local = (time * 0.9 + l * 0.28) % 1; // [0,1)
        const attnGate = smoothstep(1 - Math.abs(local - 0.30) / 0.22); // peaked near 0.30
        const mlpGate = smoothstep(1 - Math.abs(local - 0.72) / 0.22);  // peaked near 0.72

        // --- Attention curves (multiple heads) ---
        // Base faint curves + highlighted moving “head focus”
        for (let hIdx = 0; hIdx < HEADS; hIdx++) {
          const edges = wiring[l].headEdges[hIdx];

          // head-specific oscillation for highlights
          const headOsc = (time * (0.9 + 0.12 * hIdx) + l * 0.19 + hIdx * 0.33) % 1;

          // Draw base lattice faintly
          ctx.lineWidth = 0.9;
          ctx.strokeStyle = rgba(ACCENT, 0.03);
          for (let e = 0; e < edges.length; e++) {
            const { from, to } = edges[e];
            const a = { x: x - attnInset, y: tokenYs[from] };
            const b = { x: x + attnInset, y: tokenYs[to] };
            const bend = (tokenYs[to] - tokenYs[from]) * 0.35;
            quadCurve(ctx, a, b, bend);
            ctx.stroke();
          }

          // Highlight a subset sweeping through edges
          // Pick a moving window in edge index space (cheap + stable)
          const center = Math.floor(headOsc * edges.length);
          const window = Math.max(10, Math.floor(edges.length * 0.08));

          for (let k = -window; k <= window; k++) {
            const idx = (center + k + edges.length) % edges.length;
            const edge = edges[idx];
            const wgt = edge.w;

            const dist = Math.abs(k) / (window + 1);
            const hi = (1 - dist) * attnGate * (0.25 + 0.75 * wgt);

            if (hi <= 0.01) continue;

            const a = { x: x - attnInset, y: tokenYs[edge.from] };
            const b = { x: x + attnInset, y: tokenYs[edge.to] };
            const bend = (tokenYs[edge.to] - tokenYs[edge.from]) * 0.35;

            ctx.lineWidth = 1.2;
            ctx.strokeStyle = rgba(ACCENT, 0.10 + 0.18 * hi);
            quadCurve(ctx, a, b, bend);
            ctx.stroke();
          }
        }

        // --- MLP pulses (per-token nonlinearity / channel mixing) ---
        // Represent as a little “bulge” and glow on each token after attention
        for (let tok = 0; tok < SEQ_LEN; tok++) {
          const p = tokenPoint(l, tok);

          const tokJitter = 0.85 + 0.15 * Math.sin((tok + 1) * 1.7 + l * 0.6);
          const mlp = mlpGate * tokJitter;

          // Node core (always visible)
          ctx.fillStyle = rgba(NEUTRAL, 0.18);
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2);
          ctx.fill();

          if (mlp > 0.02) {
            const r = 10 + 28 * mlp;
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
            g.addColorStop(0, rgba(ACCENT, 0.14 + 0.22 * mlp));
            g.addColorStop(0.5, rgba(ACCENT, 0.05 + 0.10 * mlp));
            g.addColorStop(1, "rgba(0,0,0,0)");

            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.x + blockW * 0.16, p.y, r, 0, Math.PI * 2); // slightly into “MLP sub-block”
            ctx.fill();

            ctx.fillStyle = rgba(ACCENT, 0.25 + 0.45 * mlp);
            ctx.beginPath();
            ctx.arc(p.x + blockW * 0.16, p.y, 2.4 + 3.2 * mlp, 0, Math.PI * 2);
            ctx.fill();
          }

          // Attention output “merge” bump (subtle, earlier in the block)
          const attn = attnGate * (0.9 + 0.1 * Math.cos(tok * 1.1 + l));
          if (attn > 0.02) {
            ctx.fillStyle = rgba(ACCENT, 0.10 + 0.18 * attn);
            ctx.beginPath();
            ctx.arc(p.x - blockW * 0.10, p.y, 1.8 + 2.2 * attn, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Residual “add” indicator (thin vertical shimmer line through the block)
        const addGlow = 0.06 + 0.14 * (attnGate + mlpGate);
        ctx.strokeStyle = rgba(ACCENT, addGlow);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, tokenYs[0] - h * 0.02);
        ctx.lineTo(x, tokenYs[tokenYs.length - 1] + h * 0.02);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [wiring]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ opacity: 0.92 }}
      aria-hidden="true"
    />
  );
}
