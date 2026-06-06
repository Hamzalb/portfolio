'use client';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function SkillsGlobe() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const reduced    = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const hoveredRef = useRef(false);
  useEffect(() => { hoveredRef.current = hovered; }, [hovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const el: HTMLCanvasElement = canvas;
    const c:  CanvasRenderingContext2D = ctx;

    let animId: number;
    const COUNT   = 260;
    const PALETTE = ['#6366f1','#06b6d4','#818cf8','#22d3ee','#a78bfa','#38bdf8'];
    const pts = Array.from({ length: COUNT }, (_, i) => {
      const phi   = Math.acos(1 - (2 * (i + 0.5)) / COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      return {
        ox: Math.sin(phi) * Math.cos(theta),
        oy: Math.cos(phi),
        oz: Math.sin(phi) * Math.sin(theta),
        color: PALETTE[i % PALETTE.length],
        sz: 1.5 + (i % 3) * 0.5,
      };
    });

    const resize = () => {
      el.width  = el.offsetWidth  * window.devicePixelRatio;
      el.height = el.offsetHeight * window.devicePixelRatio;
      c.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    let rotY = 0, rotX = 0.18;

    function animate() {
      animId = requestAnimationFrame(animate);
      const w = el.offsetWidth, h = el.offsetHeight;
      c.clearRect(0, 0, w, h);

      if (!reduced) {
        rotY += hoveredRef.current ? 0.018 : 0.005;
        rotX = 0.18 + Math.sin(rotY * 0.3) * 0.06;
      }

      const cx = w / 2, cy = h / 2;
      const R   = Math.min(w, h) * 0.38;
      const foc = R * 2.8;
      const cY  = Math.cos(rotY), sY = Math.sin(rotY);
      const cX  = Math.cos(rotX), sX = Math.sin(rotX);

      const projected = pts.map(p => {
        const x1 = p.ox * cY - p.oz * sY;
        const z1 = p.ox * sY + p.oz * cY;
        const y2 = p.oy * cX - z1 * sX;
        const z2 = p.oy * sX + z1 * cX;
        const sc = foc / (foc + z2 * R);
        return { sx: cx + x1 * R * sc, sy: cy + y2 * R * sc, z: z2, sc, color: p.color, sz: p.sz * sc };
      });
      projected.sort((a, b) => a.z - b.z);

      // Latitude wireframe rings
      c.save(); c.globalAlpha = 0.08;
      for (let lat = 0; lat < 7; lat++) {
        const phi  = (lat / 6) * Math.PI;
        const latR = Math.sin(phi) * R;
        const latY = cy + Math.cos(phi) * R * cX;
        c.beginPath();
        c.ellipse(cx, latY, latR, latR * Math.abs(sX), 0, 0, Math.PI * 2);
        c.strokeStyle = '#6366f1';
        c.lineWidth = 0.8;
        c.stroke();
      }
      c.restore();

      projected.forEach(p => {
        const alpha = Math.max(0.12, (p.z + 1) / 2) * (hoveredRef.current ? 1.0 : 0.85);
        const grd = c.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, p.sz * 3.5);
        grd.addColorStop(0, p.color + Math.round(alpha * 150).toString(16).padStart(2,'0'));
        grd.addColorStop(1, p.color + '00');
        c.beginPath(); c.arc(p.sx, p.sy, p.sz * 3.5, 0, Math.PI * 2);
        c.fillStyle = grd; c.globalAlpha = 1; c.fill();
        c.beginPath(); c.arc(p.sx, p.sy, Math.max(0.5, p.sz), 0, Math.PI * 2);
        c.fillStyle = p.color; c.globalAlpha = alpha; c.fill();
      });

      // Pulsing core
      const coreR = R * 0.12 * (1 + Math.sin(rotY * 3) * 0.08);
      const cGrd = c.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2.2);
      cGrd.addColorStop(0, 'rgba(129,140,248,0.95)');
      cGrd.addColorStop(0.5, 'rgba(99,102,241,0.4)');
      cGrd.addColorStop(1,   'rgba(99,102,241,0)');
      c.beginPath(); c.arc(cx, cy, coreR * 2.2, 0, Math.PI * 2);
      c.fillStyle = cGrd; c.globalAlpha = 1; c.fill();
      c.beginPath(); c.arc(cx, cy, coreR * 0.5, 0, Math.PI * 2);
      c.fillStyle = '#c7d2fe'; c.globalAlpha = 0.95; c.fill();
      c.globalAlpha = 1;
    }
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [reduced]);

  return (
    <div
      className="w-full h-full"
      aria-hidden="true"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        minHeight: 200, cursor: 'pointer',
        transition: 'filter 0.4s',
        filter: hovered ? 'drop-shadow(0 0 22px rgba(99,102,241,0.5))' : 'none',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}
