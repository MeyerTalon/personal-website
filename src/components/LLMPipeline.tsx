import { useEffect, useRef, useState, useMemo } from 'react';
import { TypingEffect } from './TypingEffect';

/* ── Types ──────────────────────────────────────────────── */
type RGB = readonly [number, number, number];
type Point = { x: number; y: number };
type Edge = { from: number; to: number; w: number };

export type LLMPhase =
  | 'intro'
  | 'shift'
  | 'tokenize'
  | 'process'
  | 'output'
  | 'idle';

/* ── Constants ──────────────────────────────────────────── */
const ACCENT: RGB = [54, 181, 160];
const NEUTRAL: RGB = [210, 220, 230];

// Named transformer stages shown as distinct blocks
const STAGE_LABELS = ['embed', 'self-attn', 'gelu', 'ffn', 'softmax', 'lm_head'] as const;
const LAYERS = STAGE_LABELS.length;

const NAME_TEXT = 'talon meyer.';
const TOKEN_SLOTS = 8;

// "talon meyer." tokenized into subword tokens
const INPUT_TOKENS: string[] = [
  '<PAD>',
  '<BOS>',
  'tal',
  'on',
  'me',
  'yer',
  '.',
  '<EOS>',
];

const OUTPUT_TOKENS: string[] = [
  '<BOS>',
  'machine',
  'learning',
  'engineer',
  'and',
  'researcher',
  '.',
  '<EOS>',
];

const N_TOK = TOKEN_SLOTS;
const HEADS = 4;
const SPEED = 0.2;
const MAX_DPR = 2;
const TYPE_SPEED = 75;

// Layout fractions
const INPUT_X = 0.06;
const ARCH_L = 0.15;
const ARCH_R = 0.73;
const OUTPUT_X = 0.87;
const TOK_T = 0.24;
const TOK_B = 0.76;

// Phase timing (ms from mount)
const T_SHIFT = 2000;
const T_TOKENIZE = 3200;
const T_PROCESS = 4500;
const T_OUTPUT = 8500;
const T_IDLE = 11500;

const PHASES: LLMPhase[] = ['intro', 'shift', 'tokenize', 'process', 'output', 'idle'];

/* ── Helpers ────────────────────────────────────────────── */
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
  return `rgba(${r},${g},${b},${a})`;
}

function geluActivation(x: number) {
  return 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x * x * x)));
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function layerXFrac(i: number) {
  return ARCH_L + ((ARCH_R - ARCH_L) * i) / (LAYERS - 1);
}

function tokenYFrac(i: number) {
  return TOK_T + ((TOK_B - TOK_T) * i) / (N_TOK - 1);
}

function quadCurve(ctx: CanvasRenderingContext2D, a: Point, b: Point, bend: number) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len;
  const py = dx / len;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.quadraticCurveTo(mx + px * bend, my + py * bend, b.x, b.y);
}

/* ── Wiring (deterministic attention patterns) ──────────── */
function buildWiring(): Edge[][][] {
  const out: Edge[][][] = [];
  for (let l = 0; l < LAYERS; l++) {
    const rand = mulberry32(1337 + l * 97);
    const heads: Edge[][] = [];
    for (let h = 0; h < HEADS; h++) {
      const edges: Edge[] = [];
      for (let i = 0; i < N_TOK; i++) {
        const k = 2 + Math.floor(rand() * 3);
        for (let e = 0; e < k; e++) {
          const j = Math.floor(rand() * N_TOK);
          const w = 0.25 + 0.75 * rand();
          edges.push({ from: i, to: j, w });
        }
      }
      heads.push(edges);
    }
    out.push(heads);
  }
  return out;
}

/* ── Component ──────────────────────────────────────────── */
interface LLMPipelineProps {
  onPhaseChange?: (phase: LLMPhase) => void;
  className?: string;
}

