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

import { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ArrowUpRight, Download, ChevronDown } from 'lucide-react';
import HeroScene from '../three/HeroScene';

export default function HeroSection() {
  const TITLE_FIRST = 'Hamza';
  const TITLE_LAST  = 'Loubani';
  const SUBTITLE    = 'Full-Stack Developer & Software Engineer';

  // ── state ──────────────────────────────────────────────────────────────────
  const [visible,      setVisible]      = useState(false);
  const [wordCount,    setWordCount]    = useState(0);
  const [subVisible,   setSubVisible]   = useState(false);
  const [ctaVisible,   setCtaVisible]   = useState(false);
  const [wordDelays,   setWordDelays]   = useState<number[]>([]);

  // ── boot ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    setWordDelays([TITLE_FIRST, TITLE_LAST].map(() => Math.random() * 0.06));

    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── word cascade ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (wordCount < 2) {
      const t = setTimeout(() => setWordCount((n) => n + 1), 480);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setSubVisible(true), 320);
    return () => clearTimeout(t);
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
    <>
      <style>{`
        /* ── Hero layout ────────────────────────────────── */
        .hero-section {
          position: relative;
          min-height: 100svh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .hero-content {
          position: relative;
          z-index: 10;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
          max-width: 56rem;
          margin: 0 auto;
          padding: clamp(5rem, 12vw, 8rem) clamp(1rem, 4vw, 1.5rem) clamp(4rem, 8vw, 5rem);
        }

        /* ── Status badge ───────────────────────────────── */
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.875rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          color: #94a3b8;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        @media (min-width: 640px) {
          .hero-badge { font-size: 0.8125rem; }
        }
        .hero-badge-dot {
          position: relative;
          display: flex;
          width: 6px;
          height: 6px;
        }
        .hero-badge-dot::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: #34d399;
          opacity: 0.4;
          animation: ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .hero-badge-dot::after {
          content: '';
          position: relative;
          display: block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #34d399;
        }

        /* ── Title ──────────────────────────────────────── */
        .hero-title {
          font-weight: 800;
          letter-spacing: -0.035em;
          color: #fff;
          line-height: 1.05;
          margin-bottom: 0.75rem;
          font-size: clamp(2.4rem, 8vw, 6rem);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: clamp(0.3rem, 2vw, 1rem);
        }
        .hero-word {
          display: inline-block;
          opacity: 0;
        }
        .hero-word.entered {
          animation: heroWordIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .hero-word-gradient {
          background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }

        /* ── Subtitle ───────────────────────────────────── */
        .hero-subtitle {
          font-size: clamp(0.95rem, 3.5vw, 1.4rem);
          font-weight: 400;
          color: #cbd5e1;
          margin-bottom: 0.625rem;
          opacity: 0;
        }
        .hero-subtitle.entered {
          animation: heroSubtitleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        /* ── Bio ────────────────────────────────────────── */
        .hero-bio {
          font-size: 0.875rem;
          line-height: 1.65;
          color: #64748b;
          max-width: 480px;
          margin: 0 auto clamp(1.5rem, 3vw, 2.5rem);
        }
        @media (min-width: 640px) {
          .hero-bio { font-size: 0.9375rem; }
        }

        /* ── CTA buttons ────────────────────────────────── */
        .hero-ctas {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
        }
        .hero-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.7rem 1.5rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border: none;
          cursor: pointer;
          transition: box-shadow 0.25s ease, transform 0.2s ease;
          white-space: nowrap;
        }
        .hero-cta-primary:hover {
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.45);
          transform: translateY(-2px);
        }
        .hero-cta-primary:active {
          transform: scale(0.97);
        }
        .hero-cta-primary svg {
          transition: transform 0.2s;
        }
        .hero-cta-primary:hover svg {
          transform: translate(1px, -1px);
        }

        .hero-cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.7rem 1.5rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #f1f5f9;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          text-decoration: none;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          white-space: nowrap;
        }
        .hero-cta-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(99, 102, 241, 0.35);
          transform: translateY(-1px);
        }
        .hero-cta-secondary:active {
          transform: scale(0.97);
        }

        /* ── Social links ───────────────────────────────── */
        .hero-socials {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .hero-social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.75rem;
          color: #64748b;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          text-decoration: none;
          transition: color 0.2s, background 0.2s, border-color 0.2s, transform 0.2s;
        }
        @media (min-width: 640px) {
          .hero-social-link {
            width: 2.75rem;
            height: 2.75rem;
          }
        }
        .hero-social-link:hover {
          color: #fff;
          background: rgba(99, 102, 241, 0.1);
          border-color: rgba(99, 102, 241, 0.25);
          transform: translateY(-3px);
        }

        /* ── Scroll indicator ───────────────────────────── */
        .hero-scroll-btn {
          position: absolute;
          bottom: clamp(1.5rem, 4vw, 2.5rem);
          left: 0;
          right: 0;
          width: fit-content;
          margin-inline: auto;
          z-index: 20;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          cursor: pointer;
          white-space: nowrap;
          opacity: 0;
          animation: fade-up 0.6s ease both;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          padding-bottom: calc(0.5rem + env(safe-area-inset-bottom, 0px));
        }
        .hero-scroll-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(99, 102, 241, 0.35);
          color: #fff;
        }
        .hero-scroll-arrow {
          display: flex;
          align-items: center;
          animation: arrowBounce 1.5s ease-in-out infinite;
        }
      `}</style>

      <section className="hero-section" id="hero" aria-label="Hero">
        {/* ── Background layers ─────────────────────────────── */}
        <HeroScene />

        {/* ── Content ───────────────────────────────────────── */}
        <div className="hero-content">
          {/* Status badge */}
          <div className="hero-badge" role="status" style={fadeIn(visible)}>
            <span className="hero-badge-dot" aria-hidden="true" />
            Available for work &middot; Tripoli, Lebanon
          </div>

          {/* Title */}
          <h1 className="hero-title">
            <span
              className={`hero-word${wordCount >= 1 ? ' entered' : ''}`}
              style={{ animationDelay: `${wordDelays[0] ?? 0}s` }}
            >
              {TITLE_FIRST}
            </span>
            <span
              className={`hero-word hero-word-gradient${wordCount >= 2 ? ' entered' : ''}`}
              style={{ animationDelay: `${wordDelays[1] ?? 0}s` }}
            >
              {TITLE_LAST}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`hero-subtitle${subVisible ? ' entered' : ''}`}
            style={{ animationDelay: '0.04s' }}
          >
            {SUBTITLE}
          </p>

          {/* Bio */}
          <p className="hero-bio" style={fadeIn(subVisible, 180)}>
            Crafting performant, accessible web experiences with clean
            architecture. Passionate about open source, developer tooling, and
            shipping products that matter.
          </p>

          {/* CTAs */}
          <div className="hero-ctas" style={fadeIn(ctaVisible)}>
            <button
              className="hero-cta-primary"
              onClick={() => scrollTo('projects')}
            >
              View My Work
              <ArrowUpRight size={16} strokeWidth={2.5} aria-hidden="true" />
            </button>
            <a
              href="/cv.pdf"
              download
              className="hero-cta-secondary"
            >
              <Download size={15} strokeWidth={2} aria-hidden="true" />
              Download CV
            </a>
          </div>

          {/* Social links */}
          <div className="hero-socials" style={fadeIn(ctaVisible, 100)}>
            {[
              { href: 'https://github.com/hamzaloubani',     Icon: Github,   label: 'GitHub profile' },
              { href: 'https://linkedin.com/in/hamzaloubani', Icon: Linkedin, label: 'LinkedIn profile' },
              { href: 'mailto:hamzaloubani1234@gmail.com',   Icon: Mail,     label: 'Send email' },
            ].map(({ href, Icon, label }) => (
              <a
                key={href}
                href={href}
                aria-label={label}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="hero-social-link"
              >
                <Icon size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* ── Scroll indicator ──────────────────────────────── */}
        <button
          className="hero-scroll-btn"
          onClick={() => scrollTo('about')}
          style={{ animationDelay: '2.4s' }}
          aria-label="Scroll to About section"
        >
          Scroll to explore
          <span className="hero-scroll-arrow">
            <ChevronDown size={14} strokeWidth={2.5} aria-hidden="true" />
          </span>
        </button>
      </section>
    </>
  );
}
