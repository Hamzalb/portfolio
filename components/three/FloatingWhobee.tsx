'use client';
/**
 * FloatingWhobee
 * ─────────────────────────────────────────────────────────────────────
 * A small, fixed-position Whobee mascot anchored to the bottom-right corner.
 * Because it is `position: fixed`, it stays pinned to the viewport and
 * remains visible while the user scrolls the page up or down.
 *
 * On mobile (< 640px) the robot is significantly smaller so it doesn't
 * cover page content or collide with the "Scroll to explore" button.
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
    <>
      {/* Responsive sizing via CSS — much smaller on mobile to avoid
          covering text content and colliding with the scroll button. */}
      <style>{`
        .whobee-float {
          position: fixed;
          right:  0.5rem;
          bottom: 0.5rem;
          width:  72px;
          height: 100px;
          z-index: 40;
          pointer-events: none;
          animation: fade-in 0.8s ease 0.6s both;
          user-select: none;
        }
        @media (min-width: 480px) {
          .whobee-float {
            right:  0.75rem;
            bottom: 0.75rem;
            width:  90px;
            height: 125px;
          }
        }
        @media (min-width: 640px) {
          .whobee-float {
            right:  clamp(0.5rem, 1.5vw, 1.25rem);
            bottom: clamp(0.5rem, 1.5vw, 1rem);
            width:  clamp(108px, 13vw, 168px);
            height: clamp(150px, 18vw, 230px);
          }
        }
      `}</style>
      <div className="whobee-float" aria-hidden="false">
        <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
          <WhobeeDynamic />
        </div>
      </div>
    </>
  );
}
