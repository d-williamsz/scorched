import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

/* ── Scroll progress: begins slightly before track reaches viewport top,
      reaches 1 when fully scrolled through the extended track height ── */
function useScrollProgress(trackRef) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    function update() {
      const el = trackRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const scrollable  = height - window.innerHeight;
      // earlyOffset: start triggering this many px before track hits viewport top
      const earlyOffset = window.innerHeight * 0.35;
      setProgress(scrollable > 0 ? Math.max(0, Math.min(1, (-top + earlyOffset) / scrollable)) : 0);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, [trackRef]);
  return progress;
}

/* ── Viewport size (for canvas sizing on resize) ─────────────────────────── */
function useViewport() {
  const [vp, setVp] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    const fn = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return vp;
}

/* ═══════════════════════════════════════════════════════════════════════════
   APPROACH A — DRAWN
   Pre-defined SVG crack network. Each crack draws itself in via
   stroke-dashoffset with a staggered delay. The wider glow halo and
   bright core line create the illusion of molten rock beneath.
═══════════════════════════════════════════════════════════════════════════ */

// All paths in a 1000×600 coordinate space (preserveAspectRatio="slice")
const CRACK_DEFS = [
  // Primary arms — appear first
  { d: 'M500,295 L362,192 L228,118 L72,50',    delay: 0.00, w: 1.5 },
  { d: 'M500,295 L638,390 L788,462 L965,525',  delay: 0.02, w: 1.5 },
  { d: 'M500,295 L548,155 L603,62',             delay: 0.04, w: 1.3 },
  { d: 'M500,295 L432,424 L358,548',            delay: 0.06, w: 1.3 },
  // Secondary branches
  { d: 'M362,192 L295,150 L182,98',             delay: 0.12, w: 0.9 },
  { d: 'M228,118 L188,65 L118,38',              delay: 0.16, w: 0.8 },
  { d: 'M638,390 L708,308 L828,268 L948,236',   delay: 0.14, w: 0.9 },
  { d: 'M788,462 L848,528 L918,558 L994,572',   delay: 0.18, w: 0.8 },
  { d: 'M548,155 L658,138 L808,124 L948,108',   delay: 0.20, w: 0.8 },
  { d: 'M432,424 L495,506 L535,578',            delay: 0.24, w: 0.7 },
  // Tertiary detail
  { d: 'M295,150 L240,112 L148,82',             delay: 0.30, w: 0.55 },
  { d: 'M708,308 L752,242 L832,202',            delay: 0.32, w: 0.55 },
  { d: 'M362,192 L348,265 L308,330',            delay: 0.34, w: 0.55 },
  { d: 'M638,390 L595,458 L548,525 L502,585',   delay: 0.36, w: 0.55 },
  { d: 'M828,268 L862,198 L888,132',            delay: 0.38, w: 0.50 },
  { d: 'M358,548 L432,572 L515,592',            delay: 0.40, w: 0.50 },
  { d: 'M118,38 L52,18',                        delay: 0.42, w: 0.40 },
  { d: 'M948,236 L975,175 L996,148',            delay: 0.44, w: 0.40 },
  { d: 'M495,506 L572,518 L655,528',            delay: 0.47, w: 0.40 },
  { d: 'M148,82 L88,52',                        delay: 0.49, w: 0.35 },
  { d: 'M752,242 L796,182 L845,158',            delay: 0.51, w: 0.35 },
  { d: 'M658,138 L672,72 L714,44',              delay: 0.53, w: 0.35 },
  { d: 'M348,265 L282,278 L215,268',            delay: 0.56, w: 0.30 },
  { d: 'M548,525 L562,578',                     delay: 0.58, w: 0.30 },
  { d: 'M862,198 L915,158 L962,128',            delay: 0.60, w: 0.30 },
];

