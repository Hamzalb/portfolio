'use client';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/* ─────────────────────────────────────────────────────────────
   MATH HELPERS
───────────────────────────────────────────────────────────── */
const PHI = (1 + Math.sqrt(5)) / 2;

/** Build unit-sphere icosahedron (12 verts, 30 edges) */
function buildIcosahedron(scale: number) {
  const n = Math.sqrt(1 + PHI * PHI);
  const v: [number, number, number][] = [
    [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
    [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
    [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
  ].map(([x, y, z]) => [(x / n) * scale, (y / n) * scale, (z / n) * scale] as [number,number,number]);

  const edges: [number, number][] = [];
  for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) {
    const dx = v[i][0]-v[j][0], dy = v[i][1]-v[j][1], dz = v[i][2]-v[j][2];
    if (Math.sqrt(dx*dx+dy*dy+dz*dz) < scale * 1.05) edges.push([i, j]);
  }
  return { verts: v, edges };
}

type Vec3 = [number, number, number];

function rotY(v: Vec3, a: number): Vec3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [v[0]*c + v[2]*s, v[1], -v[0]*s + v[2]*c];
}
function rotX(v: Vec3, a: number): Vec3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [v[0], v[1]*c - v[2]*s, v[1]*s + v[2]*c];
}
function rotZ(v: Vec3, a: number): Vec3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [v[0]*c - v[1]*s, v[0]*s + v[1]*c, v[2]];
}

function project(v: Vec3, cx: number, cy: number, fov: number, scale: number) {
  const pz = v[2] + fov;
  const f  = fov / Math.max(pz, 0.01);
  return { sx: cx + v[0] * scale * f, sy: cy - v[1] * scale * f, depth: v[2] };
}

