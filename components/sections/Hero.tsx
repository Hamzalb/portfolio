'use client';
import { useEffect, useRef, useState } from 'react';
import { Github, Linkedin, Mail, ArrowDown } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { LazyHeroScene } from '@/components/three/LazyScene';

const ROLES = ['Software Engineer', 'Full-Stack Developer', 'Problem Solver', 'Open Source Contributor'];

// Fixed seeds (no Math.random() in render → avoids hydration mismatch)
const TECH_LOGOS = [
  { label: 'React',      char: '⚛',  top: '18%', left: '8%',   right: undefined, bottom: undefined, duration: '6s', delay: '0s' },
  { label: 'Node.js',    char: '⬡',  top: '25%', right: '10%', left: undefined,  bottom: undefined, duration: '7s', delay: '1.5s' },
  { label: 'TypeScript', char: 'TS', top: undefined, left: '6%', right: undefined, bottom: '28%', duration: '5.5s', delay: '0.8s' },
  { label: 'Next.js',    char: '▲',  top: '60%', right: '7%',  left: undefined,  bottom: undefined, duration: '8s', delay: '2.1s' },
  { label: 'MongoDB',    char: '🍃', top: undefined, right: '14%', left: undefined, bottom: '18%', duration: '6.5s', delay: '0.4s' },
  { label: 'Docker',     char: '🐳', top: '40%', left: '3%',   right: undefined, bottom: undefined, duration: '7.5s', delay: '1.2s' },
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  // Detect WebGPU support; fall back to Canvas 2D scene if unavailable
  const [hasWebGPU, setHasWebGPU] = useState(false);
  const reduced = useReducedMotion();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // A shallow `'gpu' in navigator` check is not enough —
    // Chrome exposes the WebGPU API even on sandboxed/disabled GPUs.
    // requestAdapter() is the real test: it returns null when no usable GPU
    // is available (sandboxed, driver issue, headless, etc.).
    // Three.js WebGPURenderer falls back to WebGL when WebGPU fails; if
    // WebGL is also sandboxed that causes a second crash — so we gate on
    // a confirmed working adapter before mounting the canvas at all.
    async function detectWebGPU() {
      try {
        const nav = navigator as any;
        if (!nav?.gpu) return;                                    // API absent
        const adapter = await nav.gpu.requestAdapter();
        if (adapter) setHasWebGPU(true);                         // real GPU ✓
        // adapter === null → sandboxed / no GPU — keep hasWebGPU false
      } catch {
        // requestAdapter() threw — WebGPU unavailable
      }
    }
    detectWebGPU();
  }, []);

  useEffect(() => {
    if (reduced) { setDisplayed(ROLES[0]); return; }
    const target = ROLES[roleIndex];
    if (!deleting) {
      if (displayed.length < target.length) {
        timeoutRef.current = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 65);
      } else {
        timeoutRef.current = setTimeout(() => setDeleting(true), 2200);
      }
    } else {
      if (displayed.length > 0) {
        timeoutRef.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
      } else {
        setDeleting(false);
        setRoleIndex((i) => (i + 1) % ROLES.length);
      }
    }
    return () => clearTimeout(timeoutRef.current);
  }, [displayed, deleting, roleIndex, reduced]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fadeUp = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  });

  const handleViewWork = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-svh flex flex-col items-center justify-center overflow-hidden"
      style={{ padding: 'clamp(1rem,4vw,1.5rem)' }}
      aria-label="Hero"
    >
      {/* 3D Background Scene — Canvas 2D fallback (WebGPU overlay handled by HeroSection) */}
      <LazyHeroScene />

      {/* Floating tech logos */}
      {TECH_LOGOS.map(({ label, char, top, left, right, bottom, duration, delay }) => (
        <div
          key={label}
          aria-hidden="true"
          className="absolute hidden lg:flex items-center justify-center w-12 h-12 rounded-2xl text-lg font-bold select-none"
          style={{
            top, left, right, bottom,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(8px)',
            color: 'rgba(255,255,255,0.5)',
            animation: `float ${duration} ease-in-out ${delay} infinite`,
            transform: `translateY(${scrollY * -0.04}px)`,
          }}
          title={label}
        >
          {char}
        </div>
      ))}

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center" style={{ marginTop: '-3vh' }}>
        {/* Location badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-sm text-slate-400"
          role="status"
          aria-label="Location and availability status"
          style={{ ...fadeUp(0), background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span
              className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
              style={{ animation: 'ping-slow 1.5s cubic-bezier(0,0,0.2,1) infinite' }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span>Available for work · Tripoli, Lebanon</span>
        </div>

        {/* Name */}
        <h1
          style={{ ...fadeUp(80), fontSize: 'clamp(2.2rem, 8vw, 6rem)', lineHeight: 1.05 }}
          className="font-bold tracking-tight text-white mb-4"
        >
          Hamza{' '}
          <span
            style={{
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            }}
          >
            Loubani
          </span>
        </h1>

        {/* Typed role */}
        <div
          style={{ ...fadeUp(160), minHeight: '2.5rem', fontSize: 'clamp(1rem, 3.5vw, 1.5rem)' }}
          className="flex items-center justify-center gap-2 text-slate-300 font-light mb-6"
          aria-live="polite"
          aria-atomic="true"
          aria-label={`Current role: ${ROLES[roleIndex]}`}
        >
          <span style={{ fontFamily: 'var(--font-mono)' }}>
            {displayed}
          </span>
          <span
            aria-hidden="true"
            className="inline-block w-0.5 h-6 rounded-sm"
            style={{ background: '#6366f1', animation: 'typing-cursor 1s step-end infinite' }}
          />
        </div>

        {/* Bio */}
        <p
          style={{ ...fadeUp(240), maxWidth: '560px', margin: '0 auto 2.5rem' }}
          className="text-slate-400 leading-relaxed"
        >
          Crafting performant, accessible web experiences with clean architecture.
          Passionate about open source, developer tooling, and shipping products that matter.
        </p>

        {/* CTAs */}
        <div style={fadeUp(320)} className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            onClick={handleViewWork}
            className="px-7 py-3 rounded-xl font-medium text-white transition-all duration-200 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.45)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
          >
            View My Work
          </button>
          <a
            href="/cv.pdf"
            download
            className="px-7 py-3 rounded-xl font-medium text-white border transition-all duration-200 hover:bg-white/5 active:scale-95"
            style={{ borderColor: 'rgba(255,255,255,0.18)' }}
          >
            Download CV
          </a>
        </div>

        {/* Social links */}
        <div style={fadeUp(400)} className="flex items-center justify-center gap-3">
          {[
            { href: 'https://github.com/hamzaloubani',    Icon: Github,   label: 'GitHub profile' },
            { href: 'https://linkedin.com/in/hamzaloubani', Icon: Linkedin, label: 'LinkedIn profile' },
            { href: 'mailto:hamzaloubani1234@gmail.com',  Icon: Mail,     label: 'Send email' },
          ].map(({ href, Icon, label }) => (
            <a
              key={href}
              href={href}
              aria-label={label}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-400 hover:text-white transition-all duration-200 hover:-translate-y-1"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            >
              <Icon size={18} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll to About section"
        className="absolute bottom-10 center -translate-x-1/2 text-slate-500 hover:text-white transition-colors"
        style={{ animation: 'float 2.5s ease-in-out infinite' }}
      >
        <ArrowDown size={20} aria-hidden="true" />
      </button>
    </section>
  );
}
