'use client';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [hasMouse, setHasMouse] = useState(false);

  // Detect whether the device has a fine pointer (mouse / trackpad)
  useEffect(() => {
    const mq = window.matchMedia('(hover:hover) and (pointer:fine)');
    setHasMouse(mq.matches);
    const handler = (e: MediaQueryListEvent) => setHasMouse(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (reduced || !hasMouse) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      raf = requestAnimationFrame(animate);
    };

    const onEnterLink = () => {
      dot.style.transform = 'translate(-50%, -50%) scale(0)';
      ring.style.width = '56px';
      ring.style.height = '56px';
      ring.style.borderColor = 'rgba(99,102,241,0.9)';
    };

    const onLeaveLink = () => {
      dot.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgba(99,102,241,0.5)';
    };

    window.addEventListener('mousemove', onMove);

    // Use MutationObserver to bind cursor interactions to dynamically added links
    const bindLinks = (root: ParentNode) => {
      root.querySelectorAll('a, button, [role="button"]').forEach(l => {
        l.addEventListener('mouseenter', onEnterLink);
        l.addEventListener('mouseleave', onLeaveLink);
      });
    };
    bindLinks(document);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches('a, button, [role="button"]')) {
              node.addEventListener('mouseenter', onEnterLink);
              node.addEventListener('mouseleave', onLeaveLink);
            }
            bindLinks(node);
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    raf = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      observer.disconnect();
      document.querySelectorAll('a, button, [role="button"]').forEach(l => {
        l.removeEventListener('mouseenter', onEnterLink);
        l.removeEventListener('mouseleave', onLeaveLink);
      });
    };
  }, [reduced, hasMouse]);

  // Don't render on touch-only or reduced-motion devices
  if (reduced || !hasMouse) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
