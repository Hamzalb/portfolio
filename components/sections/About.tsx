'use client';
import type { RefObject } from 'react';
import { useCounter } from '@/hooks/useCounter';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { LazyOrbitalRings } from '@/components/three/LazyScene';
import { Sparkles, Code2, Globe, Cpu } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const STATS = [
  { value: 20, suffix: '+', label: 'Projects Shipped',  icon: Code2 },
  { value: 15, suffix: '+', label: 'Technologies',      icon: Cpu },
  { value: 4,  suffix: '+', label: 'Years Experience',  icon: Globe },
];

const LEARNING = ['Rust', 'WebAssembly', 'LLM Fine-tuning', 'System Design'];

const HIGHLIGHTS = [
  { text: 'React / Next.js', color: '#818cf8' },
  { text: 'Node.js / Express', color: '#22d3ee' },
  { text: 'MongoDB / PostgreSQL', color: '#34d399' },
];

/* ─────────────────────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────────────────────── */
function StatCard({ value, suffix, label, icon: Icon }: {
  value: number; suffix: string; label: string; icon: typeof Code2;
}) {
  const { count, ref } = useCounter(value);
  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className="about-stat-card"
    >
      <div className="about-stat-icon-wrap" aria-hidden="true">
        <Icon size={18} strokeWidth={1.5} />
      </div>
      <div
        className="about-stat-number"
        aria-label={`${value}${suffix} ${label}`}
      >
        <span aria-hidden="true">{count}{suffix}</span>
      </div>
      <div className="about-stat-label">{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ABOUT SECTION
───────────────────────────────────────────────────────────── */
export default function About() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const contentRef = useScrollReveal<HTMLDivElement>();

  return (
    <>
      <style>{`
        /* ── Section header ─────────────────────────────── */
        .about-label {
          font-size: 0.8125rem;
          font-family: var(--font-mono);
          color: #818cf8;
          margin-bottom: 0.5rem;
        }
        .about-title {
          font-size: clamp(1.75rem, 5vw, 2.5rem);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.025em;
          line-height: 1.15;
        }
        .about-title span {
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }

        /* ── Orbital rings + avatar ─────────────────────── */
        .about-visual {
          display: flex;
          justify-content: center;
        }
        @media (min-width: 1024px) {
          .about-visual { justify-content: flex-start; }
        }
        .about-orbit-box {
          position: relative;
          width: clamp(14rem, 30vw, 20rem);
          height: clamp(14rem, 30vw, 20rem);
        }
        .about-avatar-badge {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .about-avatar-inner {
          width: 5rem;
          height: 5rem;
          border-radius: 1.125rem;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: rgba(99, 102, 241, 0.15);
          border: 1px solid rgba(99, 102, 241, 0.3);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.25),
                      0 0 0 1px rgba(99, 102, 241, 0.1) inset;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .about-avatar-inner:hover {
          transform: scale(1.06) rotate(-3deg);
        }
        .about-avatar-inner img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        /* Open-to-work badge */
        .about-status-badge {
          position: absolute;
          bottom: -0.25rem;
          right: -0.25rem;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.375rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #34d399;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 10;
          white-space: nowrap;
        }
        .about-status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
          animation: pulse-heart 2s ease-in-out infinite;
        }

        /* ── Bio content ────────────────────────────────── */
        .about-bio {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .about-bio-text {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          font-size: 0.9375rem;
          line-height: 1.7;
          color: #94a3b8;
        }
        .about-bio-text strong {
          color: #f1f5f9;
          font-weight: 600;
        }

        /* ── Tech highlights ────────────────────────────── */
        .about-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .about-highlight-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          font-family: var(--font-mono);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: border-color 0.2s, transform 0.2s;
        }
        .about-highlight-chip:hover {
          transform: translateY(-1px);
        }
        .about-highlight-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* ── Currently learning ─────────────────────────── */
        .about-learning-label {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: #475569;
          margin-bottom: 0.625rem;
        }
        .about-learning-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
        }
        .about-learning-chip {
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          color: #22d3ee;
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.18);
          transition: background 0.2s, transform 0.2s;
        }
        .about-learning-chip:hover {
          background: rgba(6, 182, 212, 0.14);
          transform: translateY(-1px);
        }

        /* ── Stat cards ─────────────────────────────────── */
        .about-stats-row {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: clamp(2.5rem, 5vw, 4rem);
        }
        @media (min-width: 640px) {
          .about-stats-row {
            flex-direction: row;
          }
        }
        .about-stat-card {
          flex: 1;
          min-width: 0;
          padding: 1.25rem;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.375rem;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.3s ease,
                      box-shadow 0.3s ease;
        }
        .about-stat-card:hover {
          transform: translateY(-3px);
          border-color: rgba(99, 102, 241, 0.2);
          box-shadow: 0 12px 40px rgba(99, 102, 241, 0.12);
        }
        @media (hover: none) {
          .about-stat-card:hover {
            transform: none;
            box-shadow: none;
          }
        }
        .about-stat-icon-wrap {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.625rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #818cf8;
          background: rgba(99, 102, 241, 0.08);
          border: 1px solid rgba(99, 102, 241, 0.15);
          margin-bottom: 0.25rem;
        }
        .about-stat-number {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        .about-stat-label {
          font-size: 0.8125rem;
          color: #64748b;
          font-weight: 500;
        }

        /* ── Grid layout ────────────────────────────────── */
        .about-grid {
          display: grid;
          gap: clamp(2rem, 4vw, 3rem);
          align-items: center;
        }
        @media (min-width: 1024px) {
          .about-grid {
            grid-template-columns: auto 1fr;
          }
        }
      `}</style>

      <section
        id="about"
        ref={sectionRef}
        className="relative section-pad"
        aria-labelledby="about-heading"
      >
        <div className="max-w-6xl mx-auto">
          {/* ── Section header ────────────────────────────── */}
          <div ref={contentRef} style={{ marginBottom: 'clamp(2rem, 4vw, 3.5rem)' }}>
            <p className="about-label">01. who i am</p>
            <h2 id="about-heading" className="about-title">
              About <span>Me</span>
            </h2>
          </div>

          {/* ── Main grid: visual + bio ───────────────────── */}
          <div className="about-grid">
            {/* Left — Orbital rings + avatar */}
            <div className="about-visual">
              <div className="about-orbit-box">
                <LazyOrbitalRings />

                {/* Avatar badge */}
                <div className="about-avatar-badge" aria-label="Hamza Loubani">
                  <div className="about-avatar-inner">
                    <img
                      src="/assets/logo.png"
                      alt="HL"
                      width={80}
                      height={80}
                      draggable={false}
                    />
                  </div>
                </div>

                {/* Status badge */}
                <div className="about-status-badge">
                  <span className="about-status-dot" aria-hidden="true" />
                  Open to Work
                </div>
              </div>
            </div>

            {/* Right — Bio content */}
            <div className="about-bio">
              {/* Bio paragraphs */}
              <div className="about-bio-text">
                <p>
                  Hey, I&apos;m <strong>Hamza</strong> — a full-stack engineer from
                  Tripoli, Lebanon, building fast, accessible, and beautifully designed web products.
                  I care deeply about the intersection of engineering and design.
                </p>
                <p>
                  I specialize in modern web technologies with a strong foundation in
                  database design, API architecture, and DevOps practices. I love turning
                  complex problems into simple, elegant solutions.
                </p>
                <p>
                  When I&apos;m not shipping code, I&apos;m contributing to open source, writing about
                  web development, or mentoring junior developers in the community.
                </p>
              </div>

              {/* Tech highlights */}
              <div className="about-highlights">
                {HIGHLIGHTS.map(({ text, color }) => (
                  <span
                    key={text}
                    className="about-highlight-chip"
                    style={{ borderColor: `${color}33`, color }}
                  >
                    <span
                      className="about-highlight-dot"
                      style={{ background: color, boxShadow: `0 0 6px ${color}66` }}
                      aria-hidden="true"
                    />
                    {text}
                  </span>
                ))}
              </div>

              {/* Currently learning */}
              <div>
                <p className="about-learning-label">
                  <Sparkles size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '0.35rem' }} />
                  currently learning
                </p>
                <div className="about-learning-list" role="list" aria-label="Currently learning">
                  {LEARNING.map((item) => (
                    <span key={item} role="listitem" className="about-learning-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Stat cards row ────────────────────────────── */}
          <div className="about-stats-row" role="list" aria-label="Statistics">
            {STATS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