function SVGDrawn({ progress }) {
  const pathRefs = useRef([]);
  const [lengths, setLengths] = useState([]);

  useLayoutEffect(() => {
    setLengths(pathRefs.current.map(p => p?.getTotalLength() ?? 500));
  }, []);

  return (
    <svg
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      <defs>
        <filter id="svgCrackGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {CRACK_DEFS.map((c, i) => {
        const localP = c.delay >= 0.99
          ? 0
          : Math.max(0, Math.min(1, (progress - c.delay) / (1 - c.delay)));
        if (localP <= 0) return null;

        const len    = lengths[i] ?? 500;
        const offset = len * (1 - localP);
        const g      = Math.round(70 + localP * 120); // 70 → 190

        return (
          <g key={i}>
            {/* Wide soft glow halo */}
            <path
              d={c.d}
              stroke={`rgba(255,${(g * 0.55) | 0},0,${localP * 0.55})`}
              strokeWidth={c.w * 8}
              fill="none"
              strokeDasharray={len}
              strokeDashoffset={offset}
              strokeLinecap="round"
              filter="url(#svgCrackGlow)"
            />
            {/* Core bright line */}
            <path
              ref={el => { pathRefs.current[i] = el; }}
              d={c.d}
              stroke={`rgba(255,${g},${(localP * 25) | 0},${0.45 + localP * 0.55})`}
              strokeWidth={c.w}
              fill="none"
              strokeDasharray={len}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </g>
        );
      })}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   APPROACH B — FRACTAL
   Procedurally generated branching fracture network rendered to canvas.
   A deterministic xorshift RNG keeps the geometry stable. Scroll controls
   how many fracture depth-levels are visible; a rAF loop adds a subtle
   animated glow pulse across the revealed cracks.
═══════════════════════════════════════════════════════════════════════════ */

function buildFractalCracks(w, h) {
  const segs = [];
  let rng = 0xDEADBEEF;
  function rand() {
    rng ^= rng << 13; rng ^= rng >> 17; rng ^= rng << 5;
    return (rng >>> 0) / 0xFFFFFFFF;
  }

  function branch(x1, y1, angle, len, depth) {
    if (len < 7 || depth > 9) return;
    const a2 = angle + (rand() - 0.5) * 0.5;
    const x2 = x1 + Math.cos(a2) * len;
    const y2 = y1 + Math.sin(a2) * len;
    segs.push({ x1, y1, x2, y2, depth });
    if (rand() < 0.88)
      branch(x2, y2, a2 + (rand() - 0.5) * 0.28, len * (0.82 + rand() * 0.1), depth);
    if (rand() < 0.44 - depth * 0.035)
      branch(x2, y2, a2 + (rand() > 0.5 ? 1 : -1) * (0.5 + rand() * 0.75), len * (0.55 + rand() * 0.2), depth + 1);
    if (rand() < 0.12 - depth * 0.01)
      branch(x2, y2, a2 + (rand() > 0.5 ? 1 : -1) * (0.22 + rand() * 0.35), len * 0.68, depth + 1);
  }

  const cx = w * 0.5, cy = h * 0.5;
  const seeds = [
    [-Math.PI * 0.72, 70], [ Math.PI * 0.28, 70],
    [-Math.PI * 0.18, 58], [ Math.PI * 0.82, 58],
    [-Math.PI * 0.50, 52], [ Math.PI * 0.08, 52],
    [ Math.PI * 0.55, 46], [-Math.PI * 0.90, 46],
  ];
  for (const [ang, len] of seeds)
    branch(cx + (rand() - 0.5) * 90, cy + (rand() - 0.5) * 70, ang, len, 0);

  const maxDepth = Math.max(...segs.map(s => s.depth), 1);
  return { segs, maxDepth };
}

