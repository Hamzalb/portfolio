'use client';
/**
 * Whobee — chunky cartoon robot mascot, rendered in pure Canvas 2D.
 *
 * NO WebGL / Three.js / R3F — this machine (and many others) have WebGL
 * sandboxed, and R3F v8 also crashes under React 19. Canvas 2D works
 * everywhere and matches the rest of this project's 3D-without-WebGL approach.
 *
 * Behaviors (all from the original spec):
 *   • Idle float (vertical bob)         • Eyes track the cursor
 *   • Idle tilt (slow z-rock)           • Antenna tip pulses
 *   • Hover lean toward cursor          • Accent stripe pulses
 *   • Click → happy bounce (scaleY)     • Random LED blinks (3–5 s)
 *   • Mouth segments curve with mouse X
 */

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// ─── Palette ─────────────────────────────────────────────────────────────────
const C = {
  bodyLight: '#2a2a4e',
  body:      '#1a1a2e',
  bodyDark:  '#0d0d18',
  edge:      '#0f3460',
  dark:      '#05050a',
  iris:      '#00d4ff',
  antenna:   '#ff3838',
  accent:    '#e94560',
  ledCyan:   '#22d3ee',
  ledRed:    '#ff4d4d',
  mGreen:    '#00ff88',
  mRed:      '#ff3030',
  white:     '#ffffff',
};

// Rounded-rectangle path helper (manual — avoids ctx.roundRect support gaps)
function rr(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rad = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + rad, y);
  c.arcTo(x + w, y,     x + w, y + h, rad);
  c.arcTo(x + w, y + h, x,     y + h, rad);
  c.arcTo(x,     y + h, x,     y,     rad);
  c.arcTo(x,     y,     x + w, y,     rad);
  c.closePath();
}