/* ─────────────────────────────────────────────────────────────
   STATIC GEOMETRY (built once outside component)
───────────────────────────────────────────────────────────── */
const ICO_OUTER = buildIcosahedron(1.0);   // normalized scale=1, scaled in draw
const ICO_INNER = buildIcosahedron(0.55);

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced   = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const el: HTMLCanvasElement = canvas;
    const c: CanvasRenderingContext2D = ctx;

    /* ── Mouse parallax ── */
    let mouseX = 0, mouseY = 0;
    let targetMX = 0, targetMY = 0;
    const onMouse = (e: MouseEvent) => {
      targetMX = (e.clientX / window.innerWidth  - 0.5) * 2;
      targetMY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onTouch = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      targetMX = (e.touches[0].clientX / window.innerWidth  - 0.5) * 2;
      targetMY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });

    /* ── Resize ── */
    const resize = () => {
      el.width  = el.offsetWidth  * Math.min(window.devicePixelRatio, 2);
      el.height = el.offsetHeight * Math.min(window.devicePixelRatio, 2);
      c.setTransform(Math.min(window.devicePixelRatio, 2), 0, 0,
                     Math.min(window.devicePixelRatio, 2), 0, 0);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    /* ── Stars ── */
    const STARS = Array.from({ length: 700 }, () => {
      const phi = Math.acos(2 * Math.random() - 1);
      const th  = Math.random() * Math.PI * 2;
      const r   = 60 + Math.random() * 80;
      return {
        x: r * Math.sin(phi) * Math.cos(th),
        y: r * Math.cos(phi),
        z: r * Math.sin(phi) * Math.sin(th),
        size: 0.4 + Math.random() * 1.1,
        bright: 0.3 + Math.random() * 0.5,
      };
    });

    /* ── Constellation particles ── */
    const PART_COUNT = 70;
    const parts = Array.from({ length: PART_COUNT }, () => ({
      x: (Math.random() - 0.5) * 28,
      y: (Math.random() - 0.5) * 18,
      z: (Math.random() - 0.5) * 18,
      vx: (Math.random() - 0.5) * 0.012,
      vy: (Math.random() - 0.5) * 0.012,
      vz: (Math.random() - 0.5) * 0.008,
      hue: Math.random() < 0.5 ? 240 : 192,   // indigo or cyan
      size: 1.2 + Math.random() * 1.6,
    }));

    /* ── Glowing orbs ── */
    const ORBS = [
      { ox: -0.70, oy:  0.30, r: 38, color: '99,102,241',  phase: 0.0 },
      { ox:  0.75, oy: -0.20, r: 28, color: '6,182,212',   phase: 1.2 },
      { ox:  0.22, oy:  0.55, r: 18, color: '167,139,250', phase: 2.4 },
      { ox: -0.45, oy: -0.40, r: 14, color: '34,211,238',  phase: 3.6 },
      { ox:  0.05, oy: -0.60, r: 12, color: '129,140,248', phase: 0.8 },
    ];

    /* ── Perspective grid constants ── */
    const GRID_COLS = 14;
    const GRID_ROWS = 10;
    const CONNECT_DIST = 8; // units — constellation link distance

    let animId: number;
    let t = 0;

    function drawGlow(
      x: number, y: number, r: number, r1: number, r2: number,
      col: string, alpha: number
    ) {
      const g = c.createRadialGradient(x, y, r1, x, y, r2);
      g.addColorStop(0, `rgba(${col},${alpha})`);
      g.addColorStop(0.45, `rgba(${col},${(alpha * 0.35).toFixed(3)})`);
      g.addColorStop(1, `rgba(${col},0)`);
      c.beginPath();
      c.arc(x, y, r2, 0, Math.PI * 2);
      c.fillStyle = g;
      c.fill();
      // Hard core
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fillStyle = `rgba(${col},${(alpha * 1.6).toFixed(3)})`;
      c.fill();
    }

    function animate() {
      animId = requestAnimationFrame(animate);
      if (!reduced) t += 0.007;

      /* Smooth mouse lag */
      mouseX += (targetMX - mouseX) * 0.04;
      mouseY += (targetMY - mouseY) * 0.04;

      const W = el.offsetWidth, H = el.offsetHeight;
      c.clearRect(0, 0, W, H);

      const cx = W / 2, cy = H / 2;
      const S  = Math.min(W, H);           // base scale
      const fov = S * 0.85;

      /* Camera tilt from mouse */
      const camRY = mouseX *  0.18 + t * 0.15;
      const camRX = mouseY * -0.12 + t * 0.08;

      /* ───── 1. STARS ───── */
      c.save();
      STARS.forEach(s => {
        let v: Vec3 = [s.x, s.y, s.z];
        v = rotY(v, t * 0.05 + mouseX * 0.1);
        v = rotX(v, mouseY * -0.05);
        const p = project(v, cx, cy, fov, 1);
        if (p.depth < -fov + 1) return;
        const a   = Math.max(0, Math.min(s.bright, (p.depth + 80) / 160 * s.bright));
        const sz  = Math.max(0.2, s.size * (fov / (p.depth + fov)));
        c.beginPath();
        c.arc(p.sx, p.sy, sz, 0, Math.PI * 2);
        c.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
        c.fill();
      });
      c.restore();

      /* ───── 2. PERSPECTIVE GRID ───── */
      c.save();
      c.globalAlpha = 0.07;
      const gY = cy + H * 0.28;          // horizon Y
      const gW = W  * 1.6;
      const gH = H  * 0.55;
      const vpX = cx + mouseX * 40;      // vanishing point drifts with mouse

      for (let col = 0; col <= GRID_COLS; col++) {
        const frac = col / GRID_COLS;
        const bx = vpX - gW / 2 + frac * gW;
        c.beginPath();
        c.moveTo(vpX, gY);
        c.lineTo(bx, gY + gH);
        const grad = c.createLinearGradient(vpX, gY, bx, gY + gH);
        grad.addColorStop(0, 'rgba(99,102,241,0)');
        grad.addColorStop(0.4, 'rgba(99,102,241,0.6)');
        grad.addColorStop(1, 'rgba(6,182,212,0.3)');
        c.strokeStyle = grad;
        c.lineWidth = 0.6;
        c.stroke();
      }
      for (let row = 1; row <= GRID_ROWS; row++) {
        const frac = row / GRID_ROWS;
        const fy   = gY + frac * gH;
        const perspective = 1 - frac * 0.85;
        const x0 = vpX - (gW / 2) * (1 - perspective + frac);
        const x1 = vpX + (gW / 2) * (1 - perspective + frac);
        const grad = c.createLinearGradient(x0, fy, x1, fy);
        grad.addColorStop(0,   'rgba(6,182,212,0)');
        grad.addColorStop(0.3, 'rgba(99,102,241,0.5)');
        grad.addColorStop(0.7, 'rgba(99,102,241,0.5)');
        grad.addColorStop(1,   'rgba(6,182,212,0)');
        c.beginPath();
        c.moveTo(x0, fy);
        c.lineTo(x1, fy);
        c.strokeStyle = grad;
        c.lineWidth = 0.5;
        c.stroke();
      }
      // Horizon glow line
      const hGrad = c.createLinearGradient(cx - W*0.5, gY, cx + W*0.5, gY);
      hGrad.addColorStop(0, 'rgba(6,182,212,0)');
      hGrad.addColorStop(0.4, 'rgba(99,102,241,0.6)');
      hGrad.addColorStop(0.6, 'rgba(6,182,212,0.6)');
      hGrad.addColorStop(1, 'rgba(6,182,212,0)');
      c.beginPath();
      c.moveTo(cx - W*0.5, gY);
      c.lineTo(cx + W*0.5, gY);
      c.strokeStyle = hGrad;
      c.lineWidth = 1.5;
      c.globalAlpha = 0.5;
      c.stroke();
      c.restore();

      /* ───── 3. OUTER ICOSAHEDRON ───── */
      const icoS = S * 0.30;
      const rY1  = t * 0.55 + camRY;
      const rX1  = t * 0.30 + camRX;
      const rZ1  = t * 0.18;

      const pv1 = ICO_OUTER.verts.map(v => {
        let p: Vec3 = [v[0]*icoS, v[1]*icoS, v[2]*icoS];
        p = rotZ(p, rZ1); p = rotX(p, rX1); p = rotY(p, rY1);
        return project(p, cx, cy, fov, 1);
      });

      ICO_OUTER.edges.forEach(([a, b]) => {
        const pa = pv1[a], pb = pv1[b];
        const z  = (pa.depth + pb.depth) / 2;
        const alpha = Math.max(0.04, Math.min(0.5, (z + 1.2) * 0.28));
        const grad = c.createLinearGradient(pa.sx, pa.sy, pb.sx, pb.sy);
        grad.addColorStop(0, `rgba(99,102,241,${alpha})`);
        grad.addColorStop(1, `rgba(6,182,212,${alpha})`);
        c.beginPath();
        c.moveTo(pa.sx, pa.sy);
        c.lineTo(pb.sx, pb.sy);
        c.strokeStyle = grad;
        c.lineWidth = 1.0;
        c.stroke();
      });

      // Vertex glows
      pv1.forEach(p => {
        const a = Math.max(0.05, (p.depth + 1.2) * 0.3);
        drawGlow(p.sx, p.sy, 1.8, 0, 10, '129,140,248', a * 0.7);
      });

      /* ───── 4. INNER ICOSAHEDRON (counter-rotate) ───── */
      const icoS2 = S * 0.16;
      const pv2   = ICO_INNER.verts.map(v => {
        let p: Vec3 = [v[0]*icoS2, v[1]*icoS2, v[2]*icoS2];
        p = rotZ(p, -rZ1*1.4); p = rotX(p, -rX1*0.9); p = rotY(p, -rY1*1.1);
        return project(p, cx, cy, fov, 1);
      });

      ICO_INNER.edges.forEach(([a, b]) => {
        const pa = pv2[a], pb = pv2[b];
        const z  = (pa.depth + pb.depth) / 2;
        const alpha = Math.max(0.08, Math.min(0.7, (z + 0.65) * 0.55));
        const grad = c.createLinearGradient(pa.sx, pa.sy, pb.sx, pb.sy);
        grad.addColorStop(0, `rgba(6,182,212,${alpha})`);
        grad.addColorStop(1, `rgba(167,139,250,${alpha})`);
        c.beginPath();
        c.moveTo(pa.sx, pa.sy);
        c.lineTo(pb.sx, pb.sy);
        c.strokeStyle = grad;
        c.lineWidth = 1.4;
        c.stroke();
      });

      // Bright vertex dots
      pv2.forEach(p => {
        const a = Math.max(0.1, (p.depth + 0.65) * 0.6);
        drawGlow(p.sx, p.sy, 2.2, 0, 12, '6,182,212', a * 0.85);
      });

      /* ───── 5. CONSTELLATION PARTICLES ───── */
      // Update positions
      if (!reduced) {
        parts.forEach(p => {
          p.x += p.vx; p.y += p.vy; p.z += p.vz;
          // Soft boundary bounce
          if (Math.abs(p.x) > 14) p.vx *= -1;
          if (Math.abs(p.y) >  9) p.vy *= -1;
          if (Math.abs(p.z) >  9) p.vz *= -1;
        });
      }

      // Project particles
      const pp = parts.map(p => {
        let v: Vec3 = [p.x, p.y, p.z];
        v = rotY(v, camRY * 0.6);
        v = rotX(v, camRX * 0.6);
        const proj = project(v, cx, cy, fov, S / 40);
        return { ...proj, hue: p.hue, size: p.size, orig: p };
      });

      // Connections
      c.save();
      for (let i = 0; i < pp.length; i++) {
        for (let j = i + 1; j < pp.length; j++) {
          const dx = parts[i].x - parts[j].x;
          const dy = parts[i].y - parts[j].y;
          const dz = parts[i].z - parts[j].z;
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (dist > CONNECT_DIST) continue;
          const alpha = (1 - dist / CONNECT_DIST) * 0.35;
          const grad  = c.createLinearGradient(pp[i].sx, pp[i].sy, pp[j].sx, pp[j].sy);
          const col1  = pp[i].hue === 240 ? '99,102,241' : '6,182,212';
          const col2  = pp[j].hue === 240 ? '99,102,241' : '6,182,212';
          grad.addColorStop(0, `rgba(${col1},${alpha})`);
          grad.addColorStop(1, `rgba(${col2},${alpha})`);
          c.beginPath();
          c.moveTo(pp[i].sx, pp[i].sy);
          c.lineTo(pp[j].sx, pp[j].sy);
          c.strokeStyle = grad;
          c.lineWidth = 0.7;
          c.stroke();
        }
      }
      // Particle dots
      pp.forEach(p => {
        const col   = p.hue === 240 ? '99,102,241' : '6,182,212';
        const alpha = Math.max(0.2, Math.min(0.95, (p.depth / 14 + 1) * 0.6));
        const sz    = Math.max(0.6, p.size * (fov / (p.depth + fov + 10)));
        drawGlow(p.sx, p.sy, sz, 0, sz * 5, col, alpha * 0.55);
        c.beginPath();
        c.arc(p.sx, p.sy, sz, 0, Math.PI * 2);
        c.fillStyle = `rgba(${col},${alpha})`;
        c.fill();
      });
      c.restore();

      /* ───── 6. GLOWING ORBS ───── */
      ORBS.forEach(orb => {
        const pulse = 1 + Math.sin(t * 1.4 + orb.phase) * 0.12;
        const ox = cx + orb.ox * W * 0.42 + mouseX * 18;
        const oy = cy + orb.oy * H * 0.38 + mouseY * 12;
        const R  = orb.r * pulse;
        drawGlow(ox, oy, R * 0.22, 0, R * 2.8, orb.color, 0.42);
      });

      /* ───── 7. CENTER CORE PULSE ───── */
      const coreR = S * 0.028 * (1 + Math.sin(t * 2.2) * 0.12);
      drawGlow(cx, cy, coreR, 0, coreR * 4, '99,102,241', 0.55);
      drawGlow(cx, cy, coreR * 0.55, 0, coreR * 1.5, '200,200,255', 0.9);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('resize', resize);
    };
  }, [reduced]);

  return (
    <div
      className="absolute inset-0 z-0"
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
