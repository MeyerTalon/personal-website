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

const LAYERS = 6;
const NAME_TEXT = 'talon meyer.';

// We keep the model internals at a fixed number of token slots
// so the left \"input\" column and right \"output\" column line up.
const TOKEN_SLOTS = 8;

const INPUT_TOKENS: string[] = [
  '<PAD>',
  '<BOS>',
  'talon',
  'meyer.',
  '<EOS>',
  '<PAD>',
  '<PAD>',
  '<PAD>',
];

const OUTPUT_TOKENS: string[] = [
  '<BOS>',
  'machine',
  'learning',
  'engineer',
  '&',
  'full-stack',
  'developer.',
  '<EOS>',
];

const N_TOK: number = TOKEN_SLOTS;
const HEADS = 4;
// Global animation speed scalar (lower = slower, more relaxed)
const SPEED = 0.2;
const MAX_DPR = 2;
const TYPE_SPEED = 75; // ms per character

// Layout (fractions of container)
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
const T_OUTPUT = 7500;
const T_IDLE = 10000;

const PHASES: LLMPhase[] = [
  'intro',
  'shift',
  'tokenize',
  'process',
  'output',
  'idle',
];

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
  if (N_TOK === 1) return (TOK_T + TOK_B) / 2;
  return TOK_T + ((TOK_B - TOK_T) * i) / (N_TOK - 1);
}

