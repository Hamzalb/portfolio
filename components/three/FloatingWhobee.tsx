'use client';
/**
 * FloatingWhobee
 * ─────────────────────────────────────────────────────────────────────
 * A small, fixed-position Whobee mascot anchored to the bottom-right corner.
 * Because it is `position: fixed`, it stays pinned to the viewport and
 * remains visible while the user scrolls the page up or down.
 *
 * Rendered once at the page level (not inside any section) so it floats
 * over the whole site. Mounted client-side only (Canvas 2D needs the DOM).
 */

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const WhobeeDynamic = dynamic(() => import('./Whobee'), {
  ssr: false,
  loading: () => null,
});

export default function FloatingWhobee() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div
      aria-hidden="false"
      style={{
        position: 'fixed',
        right:  'clamp(0.25rem, 1.5vw, 1.25rem)',
        bottom: 'clamp(0.25rem, 1.5vw, 1rem)',
        // Small footprint — scales gently with viewport
        width:  'clamp(108px, 13vw, 168px)',
        height: 'clamp(150px, 18vw, 230px)',
        zIndex: 40,
        // The wrapper ignores pointer events; only the canvas itself
        // catches clicks (for the happy-bounce). Eye-tracking uses a
        // global mousemove listener, so it works regardless.
        pointerEvents: 'none',
        // Subtle fade-in so it doesn't pop in abruptly
        animation: 'fade-in 0.8s ease 0.6s both',
        userSelect: 'none',
      }}
    >
      <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
        <WhobeeDynamic />
      </div>
    </div>
  );
}