function CanvasFractal({ progress }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef({ segs: [], maxDepth: 1, progress: 0 });
  const { w, h }  = useViewport();

  useEffect(() => {
    const data = buildFractalCracks(w, h);
    stateRef.current.segs     = data.segs;
    stateRef.current.maxDepth = data.maxDepth;
  }, [w, h]);

  useEffect(() => { stateRef.current.progress = progress; }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    function draw(t) {
      const { segs, maxDepth, progress: p } = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!segs.length) { raf = requestAnimationFrame(draw); return; }

      const pulse       = 0.5 + 0.5 * Math.sin(t * 0.00115);
      const revealLevel = p * (maxDepth + 1);

      for (const seg of segs) {
        if (seg.depth >= revealLevel) continue;
        const df     = seg.depth / maxDepth;
        const reveal = Math.min(1, revealLevel - seg.depth);
        const bright = (1 - df * 0.52) * reveal;
        const glow   = bright * (0.6 + pulse * p * 0.4);
        const g      = 80 + Math.round((1 - df) * 100);

        // Glow pass
        ctx.save();
        ctx.shadowBlur  = (18 - df * 10) * bright;
        ctx.shadowColor = `rgba(255,${g},0,${glow})`;
        ctx.strokeStyle = `rgba(255,${g},0,${glow * 0.3})`;
        ctx.lineWidth   = Math.max(0.5, 2.5 - df * 2.0) * (1.5 + pulse * 0.4);
        ctx.lineCap     = 'round';
        ctx.beginPath(); ctx.moveTo(seg.x1, seg.y1); ctx.lineTo(seg.x2, seg.y2); ctx.stroke();
        ctx.restore();

        // Core pass
        ctx.save();
        ctx.strokeStyle = `rgba(255,${150 + Math.round((1 - df) * 100)},${Math.round((1 - df) * 35)},${glow})`;
        ctx.lineWidth   = Math.max(0.25, 0.85 - df * 0.45);
        ctx.lineCap     = 'round';
        ctx.beginPath(); ctx.moveTo(seg.x1, seg.y1); ctx.lineTo(seg.x2, seg.y2); ctx.stroke();
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [w, h]);

  return (
    <canvas
      ref={canvasRef} width={w} height={h}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   APPROACH C — EMBER
   Crack lines breathe with an animated glow; bright orb hotspots pulse at
   fracture nodes; ember particles rise from the cracks as scroll deepens.
   More atmospheric and cinematic than the other two approaches.
═══════════════════════════════════════════════════════════════════════════ */

// Crack polylines as [x, y] fractions of viewport
const EMBER_LINES = [
  [[.500,.490],[.370,.328],[.240,.197],[.080,.092]],
  [[.500,.490],[.630,.648],[.780,.758],[.965,.862]],
  [[.500,.490],[.548,.258],[.603,.103]],
  [[.500,.490],[.432,.705],[.358,.913]],
  [[.370,.328],[.295,.250],[.182,.163]],
  [[.630,.648],[.708,.513],[.828,.447],[.948,.393]],
  [[.548,.258],[.658,.230],[.808,.207],[.948,.180]],
  [[.432,.705],[.495,.843],[.535,.963]],
];

const EMBER_NODES = [
  [.500,.490],[.370,.328],[.240,.197],[.630,.648],
  [.548,.258],[.432,.705],[.780,.758],[.828,.447],
  [.295,.250],[.708,.513],
];

function CanvasEmber({ progress }) {
  const canvasRef = useRef(null);
  const pRef      = useRef(progress);
  const { w, h }  = useViewport();

  useEffect(() => { pRef.current = progress; }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const lines = EMBER_LINES.map(l => l.map(([rx, ry]) => [rx * w, ry * h]));
    const nodes = EMBER_NODES.map(([rx, ry], i) => ({
      x: rx * w, y: ry * h, phase: i * 0.68,
    }));

    const pts = [];
    function spawnParticle() {
      const line = lines[(Math.random() * lines.length) | 0];
      const si   = (Math.random() * (line.length - 1)) | 0;
      const t    = Math.random();
      pts.push({
        x:     line[si][0] + (line[si + 1][0] - line[si][0]) * t,
        y:     line[si][1] + (line[si + 1][1] - line[si][1]) * t,
        vx:    (Math.random() - 0.5) * 0.55,
        vy:    -(0.4 + Math.random() * 1.1),
        life:  1,
        decay: 0.007 + Math.random() * 0.013,
        size:  0.8 + Math.random() * 2.2,
      });
    }

    let raf;
    function draw(t) {
      const p = pRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (p < 0.01) { raf = requestAnimationFrame(draw); return; }

      const breathe     = 0.5 + 0.5 * Math.sin(t * 0.0013);
      const fastBreathe = 0.5 + 0.5 * Math.sin(t * 0.0028);

      // ── Crack lines
      lines.forEach((line, ci) => {
        const lp = Math.max(0, Math.min(1, (p - ci * 0.07) / 0.6));
        if (lp <= 0) return;
        const alpha = lp * (0.35 + breathe * 0.22);

        for (let i = 0; i < line.length - 1; i++) {
          const [x1, y1] = line[i], [x2, y2] = line[i + 1];

          ctx.save();
          ctx.shadowBlur  = 14 + breathe * 10;
          ctx.shadowColor = `rgba(255,70,0,${alpha * 0.9})`;
          ctx.strokeStyle = `rgba(255,100,0,${alpha * 0.28})`;
          ctx.lineWidth   = 6 + breathe * 2;
          ctx.lineCap     = 'round';
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          ctx.restore();

          ctx.save();
          ctx.strokeStyle = `rgba(255,210,75,${alpha * (0.75 + fastBreathe * 0.25)})`;
          ctx.lineWidth   = 0.75;
          ctx.lineCap     = 'round';
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          ctx.restore();
        }
      });

      // ── Hotspot orbs at fracture nodes
      nodes.forEach((nd, ni) => {
        const lp = Math.max(0, Math.min(1, (p - ni * 0.042) / 0.65));
        if (lp <= 0) return;
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.002 + nd.phase);
        const r     = (3 + pulse * 5.5) * lp;
        const alpha = lp * (0.55 + pulse * 0.45);

        const grad = ctx.createRadialGradient(nd.x, nd.y, 0, nd.x, nd.y, r * 4.5);
        grad.addColorStop(0,    `rgba(255,235,120,${alpha})`);
        grad.addColorStop(0.22, `rgba(255,105,10,${alpha * 0.85})`);
        grad.addColorStop(1,    'rgba(255,40,0,0)');

        ctx.save();
        ctx.shadowBlur  = 20 * lp;
        ctx.shadowColor = `rgba(255,95,0,${alpha * 0.9})`;
        ctx.fillStyle   = grad;
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, r * 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // ── Rising ember particles
      if (p > 0.15 && pts.length < 100 * p && Math.random() < p * 0.45)
        spawnParticle();

      for (let i = pts.length - 1; i >= 0; i--) {
        const pt = pts[i];
        pt.life -= pt.decay;
        pt.x    += pt.vx;
        pt.y    += pt.vy;
        pt.vy   -= 0.009;
        if (pt.life <= 0) { pts.splice(i, 1); continue; }

        const a = pt.life * p * 0.88;
        const s = pt.size * pt.life;

        ctx.save();
        ctx.shadowBlur  = 8;
        ctx.shadowColor = `rgba(255,95,0,${a})`;
        ctx.fillStyle   = `rgba(255,${148 + Math.round(pt.life * 107)},0,${a})`;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, s, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [w, h]);

  return (
    <canvas
      ref={canvasRef} width={w} height={h}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Wrapper export — Drawn style only
═══════════════════════════════════════════════════════════════════════════ */

export function HeroBackground({ children }) {
  const trackRef = useRef(null);
  const progress = useScrollProgress(trackRef);

  return (
    <section
      id="hero"
      ref={trackRef}
      className="hero-scroll-track"
      aria-label="Scorched Animation hero"
    >
      <div className="hero-sticky">
        <div className="hero-bg-base" />
        <SVGDrawn progress={progress} />
        {children}
      </div>
    </section>
  );
}
