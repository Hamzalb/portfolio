'use client';
/**
 * HeroSection
 * ─────────────────────────────────────────────────────────────────────
 * Complete hero section: Canvas 2D background, word-cascade title,
 * location badge, typed subtitle, CTA buttons, social links, scroll
 * indicator.
 *
 * The WebGPU depth-map parallax overlay (hero-futuristic.tsx) is loaded
 * via dynamic import ONLY when a real GPU adapter is available. This
 * keeps R3F v8 (which crashes under React 19's removed ReactCurrentOwner)
 * from being evaluated on machines without WebGPU.
 */

import { useState, useEffect, type ComponentType } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import HeroScene from '../three/HeroScene';

export default function HeroSection() {
  const TITLE_WORDS = ['Hamza', 'Loubani'];
  const SUBTITLE    = 'Full-Stack Developer & Software Engineer';

  // ── state ──────────────────────────────────────────────────────────────────
  const [WebGPUOverlay, setWebGPUOverlay] = useState<ComponentType | null>(null);
  const [visible,      setVisible]      = useState(false);
  const [wordCount,    setWordCount]    = useState(0);
  const [subVisible,   setSubVisible]   = useState(false);
  const [ctaVisible,   setCtaVisible]   = useState(false);
  // Random glitch delays calculated client-side (no SSR mismatch)
  const [wordDelays,   setWordDelays]   = useState<number[]>([]);

  // ── boot ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    // 1 – appear trigger
    const t = setTimeout(() => setVisible(true), 80);
    // 2 – client-only random delays for the glitch entrance
    setWordDelays(TITLE_WORDS.map(() => Math.random() * 0.06));
    // 3 – WebGPU: only import R3F module if a real GPU adapter exists.
    //     This ensures hero-futuristic.tsx (which contains R3F v8 imports
    //     incompatible with React 19) is NEVER loaded on machines without
    //     a working WebGPU adapter.
    (async () => {
      try {
        const nav = navigator as any;
        if (!nav?.gpu) return;
        const adapter = await nav.gpu.requestAdapter();
        if (!adapter) return;
        const mod = await import('./hero-futuristic');
        setWebGPUOverlay(() => mod.default);
      } catch { /* GPU / R3F not available */ }
    })();
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── word cascade ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (wordCount < TITLE_WORDS.length) {
      const t = setTimeout(() => setWordCount((n) => n + 1), 480);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setSubVisible(true), 320);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordCount]);

  useEffect(() => {
    if (!subVisible) return;
    const t = setTimeout(() => setCtaVisible(true), 440);
    return () => clearTimeout(t);
  }, [subVisible]);

  // ── helpers ────────────────────────────────────────────────────────────────
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const fadeIn = (show: boolean, delay = 0) => ({
    opacity:    show ? 1 : 0,
    transform:  show ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
  });

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <section
      id="hero"
      className="relative min-h-svh overflow-hidden flex flex-col"
      aria-label="Hero"
    >
      {/* ── Background layers ───────────────────────────────────────────── */}

      {/* Layer 1 (z-0): Original Canvas 2D — stars, dual icosahedron,
          constellation particles, HDR orbs. Always rendered. */}
      <HeroScene />

      {/* Layer 2 (z-1): WebGPU depth-map parallax — composites over the
          Canvas 2D scene when a real GPU adapter is available. */}
      {WebGPUOverlay && <WebGPUOverlay />}

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 flex-1 flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto"
        style={{
          padding:
            'clamp(5rem,12vw,8rem) clamp(1rem,4vw,1.5rem) clamp(4rem,8vw,5rem)',
        }}
      >
        {/* Location / status badge */}
        <div
          role="status"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs sm:text-sm text-slate-400"
          style={{
            ...fadeIn(visible),
            background: 'rgba(255,255,255,0.04)',
            border:     '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span
              className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
              style={{ animation: 'ping-slow 1.5s cubic-bezier(0,0,0.2,1) infinite' }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Available for work · Tripoli, Lebanon
        </div>

        {/* Title — word-by-word glitch entrance */}
        <h1
          className="font-bold tracking-tight text-white mb-4 flex flex-wrap items-center justify-center"
          style={{
            fontSize:   'clamp(2.4rem, 9vw, 7rem)',
            lineHeight: 1.05,
            gap:        'clamp(0.3rem, 2vw, 1rem)',
          }}
        >
          {TITLE_WORDS.map((word, i) => (
            <span
              key={word}
              className={i < wordCount ? 'hero-word-enter' : ''}
              style={{
                opacity:        i < wordCount ? undefined : 0,
                animationDelay: `${wordDelays[i] ?? 0}s`,
                display:        'inline-block',
                // Gradient accent on the last name.
                // Note: keep filter OFF this element — Chrome breaks
                // -webkit-background-clip:text when filter is animated on it.
                ...(i === 1
                  ? {
                      background:           'linear-gradient(135deg,#6366f1 0%,#06b6d4 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip:       'text',
                      WebkitTextFillColor:  'transparent',
                      color:                'transparent',   // standard fallback
                    }
                  : {}),
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p
          className={`text-slate-300 font-light mb-3${subVisible ? ' hero-subtitle-enter' : ''}`}
          style={{
            fontSize:       'clamp(0.95rem,3.5vw,1.5rem)',
            opacity:        subVisible ? undefined : 0,
            animationDelay: '0.04s',
          }}
        >
          {SUBTITLE}
        </p>

        {/* Bio */}
        <p
          className="text-slate-400 leading-relaxed text-sm sm:text-base"
          style={{
            ...fadeIn(subVisible, 180),
            maxWidth: '520px',
            margin:   '0 auto 2.5rem',
          }}
        >
          Crafting performant, accessible web experiences with clean
          architecture. Passionate about open source, developer tooling, and
          shipping products that matter.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10"
          style={fadeIn(ctaVisible)}
        >
          <button
            onClick={() => scrollTo('projects')}
            className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl font-medium text-white text-sm sm:text-base transition-all duration-200 active:scale-95"
            style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                '0 8px 32px rgba(99,102,241,0.45)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = 'none')
            }
          >
            View My Work
          </button>
          <a
            href="/cv.pdf"
            download
            className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl font-medium text-white text-sm sm:text-base border transition-all duration-200 hover:bg-white/5 active:scale-95"
            style={{ borderColor: 'rgba(255,255,255,0.18)' }}
          >
            Download CV
          </a>
        </div>

        {/* Social links */}
        <div
          className="flex items-center justify-center gap-3"
          style={fadeIn(ctaVisible, 100)}
        >
          {[
            {
              href:  'https://github.com/hamzaloubani',
              Icon:  Github,
              label: 'GitHub profile',
            },
            {
              href:  'https://linkedin.com/in/hamzaloubani',
              Icon:  Linkedin,
              label: 'LinkedIn profile',
            },
            {
              href:  'mailto:hamzaloubani1234@gmail.com',
              Icon:  Mail,
              label: 'Send email',
            },
          ].map(({ href, Icon, label }) => (
            <a
              key={href}
              href={href}
              aria-label={label}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={
                href.startsWith('http')
                  ? 'noopener noreferrer'
                  : undefined
              }
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl text-slate-400 hover:text-white transition-all duration-200 hover:-translate-y-1"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border:     '1px solid rgba(255,255,255,0.08)',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor =
                  'rgba(99,102,241,0.5)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor =
                  'rgba(255,255,255,0.08)')
              }
            >
              <Icon size={18} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>{/* /content */}

      {/* ── Explore / scroll indicator ───────────────────────────────────── */}
      <button
        className="explore-btn"
        onClick={() => scrollTo('about')}
        style={{ animationDelay: '2.4s' }}
        aria-label="Scroll to About section"
      >
        Scroll to explore
        <span className="explore-arrow">
          <svg
            width="18"
            height="18"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="arrow-svg"
            aria-hidden="true"
          >
            <path
              d="M11 5V17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M6 12L11 17L16 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
    </section>
  );
}