export function LLMPipeline({ onPhaseChange, className }: LLMPipelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const t0Ref = useRef(0);
  const [phase, setPhase] = useState<LLMPhase>('intro');
  const [showName, setShowName] = useState(false);
  const [typedName, setTypedName] = useState('');
  const wiring = useMemo(buildWiring, []);

  const pidx = PHASES.indexOf(phase);
  const after = (p: LLMPhase) => pidx >= PHASES.indexOf(p);

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  /* Phase timers + name typing */
  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];

    ts.push(setTimeout(() => setShowName(true), 100));
    for (let i = 0; i < NAME_TEXT.length; i++) {
      ts.push(
        setTimeout(
          () => setTypedName(NAME_TEXT.slice(0, i + 1)),
          100 + (i + 1) * TYPE_SPEED,
        ),
      );
    }

    ts.push(setTimeout(() => setPhase('shift'), T_SHIFT));
    ts.push(setTimeout(() => setPhase('tokenize'), T_TOKENIZE));
    ts.push(setTimeout(() => setPhase('process'), T_PROCESS));
    ts.push(setTimeout(() => setPhase('output'), T_OUTPUT));
    ts.push(setTimeout(() => setPhase('idle'), T_IDLE));

    return () => ts.forEach(clearTimeout);
  }, []);

  /* ── Canvas animation ────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let w = 0;
    let h = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const lx = (i: number) => layerXFrac(i) * w;
    const ty = (i: number) => tokenYFrac(i) * h;
    const bw = () => ((ARCH_R - ARCH_L) / (LAYERS + 0.5)) * w;

    // Deterministic embedding vectors per token
    const embVecs: number[][] = Array.from({ length: N_TOK }, (_, i) => {
      const rand = mulberry32(42 + i * 17);
      return Array.from({ length: 10 }, () => rand());
    });

    /* ── Stage-specific canvas drawing ── */

    function drawEmbed(cx: number, _y0: number, _y1: number, B: number, elapsed: number) {
      // Show each token row as an embedding vector (bar chart lookup)
      for (let t = 0; t < N_TOK; t++) {
        const py = ty(t);
        const vec = embVecs[t];
        const nBars = vec.length;
        const barW = (B * 0.72) / nBars;
        const startX = cx - B * 0.36;
        const maxH = 11;

        for (let v = 0; v < nBars; v++) {
          const baseH = vec[v] * maxH;
          // Subtle breathing animation
          const animH = baseH * (0.88 + 0.12 * Math.sin(elapsed * 0.8 + v * 0.9 + t * 0.6));
          const bx = startX + v * barW + barW / 2;
          const alpha = 0.06 + 0.22 * vec[v];
          ctx!.fillStyle = rgba(ACCENT, alpha);
          ctx!.fillRect(bx - barW * 0.28, py - animH / 2, barW * 0.56, animH);
        }

        // Small dot at token entry
        ctx!.fillStyle = rgba(NEUTRAL, 0.16);
        ctx!.beginPath();
        ctx!.arc(cx - B * 0.44, py, 2, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function drawSelfAttn(cx: number, B: number, l: number, elapsed: number) {
      const time = elapsed * SPEED;
      const local = (time * 0.55 + l * 0.28) % 1;
      const attnGate = smoothstep(1 - Math.abs(local - 0.3) / 0.22);

      for (let hi = 0; hi < HEADS; hi++) {
        const edges = wiring[l][hi];
        const headOsc = (time * (0.55 + 0.08 * hi) + l * 0.19 + hi * 0.33) % 1;

        // Dim base lattice
        for (const edge of edges) {
          const dy = ty(edge.to) - ty(edge.from);
          const bend = Math.abs(dy) < 1 ? 22 * (hi % 2 === 0 ? 1 : -1) : dy * 0.35;
          quadCurve(
            ctx!,
            { x: cx - B * 0.22, y: ty(edge.from) },
            { x: cx - B * 0.02, y: ty(edge.to) },
            bend,
          );
          ctx!.strokeStyle = rgba(ACCENT, 0.02);
          ctx!.lineWidth = 0.8;
          ctx!.stroke();
        }

        // Highlighted sweep
        const ctr = Math.floor(headOsc * edges.length);
        const win = Math.max(2, Math.floor(edges.length * 0.2));
        for (let k = -win; k <= win; k++) {
          const idx = (ctr + k + edges.length) % edges.length;
          const edge = edges[idx];
          const dist = Math.abs(k) / (win + 1);
          const hi2 = (1 - dist) * attnGate * (0.25 + 0.75 * edge.w);
          if (hi2 < 0.01) continue;
          const dy = ty(edge.to) - ty(edge.from);
          const bend = Math.abs(dy) < 1 ? 22 * (hi % 2 === 0 ? 1 : -1) : dy * 0.35;
          quadCurve(
            ctx!,
            { x: cx - B * 0.22, y: ty(edge.from) },
            { x: cx - B * 0.02, y: ty(edge.to) },
            bend,
          );
          ctx!.strokeStyle = rgba(ACCENT, 0.06 + 0.2 * hi2);
          ctx!.lineWidth = 1.1;
          ctx!.stroke();
        }

        // Merge dots per token
        for (let t = 0; t < N_TOK; t++) {
          const attn = attnGate * (0.9 + 0.1 * Math.cos(t * 1.1 + l));
          if (attn > 0.02) {
            ctx!.fillStyle = rgba(ACCENT, 0.08 + 0.15 * attn);
            ctx!.beginPath();
            ctx!.arc(cx - B * 0.12, ty(t), 1.5 + 2 * attn, 0, Math.PI * 2);
            ctx!.fill();
          }
        }
      }
    }

    function drawGelu(cx: number, y0: number, y1: number, B: number, elapsed: number) {
      const midY = (y0 + y1) / 2;
      const curveW = B * 0.58;
      const curveH = (y1 - y0) * 0.42;

      // Draw GELU curve — x from -2.5 to 2.5
      const steps = 48;
      ctx!.beginPath();
      ctx!.strokeStyle = rgba(ACCENT, 0.28);
      ctx!.lineWidth = 1.3;
      for (let s = 0; s <= steps; s++) {
        const frac = s / steps;
        const xVal = (frac - 0.5) * 5;
        const yVal = geluActivation(xVal);
        // Normalize: GELU(-2.5)≈-0.02, GELU(2.5)≈2.47
        const normY = (yVal + 0.02) / 2.49;
        const px = cx - curveW / 2 + frac * curveW;
        const py = midY + curveH * 0.5 - normY * curveH;
        if (s === 0) ctx!.moveTo(px, py);
        else ctx!.lineTo(px, py);
      }
      ctx!.stroke();

      // Animated pulse travelling along the curve
      const pulseFrac = (elapsed * 0.18) % 1;
      const pulseXVal = (pulseFrac - 0.5) * 5;
      const pulseYVal = geluActivation(pulseXVal);
      const normPY = (pulseYVal + 0.02) / 2.49;
      const pPX = cx - curveW / 2 + pulseFrac * curveW;
      const pPY = midY + curveH * 0.5 - normPY * curveH;

      const glowR = ctx!.createRadialGradient(pPX, pPY, 0, pPX, pPY, 12);
      glowR.addColorStop(0, rgba(ACCENT, 0.55));
      glowR.addColorStop(1, 'rgba(0,0,0,0)');
      ctx!.fillStyle = glowR;
      ctx!.beginPath();
      ctx!.arc(pPX, pPY, 12, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = rgba(ACCENT, 0.9);
      ctx!.beginPath();
      ctx!.arc(pPX, pPY, 2.5, 0, Math.PI * 2);
      ctx!.fill();

      // Activated node per token row
      for (let t = 0; t < N_TOK; t++) {
        const rawAct = Math.sin(elapsed * 0.4 + t * 0.73) * 1.8;
        const act = geluActivation(rawAct);
        const normAct = clamp01((act + 0.02) / 2.49);
        const r = 2 + 3.5 * normAct;
        ctx!.fillStyle = rgba(ACCENT, 0.1 + 0.35 * normAct);
        ctx!.beginPath();
        ctx!.arc(cx + B * 0.28, ty(t), r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function drawFFN(cx: number, y0: number, y1: number, B: number, elapsed: number) {
      // Wide hidden layer → narrow output: two columns of nodes
      const x1 = cx - B * 0.22;
      const x2 = cx + B * 0.22;
      const nWide = 5;
      const nNarrow = 3;
      const spanH = y1 - y0;

      const wideNodes = Array.from({ length: nWide }, (_, i) => ({
        x: x1,
        y: y0 + (spanH * (i + 0.5)) / nWide,
      }));
      const narrowNodes = Array.from({ length: nNarrow }, (_, i) => ({
        x: x2,
        y: y0 + (spanH * (i + 1)) / (nNarrow + 1),
      }));

      // Connections — animated wave sweeping left→right
      const rand = mulberry32(7331);
      const weights: number[] = Array.from(
        { length: wideNodes.length * narrowNodes.length },
        () => 0.2 + 0.8 * rand(),
      );
      let wi = 0;
      for (const wn of wideNodes) {
        for (const nn of narrowNodes) {
          const w = weights[wi++];
          // Fast ripple per connection
          const pulse = Math.sin(elapsed * 1.8 + wn.y * 0.018 + nn.y * 0.012) * 0.5 + 0.5;
          const brightness = w * pulse;
          ctx!.strokeStyle = rgba(ACCENT, 0.04 + 0.28 * brightness);
          ctx!.lineWidth = 0.5 + 1.2 * brightness;
          ctx!.beginPath();
          ctx!.moveTo(wn.x, wn.y);
          ctx!.lineTo(nn.x, nn.y);
          ctx!.stroke();
        }
      }

      // Wide nodes — bright input activations
      for (const n of wideNodes) {
        const act = Math.sin(elapsed * 1.2 + n.y * 0.022) * 0.5 + 0.5;
        const r = 3 + 2 * act;
        const g = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, r + 8);
        g.addColorStop(0, rgba(NEUTRAL, 0.3 + 0.3 * act));
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, r + 8, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.fillStyle = rgba(NEUTRAL, 0.5 + 0.4 * act);
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Narrow nodes — bright output activations with accent glow
      for (const n of narrowNodes) {
        const act = Math.sin(elapsed * 1.2 + n.y * 0.022 + 1.1) * 0.5 + 0.5;
        const r = 3.5 + 2.5 * act;
        const g = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, r + 14);
        g.addColorStop(0, rgba(ACCENT, 0.35 + 0.35 * act));
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, r + 14, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.fillStyle = rgba(ACCENT, 0.6 + 0.35 * act);
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function drawSoftmax(cx: number, y0: number, y1: number, B: number, elapsed: number) {
      // Show N_TOK logit bars that sum to 1 (animated softmax distribution)
      const spanH = y1 - y0;
      const barMaxW = B * 0.48;
      const barH = (spanH / N_TOK) * 0.52;

      // Animated logits — shift over time so probabilities flow and redistribute
      const logits = Array.from({ length: N_TOK }, (_, i) =>
        Math.sin(elapsed * 0.4 + i * 1.3) * 1.5 + Math.cos(elapsed * 0.27 + i * 0.9),
      );
      const maxLogit = Math.max(...logits);
      const exps = logits.map((l) => Math.exp(l - maxLogit));
      const sumExp = exps.reduce((a, b) => a + b, 0);
      const probs = exps.map((e) => e / sumExp);

      // Highlight the top-prob token
      const topIdx = probs.indexOf(Math.max(...probs));

      for (let t = 0; t < N_TOK; t++) {
        const py = ty(t);
        const barW = probs[t] * barMaxW;
        const isTop = t === topIdx;

        // Bar fill
        ctx!.fillStyle = isTop ? rgba(ACCENT, 0.45) : rgba(ACCENT, 0.12);
        ctx!.fillRect(cx - barMaxW / 2, py - barH / 2, barW, barH);

        // Bar outline
        ctx!.strokeStyle = isTop ? rgba(ACCENT, 0.6) : rgba(NEUTRAL, 0.08);
        ctx!.lineWidth = 0.6;
        ctx!.strokeRect(cx - barMaxW / 2, py - barH / 2, barMaxW, barH);

        // Glow on top token
        if (isTop) {
          const g = ctx!.createRadialGradient(cx - barMaxW / 2 + barW / 2, py, 0, cx - barMaxW / 2 + barW / 2, py, barMaxW * 0.7);
          g.addColorStop(0, rgba(ACCENT, 0.18));
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx!.fillStyle = g;
          ctx!.fillRect(cx - barMaxW / 2, py - barH * 2, barMaxW, barH * 4);
        }

        // Probability label on the right edge
        ctx!.font = `${isTop ? 'bold ' : ''}8px "JetBrains Mono", monospace`;
        ctx!.textAlign = 'left';
        ctx!.fillStyle = isTop ? rgba(ACCENT, 0.9) : rgba(NEUTRAL, 0.25);
        ctx!.fillText(`${(probs[t] * 100).toFixed(0)}%`, cx + barMaxW / 2 + 3, py + 3);
      }
    }

    function drawLMHead(cx: number, y0: number, y1: number, B: number, elapsed: number) {
      // Linear projection head — converging fan-out nodes
      const nProj = 7;
      const projNodes = Array.from({ length: nProj }, (_, i) => ({
        x: cx,
        y: y0 + ((y1 - y0) * (i + 0.5)) / nProj,
      }));

      // Fan-in connections from token rails → projection nodes
      for (let t = 0; t < N_TOK; t++) {
        for (let p = 0; p < nProj; p++) {
          const w = Math.abs(Math.sin(p * 1.73 + t * 1.21)) * 0.4;
          const pulse = Math.sin(elapsed * 0.45 + t * 0.4 + p * 0.6) * 0.5 + 0.5;
          ctx!.strokeStyle = rgba(ACCENT, 0.02 + 0.06 * w * pulse);
          ctx!.lineWidth = 0.4;
          ctx!.beginPath();
          ctx!.moveTo(cx - B * 0.35, ty(t));
          ctx!.lineTo(projNodes[p].x, projNodes[p].y);
          ctx!.stroke();
        }
      }

      // Projection nodes
      for (let p = 0; p < nProj; p++) {
        const n = projNodes[p];
        const pulse = Math.sin(elapsed * 0.6 + p * 0.72) * 0.5 + 0.5;
        const r = 2.5 + 2 * pulse;
        const glowR = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, r + 8);
        glowR.addColorStop(0, rgba(ACCENT, 0.18 + 0.2 * pulse));
        glowR.addColorStop(1, 'rgba(0,0,0,0)');
        ctx!.fillStyle = glowR;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, r + 8, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.fillStyle = rgba(ACCENT, 0.4 + 0.35 * pulse);
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function draw(now: number) {
      if (!t0Ref.current) t0Ref.current = now;
      const elapsed = (now - t0Ref.current) / 1000;
      const time = elapsed * SPEED;

      ctx!.clearRect(0, 0, w, h);

      const tokSec = T_TOKENIZE / 1000;
      const procSec = T_PROCESS / 1000;
      const outSec = T_OUTPUT / 1000;

      const railAlpha = smoothstep(clamp01((elapsed - tokSec + 0.3) / 1.2));
      const archAlpha = smoothstep(clamp01((elapsed - procSec) / 1.5));
      const outAlpha = smoothstep(clamp01((elapsed - outSec) / 1.0));
      const layerProgress = clamp01((elapsed - procSec) / (outSec - procSec));

      const B = bw();

      /* Background glow */
      if (archAlpha > 0) {
        const cx = (w * (ARCH_L + ARCH_R)) / 2;
        const cy = (h * (TOK_T + TOK_B)) / 2;
        const r = Math.max(w, h) * 0.5;
        const bg = ctx!.createRadialGradient(cx, cy, 0, cx, cy, r);
        bg.addColorStop(0, rgba(ACCENT, 0.025 * archAlpha));
        bg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx!.fillStyle = bg;
        ctx!.fillRect(0, 0, w, h);
      }

      /* Token rails */
      if (railAlpha > 0) {
        for (let t = 0; t < N_TOK; t++) {
          const y = ty(t);
          ctx!.strokeStyle = rgba(NEUTRAL, 0.055 * railAlpha);
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(w * INPUT_X + 32, y);
          ctx!.lineTo(w * OUTPUT_X - 32, y);
          ctx!.stroke();
        }
      }

      /* Dashed input → first block connectors */
      if (railAlpha > 0) {
        ctx!.setLineDash([3, 5]);
        for (let t = 0; t < N_TOK; t++) {
          const y = ty(t);
          ctx!.strokeStyle = rgba(ACCENT, 0.1 * railAlpha);
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(w * INPUT_X + 32, y);
          ctx!.lineTo(lx(0) - B / 2, y);
          ctx!.stroke();
        }
        ctx!.setLineDash([]);
      }

      /* Flow arrows between stage blocks */
      if (archAlpha > 0) {
        const midY = (h * (TOK_T + TOK_B)) / 2;
        for (let l = 0; l < LAYERS - 1; l++) {
          const lr =
            smoothstep(clamp01((layerProgress * LAYERS - l - 0.5) * 1.5)) * archAlpha;
          if (lr <= 0) continue;
          const x1 = lx(l) + B / 2 + 3;
          const x2 = lx(l + 1) - B / 2 - 3;
          ctx!.globalAlpha = lr;
          ctx!.strokeStyle = rgba(NEUTRAL, 0.08);
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(x1, midY);
          ctx!.lineTo(x2 - 5, midY);
          ctx!.stroke();
          ctx!.fillStyle = rgba(NEUTRAL, 0.08);
          ctx!.beginPath();
          ctx!.moveTo(x2, midY);
          ctx!.lineTo(x2 - 6, midY - 3);
          ctx!.lineTo(x2 - 6, midY + 3);
          ctx!.closePath();
          ctx!.fill();
          ctx!.globalAlpha = 1;
        }
      }

      /* Stage blocks */
      for (let l = 0; l < LAYERS; l++) {
        const lr =
          smoothstep(clamp01((layerProgress * LAYERS - l) * 1.5)) * archAlpha;
        if (lr <= 0) continue;

        const cx = lx(l);
        const y0 = ty(0);
        const y1 = ty(N_TOK - 1);
        const blockH = y1 - y0;
        const margin = Math.max(blockH * 0.22, 22);

        ctx!.globalAlpha = lr;

        // Block outline + fill
        ctx!.strokeStyle = rgba(NEUTRAL, 0.07);
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.roundRect(cx - B / 2, y0 - margin, B, blockH + margin * 2, 8);
        ctx!.stroke();
        ctx!.fillStyle = rgba(ACCENT, 0.006);
        ctx!.fill();

        // Stage label above block
        ctx!.font = '10px "JetBrains Mono", monospace';
        ctx!.textAlign = 'center';
        ctx!.fillStyle = rgba(NEUTRAL, 0.28);
        ctx!.fillText(STAGE_LABELS[l], cx, y0 - margin - 8);

        // Clip internals to block bounds, then draw stage-specific visuals
        ctx!.save();
        ctx!.beginPath();
        ctx!.roundRect(cx - B / 2, y0 - margin, B, blockH + margin * 2, 8);
        ctx!.clip();

        switch (STAGE_LABELS[l]) {
          case 'embed':
            drawEmbed(cx, y0, y1, B, elapsed);
            break;
          case 'self-attn':
            drawSelfAttn(cx, B, l, elapsed);
            break;
          case 'gelu':
            drawGelu(cx, y0, y1, B, elapsed);
            break;
          case 'ffn':
            drawFFN(cx, y0, y1, B, elapsed);
            break;
          case 'softmax':
            drawSoftmax(cx, y0, y1, B, elapsed);
            break;
          case 'lm_head':
            drawLMHead(cx, y0, y1, B, elapsed);
            break;
        }

        ctx!.restore();

        // Residual stream line through block centre
        const shimmer = 0.04 + 0.08 * Math.sin(elapsed * 1.1 + l * 0.7);
        ctx!.strokeStyle = rgba(ACCENT, shimmer);
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(cx, y0 - margin + 3);
        ctx!.lineTo(cx, y1 + margin - 3);
        ctx!.stroke();

        ctx!.globalAlpha = 1;
      }

      /* Activation pulses travelling left → right across rails */
      if (archAlpha > 0) {
        for (let t = 0; t < N_TOK; t++) {
          const totalLen = LAYERS + 1;
          const tokPhase = (time * 0.6 + t * 0.25) % totalLen;
          const l0 = Math.floor(tokPhase);
          const frac = tokPhase - l0;

          const xA =
            l0 <= 0
              ? w * INPUT_X + 32
              : lx(Math.min(LAYERS - 1, l0 - 1)) + B / 2;
          const xB =
            l0 >= LAYERS
              ? w * OUTPUT_X - 32
              : lx(Math.min(LAYERS - 1, l0)) - B / 2;
          const x = xA + (xB - xA) * smoothstep(frac);
          const y = ty(t);

          const glow = 0.2 + 0.4 * gauss(frac - 0.5, 0.23);

          const g = ctx!.createRadialGradient(x, y, 0, x, y, 18);
          g.addColorStop(0, rgba(ACCENT, 0.3 * glow * archAlpha));
          g.addColorStop(0.4, rgba(ACCENT, 0.08 * glow * archAlpha));
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx!.fillStyle = g;
          ctx!.beginPath();
          ctx!.arc(x, y, 18, 0, Math.PI * 2);
          ctx!.fill();

          ctx!.fillStyle = rgba(ACCENT, 0.7 * glow * archAlpha);
          ctx!.beginPath();
          ctx!.arc(x, y, 2.5 + 2.5 * glow, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      /* Output fan-in connections (last block → output column) */
      if (outAlpha > 0) {
        const outCenterY = h * 0.5;
        ctx!.setLineDash([3, 5]);
        for (let t = 0; t < N_TOK; t++) {
          const y0 = ty(t);
          const x0 = lx(LAYERS - 1) + B / 2;
          const x1 = w * OUTPUT_X - 40;
          ctx!.strokeStyle = rgba(ACCENT, 0.1 * outAlpha);
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(x0, y0);
          ctx!.quadraticCurveTo((x0 + x1) / 2, y0, x1, outCenterY);
          ctx!.stroke();
        }
        ctx!.setLineDash([]);
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [wiring]);

  /* ── Render ──────────────────────────────────────────── */
  return (
    <div className={`absolute inset-0 overflow-hidden ${className ?? ''}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ opacity: 0.92 }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 z-10 pointer-events-none select-none">

        {/* ── Name: center → left slide → fade out on tokenize ── */}
        <h1
          className="absolute whitespace-nowrap"
          style={{
            left: after('shift') ? `${INPUT_X * 100}%` : '50%',
            top: after('shift') ? '22%' : '46%',
            transform: `translate(-50%, -50%) translateY(${!showName && !after('shift') ? '24px' : '0px'})`,
            opacity: !showName ? 0 : after('tokenize') ? 0 : 1,
            transition:
              'left 1s ease-out, top 1s ease-out, transform 0.7s ease-out, opacity 0.7s ease-out',
          }}
        >
          <span
            className="bg-gradient-to-b from-white to-white/70 bg-clip-text font-semibold tracking-tight text-transparent leading-[1.1]"
            style={{
              fontSize: after('shift') ? '1.125rem' : 'clamp(2rem, 5vw, 3.5rem)',
              transition: 'font-size 1s ease-out',
            }}
          >
            {typedName}
          </span>
          {showName && !after('tokenize') && <span className="typing-cursor" />}
        </h1>

        {/* ── "tokens" column label ── */}
        <div
          className="absolute font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white/40"
          style={{
            left: `${INPUT_X * 100}%`,
            top: '20%',
            transform: 'translate(-50%, -50%)',
            opacity: after('tokenize') ? 1 : 0,
            transition: 'opacity 0.7s ease-out',
          }}
        >
          tokens
        </div>

        {/* ── Input token pills — stagger name tokens sequentially ── */}
        {INPUT_TOKENS.map((tok, i) => {
          const isSpecial = tok.startsWith('<');
          // Special tokens appear quickly; name tokens stagger to mimic tokenizer
          const delay = isSpecial
            ? Math.min(i, 1) * 60 + (i > 1 ? 900 : 0) // <PAD>,<BOS> first; <EOS> last
            : 200 + (i - 2) * 180;
          return (
            <div
              key={tok + i}
              className="absolute"
              style={{
                left: `${INPUT_X * 100}%`,
                top: `${tokenYFrac(i) * 100}%`,
                transform: `translate(-50%, -50%) scale(${after('tokenize') ? 1 : 0.75})`,
                opacity: after('tokenize') ? 1 : 0,
                transition: `all 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`,
              }}
            >
              <span
                className={`inline-block rounded border px-3 py-1.5 font-mono text-[0.8rem] ${
                  isSpecial
                    ? 'border-white/20 bg-white/[0.03] text-white/50'
                    : 'border-accent/35 bg-accent/6 text-accent shadow-[0_0_10px_rgba(54,181,160,0.16)]'
                }`}
              >
                {tok}
              </span>
            </div>
          );
        })}

        {/* ── "output" column label ── */}
        <div
          className="absolute font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white/40"
          style={{
            left: `${OUTPUT_X * 100}%`,
            top: '20%',
            transform: 'translate(-50%, -50%)',
            opacity: after('output') ? 1 : 0,
            transition: 'opacity 0.8s ease-out',
          }}
        >
          output
        </div>

        {/* ── Output token pills ── */}
        {OUTPUT_TOKENS.map((tok, i) => {
          const isSpecial = tok.startsWith('<');
          const delay = 180 + i * 130;
          return (
            <div
              key={`out-${tok}-${i}`}
              className="absolute"
              style={{
                left: `${OUTPUT_X * 100}%`,
                top: `${tokenYFrac(i) * 100}%`,
                transform: `translate(-50%, -50%) scale(${after('output') ? 1 : 0.85})`,
                opacity: after('output') ? 1 : 0,
                transition: `all 0.6s ease-out ${delay}ms`,
              }}
            >
              <span
                className={`inline-block rounded border px-3 py-1.5 font-mono text-[0.8rem] ${
                  isSpecial
                    ? 'border-white/20 bg-white/[0.03] text-white/50'
                    : 'border-accent/35 bg-accent/6 text-accent shadow-[0_0_10px_rgba(54,181,160,0.16)]'
                }`}
              >
                {isSpecial || !after('output') ? (
                  tok
                ) : (
                  <TypingEffect text={tok} speed={24} delay={delay} className="" />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