export default function Whobee() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced   = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const el: HTMLCanvasElement = canvas;
    const c: CanvasRenderingContext2D = ctx;

    // ── Pointer state (relative to canvas centre, range ~ -1..1) ──────────────
    let px = 0, py = 0;          // smoothed
    let tx = 0, ty = 0;          // target
    let hovering = false;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      tx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      ty = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
      hovering =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top  && e.clientY <= rect.bottom;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    // ── Click → bounce ────────────────────────────────────────────────────────
    let bounceStart = -1;
    const onClick = () => { bounceStart = performance.now(); };
    el.addEventListener('click', onClick);

    // ── LED blink schedules (chest 4 + mouth 5) ───────────────────────────────
    const mkLed = () => ({ next: 2000 + Math.random() * 3000, until: 0 });
    const chestLeds = [mkLed(), mkLed(), mkLed(), mkLed()];
    const mouthLeds = [mkLed(), mkLed(), mkLed(), mkLed(), mkLed()];

    // ── Resize (DPR-aware) ─────────────────────────────────────────────────────
    let W = 0, H = 0;
    const resize = () => {
      const rect = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      el.width  = Math.max(1, Math.floor(W * dpr));
      el.height = Math.max(1, Math.floor(H * dpr));
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Draw helpers ──────────────────────────────────────────────────────────
    const glowDot = (x: number, y: number, r: number, color: string, intensity: number) => {
      c.save();
      c.shadowBlur = 18 * intensity;
      c.shadowColor = color;
      const g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = g;
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fill();
      // solid core
      c.shadowBlur = 0;
      c.fillStyle = color;
      c.globalAlpha = 0.9;
      c.beginPath();
      c.arc(x, y, r * 0.55, 0, Math.PI * 2);
      c.fill();
      c.restore();
    };

    // ── Animation loop ─────────────────────────────────────────────────────────
    let raf = 0;
    const t0 = performance.now();

    const frame = (now: number) => {
      const t = reduced ? 0 : (now - t0) / 1000;

      // Smooth pointer
      px += (tx - px) * 0.08;
      py += (ty - py) * 0.08;

      c.clearRect(0, 0, W, H);

      // Robot visual bounds in local units (antenna-glow top → torso-halo bottom)
      const VTOP = -292, VBOT = 210;
      const vCenter = (VTOP + VBOT) / 2;            // ≈ -41 (robot is top-heavy)
      // Fit to canvas with padding; 360 wide, ~560 tall envelope
      const scale = Math.min(W / 360, H / 560);
      const cx = W / 2;
      const cy = H / 2;

      // Global transforms
      const floatY = reduced ? 0 : Math.sin(t * 1.1) * 8;
      const tilt   = reduced ? 0 : Math.sin(t * 0.8) * (2 * Math.PI / 180);
      const lean   = hovering ? px * (3 * Math.PI / 180) : 0;

      // Click bounce → scaleY 1 → 1.08 → 1 over 300 ms
      let scaleY = 1;
      if (bounceStart > 0) {
        const e = now - bounceStart;
        if (e < 300) scaleY = 1 + Math.sin((e / 300) * Math.PI) * 0.08;
        else bounceStart = -1;
      }

      c.save();
      // Shift so the robot's visual centre aligns with the canvas centre
      c.translate(cx, cy - vCenter * scale + floatY);
      c.rotate(tilt + lean);
      c.scale(scale, scale * scaleY);

      /* ═══════════════════ TORSO ═══════════════════ */
      c.save();
      c.translate(0, 120);
      // edge halo
      c.fillStyle = C.edge;
      rr(c, -106, -82, 212, 168, 30); c.fill();
      // body with metallic gradient
      const tg = c.createLinearGradient(-100, -78, 100, 80);
      tg.addColorStop(0, C.bodyLight);
      tg.addColorStop(0.5, C.body);
      tg.addColorStop(1, C.bodyDark);
      c.fillStyle = tg;
      rr(c, -100, -78, 200, 156, 26); c.fill();

      // side grip panels
      c.fillStyle = C.edge;
      rr(c, -112, 6, 16, 54, 6); c.fill();
      rr(c,   96, 6, 16, 54, 6); c.fill();

      // 4 vent slots
      const ventX = [-60, -20, 20, 60];
      c.fillStyle = C.dark;
      ventX.forEach((vx) => { rr(c, vx - 7, -42, 14, 72, 6); c.fill(); });

      // LED dots above vents (blinking, alternating cyan/red)
      ventX.forEach((vx, i) => {
        const led = chestLeds[i];
        if (t * 1000 > led.next && t * 1000 > led.until) {
          led.until = t * 1000 + 130;
          led.next  = t * 1000 + 3000 + Math.random() * 2000;
        }
        const on = !(t * 1000 < led.until);
        const col = i % 2 === 0 ? C.ledCyan : C.ledRed;
        glowDot(vx, -54, 6, col, on ? 1 : 0.15);
      });

      // accent stripe (pulsing)
      const pulse = reduced ? 1 : 0.7 + Math.sin(t * 2.2) * 0.3;
      c.save();
      c.shadowBlur = 16 * pulse;
      c.shadowColor = C.accent;
      c.fillStyle = C.accent;
      c.globalAlpha = 0.55 + pulse * 0.45;
      rr(c, -78, 44, 156, 10, 5); c.fill();
      c.restore();
      c.restore(); // torso

      /* ═══════════════════ NECK ═══════════════════ */
      c.save();
      c.translate(0, 36);
      c.fillStyle = C.bodyDark;
      rr(c, -34, -6, 68, 34, 10); c.fill();
      c.strokeStyle = C.dark;
      c.lineWidth = 2;
      [2, 11, 20].forEach((ny) => {
        c.beginPath(); c.moveTo(-30, ny); c.lineTo(30, ny); c.stroke();
      });
      c.restore();

      /* ═══════════════════ HEAD ═══════════════════ */
      c.save();
      c.translate(0, -110);
      // edge halo
      c.fillStyle = C.edge;
      rr(c, -126, -116, 252, 226, 42); c.fill();
      // head body gradient
      const hg = c.createLinearGradient(-120, -110, 120, 110);
      hg.addColorStop(0, C.bodyLight);
      hg.addColorStop(0.5, C.body);
      hg.addColorStop(1, C.bodyDark);
      c.fillStyle = hg;
      rr(c, -120, -110, 240, 220, 38); c.fill();

      /* ─── ANTENNA ─── */
      c.save();
      c.translate(0, -110);
      c.strokeStyle = C.edge;
      c.lineWidth = 5;
      c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -40); c.stroke();
      const aPulse = reduced ? 1 : 0.5 + (Math.sin(t * Math.PI) * 0.5 + 0.5);
      glowDot(0, -48, 13, C.antenna, aPulse);
      c.restore();

      /* ─── EYES ─── */
      const eyeY = -6;
      const socketR = 46;           // dark eye-hole radius
      const irisR   = 38;           // coloured iris radius
      const pupilR  = 16;           // dark pupil radius
      const irisMaxOff  = socketR - irisR;           // 8 — iris stays inside socket
      const pupilMaxOff = irisR - pupilR - 2;        // 20 — pupil stays inside iris (2 px safety margin)

      [-58, 58].forEach((ex) => {
        // outer dark socket (fixed position)
        c.save();
        c.shadowBlur = 22;
        c.shadowColor = C.iris;
        c.fillStyle = C.dark;
        c.beginPath(); c.arc(ex, eyeY, socketR, 0, Math.PI * 2); c.fill();
        c.restore();

        // ── iris follows cursor (clamped inside socket) ──
        let iOx = px * irisMaxOff;
        let iOy = py * irisMaxOff * 0.8;
        const iDist = Math.sqrt(iOx * iOx + iOy * iOy);
        if (iDist > irisMaxOff) { iOx *= irisMaxOff / iDist; iOy *= irisMaxOff / iDist; }
        const irisX = ex + iOx;
        const irisY = eyeY + iOy;

        const ig = c.createRadialGradient(irisX, irisY, 2, irisX, irisY, irisR);
        ig.addColorStop(0, '#ccf6ff');
        ig.addColorStop(0.35, C.iris);
        ig.addColorStop(1, '#055768');
        c.fillStyle = ig;
        c.beginPath(); c.arc(irisX, irisY, irisR, 0, Math.PI * 2); c.fill();

        // ── pupil follows cursor more aggressively (clamped inside iris) ──
        let pOx = px * pupilMaxOff;
        let pOy = py * pupilMaxOff * 0.8;
        const pDist = Math.sqrt(pOx * pOx + pOy * pOy);
        if (pDist > pupilMaxOff) { pOx *= pupilMaxOff / pDist; pOy *= pupilMaxOff / pDist; }
        const ppx = irisX + pOx;
        const ppy = irisY + pOy;

        c.fillStyle = C.dark;
        c.beginPath(); c.arc(ppx, ppy, pupilR, 0, Math.PI * 2); c.fill();

        // specular highlight (upper-left of pupil)
        c.fillStyle = C.white;
        c.globalAlpha = 0.9;
        c.beginPath(); c.arc(ppx - 5, ppy - 6, 4.5, 0, Math.PI * 2); c.fill();
        c.globalAlpha = 1;
      });

      /* ─── MOUTH ─── (5 segments, curve with mouse X) */
      c.save();
      c.translate(0, 74);
      // recessed panel
      c.fillStyle = C.dark;
      rr(c, -62, -16, 124, 32, 8); c.fill();
      const segX = [-44, -22, 0, 22, 44];
      segX.forEach((sx, i) => {
        // smile curve: ends dip down a touch, shifted by mouse x
        const curve = Math.abs(sx) * 0.06 * (1 + px * 0.4);
        const on = (() => {
          const led = mouthLeds[i];
          if (t * 1000 > led.next && t * 1000 > led.until) {
            led.until = t * 1000 + 130;
            led.next  = t * 1000 + 3000 + Math.random() * 2000;
          }
          return !(t * 1000 < led.until);
        })();
        const col = i % 2 === 0 ? C.mGreen : C.mRed;
        c.save();
        c.shadowBlur = on ? 10 : 0;
        c.shadowColor = col;
        c.fillStyle = col;
        c.globalAlpha = on ? 1 : 0.2;
        rr(c, sx - 7, -9 + curve, 14, 18, 3); c.fill();
        c.restore();
      });
      c.restore(); // mouth

      c.restore(); // head
      c.restore(); // global

      if (!reduced) raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    if (reduced) frame(performance.now());   // single static draw

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      el.removeEventListener('click', onClick);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block', cursor: 'pointer' }}
      aria-label="Whobee, an animated robot mascot whose eyes follow your cursor"
      role="img"
    />
  );
}
