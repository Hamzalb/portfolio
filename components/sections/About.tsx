'use client';
import type { RefObject } from 'react';
import { useCounter } from '@/hooks/useCounter';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { LazyOrbitalRings } from '@/components/three/LazyScene';

const STATS = [
  { value: 20, suffix: '+', label: 'Projects Shipped' },
  { value: 15, suffix: '+', label: 'Technologies' },
  { value: 4,  suffix: '+', label: 'Years Experience' },
];

const LEARNING = ['Rust', 'WebAssembly', 'LLM Fine-tuning', 'System Design'];

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCounter(value);
  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className="glass-card p-6 text-center flex-1 min-w-0"
    >
      <div
        className="text-3xl font-bold mb-1"
        aria-label={`${value}${suffix} ${label}`}
        style={{
          background: 'linear-gradient(135deg,#6366f1,#06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        <span aria-hidden="true">{count}{suffix}</span>
      </div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

export default function About() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const contentRef = useScrollReveal<HTMLDivElement>();

  return (
    <section id="about" ref={sectionRef} className="relative section-pad" aria-labelledby="about-heading">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div ref={contentRef} className="mb-16">
          <p className="text-sm font-mono text-indigo-400 mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
            01. who i am
          </p>
          <h2 id="about-heading" className="section-heading text-3xl md:text-4xl font-bold text-white">
            About Me
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 3D Orbital Rings + avatar initials overlay */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80">
              {/* 3D scene fills the box */}
              <LazyOrbitalRings />

              {/* Initials badge floats on top */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                aria-label="Hamza Loubani initials"
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white select-none"
                  style={{
                    background: 'rgba(99,102,241,0.18)',
                    border: '1px solid rgba(99,102,241,0.35)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 8px 32px rgba(99,102,241,0.3)',
                  }}
                >
                  HL
                </div>
              </div>

              {/* Open-to-work badge */}
              <div
                className="absolute -bottom-2 -right-2 px-3 py-1.5 rounded-xl text-xs font-medium z-10"
                style={{
                  background: 'rgba(16,185,129,0.15)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  color: '#34d399',
                  backdropFilter: 'blur(8px)',
                }}
              >
                ✓ Open to Work
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-6">
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                Hey, I&apos;m <strong className="text-white">Hamza</strong> — a full-stack engineer from
                Tripoli, Lebanon, building fast, accessible, and beautifully designed web products.
                I care deeply about the intersection of engineering and design.
              </p>
              <p>
                I specialize in <strong className="text-indigo-400">React / Next.js</strong> on the frontend
                and <strong className="text-cyan-400">Node.js / Express</strong> on the backend, with a
                strong foundation in database design, API architecture, and DevOps practices.
              </p>
              <p>
                When I&apos;m not shipping code, I&apos;m contributing to open source, writing about
                web development, or mentoring junior developers in the community.
              </p>
            </div>

            {/* Currently learning chips */}
            <div>
              <p className="text-sm text-slate-500 mb-3" style={{ fontFamily: 'var(--font-mono)' }}>
                // currently learning
              </p>
              <div className="flex flex-wrap gap-2" role="list" aria-label="Currently learning">
                {LEARNING.map((item) => (
                  <span
                    key={item}
                    role="listitem"
                    className="px-3 py-1 rounded-full text-xs font-medium text-cyan-300 transition-transform hover:scale-105"
                    style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)' }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="flex flex-col sm:flex-row gap-4 mt-16" role="list" aria-label="Statistics">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