function quadCurve(
  ctx: CanvasRenderingContext2D,
  a: Point,
  b: Point,
  bend: number,
) {
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

    // Reveal container and start typing
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

    function draw(now: number) {
      if (!t0Ref.current) t0Ref.current = now;
      const elapsed = (now - t0Ref.current) / 1000;
      const time = elapsed * SPEED;

      ctx!.clearRect(0, 0, w, h);

      // Phase-based alphas
      const tokSec = T_TOKENIZE / 1000;
      const procSec = T_PROCESS / 1000;
      const outSec = T_OUTPUT / 1000;

      const railAlpha = smoothstep(clamp01((elapsed - tokSec + 0.3) / 1.2));
      const archAlpha = smoothstep(clamp01((elapsed - procSec) / 1.5));
      const outAlpha = smoothstep(clamp01((elapsed - outSec) / 1.0));
      const layerProgress = clamp01(
        (elapsed - procSec) / (outSec - procSec),
      );

      const B = bw();

      /* ── Background glow ── */
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

      /* ── Token rails ── */
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

      /* ── Input connections (dashed) ── */
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

      /* ── Embed label ── */
      if (railAlpha > 0) {
        ctx!.save();
        ctx!.globalAlpha = railAlpha * 0.8;
        ctx!.font = '9px "JetBrains Mono", monospace';
        ctx!.textAlign = 'center';
        ctx!.fillStyle = rgba(NEUTRAL, 0.2);
        const ex = (w * INPUT_X + 32 + lx(0) - B / 2) / 2;
        ctx!.fillText('embed', ex, (h * (TOK_T + TOK_B)) / 2 - 18);
        ctx!.restore();
      }

      /* ── Flow arrows between layers ── */
      if (archAlpha > 0) {
        const midY = (h * (TOK_T + TOK_B)) / 2;
        for (let l = 0; l < LAYERS - 1; l++) {
          const lr =
            smoothstep(clamp01((layerProgress * LAYERS - l - 0.5) * 1.5)) *
            archAlpha;
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

      /* ── Layer blocks ── */
      for (let l = 0; l < LAYERS; l++) {
        const lr =
          smoothstep(clamp01((layerProgress * LAYERS - l) * 1.5)) * archAlpha;
        if (lr <= 0) continue;

        const cx = lx(l);
        const y0 = ty(0);
        const y1 = ty(N_TOK - 1);
        const height = y1 - y0;
        const margin = Math.max(height * 0.22, 22);

        ctx!.globalAlpha = lr;

        // Block outline + fill
        ctx!.strokeStyle = rgba(NEUTRAL, 0.07);
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.roundRect(
          cx - B / 2,
          y0 - margin,
          B,
          height + margin * 2,
          8,
        );
        ctx!.stroke();
        ctx!.fillStyle = rgba(ACCENT, 0.006);
        ctx!.fill();

        // Internal divider (attn | ffn)
        ctx!.strokeStyle = rgba(NEUTRAL, 0.04);
        ctx!.beginPath();
        ctx!.moveTo(cx + B * 0.05, y0 - margin + 6);
        ctx!.lineTo(cx + B * 0.05, y1 + margin - 6);
        ctx!.stroke();

        // Layer label
        // Leftmost = encoder, rightmost = decoder, middle = L1–L4.
        ctx!.font = '10px "JetBrains Mono", monospace';
        ctx!.textAlign = 'center';
        ctx!.fillStyle = rgba(NEUTRAL, 0.22);
        let label: string;
        if (l === 0) {
          label = 'encoder';
        } else if (l === LAYERS - 1) {
          label = 'decoder';
        } else {
          label = `L${l}`;
        }
        ctx!.fillText(label, cx, y0 - margin - 8);

        // Sub-labels
        ctx!.font = '8px "JetBrains Mono", monospace';
        ctx!.fillStyle = rgba(NEUTRAL, 0.13);
        ctx!.fillText('attn', cx - B * 0.18, y1 + margin + 14);
        ctx!.fillText('ffn', cx + B * 0.25, y1 + margin + 14);

        // ── Attention curves ──
        // Slightly slower local clock so motion feels calmer.
        const local = (time * 0.55 + l * 0.28) % 1;
        const attnGate = smoothstep(
          1 - Math.abs(local - 0.3) / 0.22,
        );

        for (let hi = 0; hi < HEADS; hi++) {
          const edges = wiring[l][hi];
          // Each head sweeps its focus forward, but more slowly.
          const headOsc =
            (time * (0.55 + 0.08 * hi) + l * 0.19 + hi * 0.33) % 1;

          // Base lattice
          for (const edge of edges) {
            const dy = ty(edge.to) - ty(edge.from);
            const bend =
              Math.abs(dy) < 1
                ? 22 * (hi % 2 === 0 ? 1 : -1)
                : dy * 0.35;
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

          // Highlighted edges
          const ctr = Math.floor(headOsc * edges.length);
          const win = Math.max(2, Math.floor(edges.length * 0.2));
          for (let k = -win; k <= win; k++) {
            const idx = (ctr + k + edges.length) % edges.length;
            const edge = edges[idx];
            const dist = Math.abs(k) / (win + 1);
            const hi2 =
              (1 - dist) * attnGate * (0.25 + 0.75 * edge.w);
            if (hi2 < 0.01) continue;
            const dy = ty(edge.to) - ty(edge.from);
            const bend =
              Math.abs(dy) < 1
                ? 22 * (hi % 2 === 0 ? 1 : -1)
                : dy * 0.35;
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
        }

        // ── FFN glows ──
        const mlpGate = smoothstep(
          1 - Math.abs(local - 0.72) / 0.22,
        );
        for (let t = 0; t < N_TOK; t++) {
          const px = cx + B * 0.25;
          const py = ty(t);
          const jit =
            0.85 + 0.15 * Math.sin((t + 1) * 1.7 + l * 0.6);
          const mlp = mlpGate * jit;

          // Node dot
          ctx!.fillStyle = rgba(NEUTRAL, 0.14);
          ctx!.beginPath();
          ctx!.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx!.fill();

          if (mlp > 0.02) {
            const r = 10 + 26 * mlp;
            const g = ctx!.createRadialGradient(px, py, 0, px, py, r);
            g.addColorStop(0, rgba(ACCENT, 0.12 + 0.2 * mlp));
            g.addColorStop(0.5, rgba(ACCENT, 0.04 + 0.08 * mlp));
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx!.fillStyle = g;
            ctx!.beginPath();
            ctx!.arc(px, py, r, 0, Math.PI * 2);
            ctx!.fill();

            ctx!.fillStyle = rgba(ACCENT, 0.2 + 0.4 * mlp);
            ctx!.beginPath();
            ctx!.arc(px, py, 2 + 3 * mlp, 0, Math.PI * 2);
            ctx!.fill();
          }

          // Attention merge dot
          const attn =
            attnGate * (0.9 + 0.1 * Math.cos(t * 1.1 + l));
          if (attn > 0.02) {
            ctx!.fillStyle = rgba(ACCENT, 0.08 + 0.15 * attn);
            ctx!.beginPath();
            ctx!.arc(
              cx - B * 0.12,
              py,
              1.5 + 2 * attn,
              0,
              Math.PI * 2,
            );
            ctx!.fill();
          }
        }

        // Residual shimmer
        const addGlow = 0.04 + 0.1 * (attnGate + mlpGate);
        ctx!.strokeStyle = rgba(ACCENT, addGlow);
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(cx, y0 - margin + 3);
        ctx!.lineTo(cx, y1 + margin - 3);
        ctx!.stroke();

        ctx!.globalAlpha = 1;
      }

      /* ── Activation pulses (left → right, repeated) ── */
      if (archAlpha > 0) {
        for (let t = 0; t < N_TOK; t++) {
          const totalLen = LAYERS + 1;
          // Slower forward-only wave; tokens never travel backwards.
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
          g.addColorStop(
            0.4,
            rgba(ACCENT, 0.08 * glow * archAlpha),
          );
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

      /* ── Output connections (converging) ── */
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

        // lm_head label
        ctx!.save();
        ctx!.globalAlpha = outAlpha * 0.8;
        ctx!.font = '9px "JetBrains Mono", monospace';
        ctx!.textAlign = 'center';
        ctx!.fillStyle = rgba(NEUTRAL, 0.2);
        const hx = (lx(LAYERS - 1) + B / 2 + w * OUTPUT_X - 40) / 2;
        ctx!.fillText('lm_head', hx, outCenterY - 18);
        ctx!.restore();
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

      {/* DOM overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none select-none">
        {/* ── Name (center → left slide) ── */}
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
              fontSize: after('shift')
                ? '1.125rem'
                : 'clamp(2rem, 5vw, 3.5rem)',
              transition: 'font-size 1s ease-out',
            }}
          >
            {typedName}
          </span>
          {showName && !after('tokenize') && (
            <span className="typing-cursor" />
          )}
        </h1>

        {/* ── "tokens" label ── */}
        <div
          className="absolute font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white/40"
          style={{
            left: `${INPUT_X * 100}%`,
            top: '22%',
            transform: 'translate(-50%, -50%)',
            opacity: after('tokenize') ? 1 : 0,
            transition: 'opacity 0.7s ease-out',
          }}
        >
          tokens
        </div>

        {/* ── Token boxes ── */}
        {INPUT_TOKENS.map((tok, i) => {
          const isSpecial = tok.startsWith('<');
          return (
            <div
              key={tok}
              className="absolute"
              style={{
                left: `${INPUT_X * 100}%`,
                top: `${tokenYFrac(i) * 100}%`,
                transform: `translate(-50%, -50%) scale(${after('tokenize') ? 1 : 0.8})`,
                opacity: after('tokenize') ? 1 : 0,
                transition: `all 0.6s ease-out ${i * 100}ms`,
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

        {/* ── "output" label ── */}
        <div
          className="absolute font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white/40"
          style={{
            left: `${OUTPUT_X * 100}%`,
            top: '28%',
            transform: 'translate(-50%, -50%)',
            opacity: after('output') ? 1 : 0,
            transition: 'opacity 0.8s ease-out',
          }}
        >
          output
        </div>

        {/* ── Output tokens ── */}
        {OUTPUT_TOKENS.map((tok, i) => {
          const isSpecial = tok.startsWith('<');
          const delay = 220 + i * 110;
          return (
            <div
              key={`out-${tok}-${i}`}
              className="absolute"
              style={{
                left: `${OUTPUT_X * 100}%`,
                top: `${tokenYFrac(i) * 100}%`,
                transform: `translate(-50%, -50%) scale(${after('output') ? 1 : 0.9})`,
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
                  <TypingEffect
                    text={tok}
                    speed={22}
                    delay={delay}
                    className=""
                  />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
