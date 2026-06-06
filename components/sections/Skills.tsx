'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { LazySkillsGlobe } from '@/components/three/LazyScene';
import type { Skill } from '@/types';

/* ─────────────────────────────────────────────────────────────
   CATEGORY THEME
───────────────────────────────────────────────────────────── */
const CATEGORY_THEME: Record<string, {
  gradient: string;
  text: string;
  bg: string;
  border: string;
  glow: string;
  dot: string;
}> = {
  Frontend: {
    gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
    text:     '#818cf8',
    bg:       'rgba(99,102,241,0.07)',
    border:   'rgba(99,102,241,0.18)',
    glow:     'rgba(99,102,241,0.25)',
    dot:      '#6366f1',
  },
  Backend: {
    gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
    text:     '#22d3ee',
    bg:       'rgba(6,182,212,0.07)',
    border:   'rgba(6,182,212,0.18)',
    glow:     'rgba(6,182,212,0.25)',
    dot:      '#06b6d4',
  },
  DevOps: {
    gradient: 'linear-gradient(135deg, #f97316, #fb923c)',
    text:     '#fb923c',
    bg:       'rgba(249,115,22,0.07)',
    border:   'rgba(249,115,22,0.18)',
    glow:     'rgba(249,115,22,0.25)',
    dot:      '#f97316',
  },
  Databases: {
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    text:     '#34d399',
    bg:       'rgba(16,185,129,0.07)',
    border:   'rgba(16,185,129,0.18)',
    glow:     'rgba(16,185,129,0.25)',
    dot:      '#10b981',
  },
  Tools: {
    gradient: 'linear-gradient(135deg, #a855f7, #c084fc)',
    text:     '#c084fc',
    bg:       'rgba(168,85,247,0.07)',
    border:   'rgba(168,85,247,0.18)',
    glow:     'rgba(168,85,247,0.25)',
    dot:      '#a855f7',
  },
};

/* ─────────────────────────────────────────────────────────────
   SVG ICONS — No emojis per UI/UX Pro Max §4
───────────────────────────────────────────────────────────── */
function SkillIcon({ icon, color }: { icon: string; color: string }) {
  const size = 20;
  const common = { width: size, height: size, fill: 'none', stroke: color, strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  // Map each skill icon key to a minimal SVG path
  const icons: Record<string, React.ReactNode> = {
    react:      <svg {...common} viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="1.5" fill={color} stroke="none"/></svg>,
    nextjs:     <svg {...common} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 8l8.5 10M16 8v8"/></svg>,
    typescript: <svg {...common} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 8v8M9 8h6M15 12.5c0-1.5-1-2.5-2.5-2.5S10 11 10 12.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5z"/></svg>,
    tailwind:   <svg {...common} viewBox="0 0 24 24"><path d="M12 6c-2 0-3.3 1-4 3 .8-1 1.7-1.4 2.7-1.1.6.2 1 .5 1.5 1C13 9.7 14 10.7 16 10.7c2 0 3.3-1 4-3-.8 1-1.7 1.4-2.7 1.1-.6-.2-1-.5-1.5-1C15 7 14 6 12 6zM8 13.3c-2 0-3.3 1-4 3 .8-1 1.7-1.4 2.7-1.1.6.2 1 .5 1.5 1 .8.8 1.8 1.8 3.8 1.8 2 0 3.3-1 4-3-.8 1-1.7 1.4-2.7 1.1-.6-.2-1-.5-1.5-1-.8-.8-1.8-1.8-3.8-1.8z"/></svg>,
    vue:        <svg {...common} viewBox="0 0 24 24"><path d="M2 3h4l6 10L18 3h4L12 21z"/><path d="M7.5 3L12 11l4.5-8"/></svg>,
    framer:     <svg {...common} viewBox="0 0 24 24"><path d="M5 3h14v7H12l7 7H5v-7h7L5 3z"/></svg>,
    nodejs:     <svg {...common} viewBox="0 0 24 24"><path d="M12 2l8.5 5v10L12 22l-8.5-5V7z"/><path d="M12 8v8M8 10l4 2 4-2"/></svg>,
    express:    <svg {...common} viewBox="0 0 24 24"><path d="M4 12h16M4 12c0-4.4 3.6-8 8-8M20 12c0 4.4-3.6 8-8 8"/><path d="M15 9l3 3-3 3"/></svg>,
    graphql:    <svg {...common} viewBox="0 0 24 24"><path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9z"/><circle cx="12" cy="3" r="1.5" fill={color} stroke="none"/><circle cx="12" cy="21" r="1.5" fill={color} stroke="none"/></svg>,
    api:        <svg {...common} viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="1.5" fill={color} stroke="none"/><circle cx="14" cy="12" r="1.5" fill={color} stroke="none"/><circle cx="10" cy="18" r="1.5" fill={color} stroke="none"/></svg>,
    python:     <svg {...common} viewBox="0 0 24 24"><path d="M12 3c-4 0-5 2-5 4v2h5v1H6c-2 0-4 1.5-4 5s2 5 4 5h2v-3c0-2 1-3 3-3h4c2 0 3-1 3-3V7c0-2-2-4-6-4z"/><circle cx="9.5" cy="6.5" r="1" fill={color} stroke="none"/></svg>,
    docker:     <svg {...common} viewBox="0 0 24 24"><rect x="2" y="10" width="20" height="10" rx="2"/><path d="M5 10V7h3v3M9 10V7h3v3M13 10V7h3v3M9 7V4h3v3"/><path d="M2 14h20"/></svg>,
    cicd:       <svg {...common} viewBox="0 0 24 24"><path d="M21 12a9 9 0 11-9-9"/><path d="M21 3v6h-6"/></svg>,
    aws:        <svg {...common} viewBox="0 0 24 24"><path d="M4 15c0 2 3 4 8 4s8-2 8-4"/><path d="M4 15V9c0-2 3-4 8-4s8 2 8 4v6"/><path d="M4 12c0 2 3 4 8 4s8-2 8-4"/></svg>,
    linux:      <svg {...common} viewBox="0 0 24 24"><path d="M12 2C9 2 7 5 7 8c0 2-.5 3-2 5s-1.5 5 1 6h12c2.5-1 2.5-4 1-6s-2-3-2-5c0-3-2-6-5-6z"/><path d="M10 14h4"/></svg>,
    mongodb:    <svg {...common} viewBox="0 0 24 24"><path d="M12 2c-1 3-4 5-4 10 0 4 2 8 4 10 2-2 4-6 4-10 0-5-3-7-4-10z"/><path d="M12 22v-3"/></svg>,
    postgresql: <svg {...common} viewBox="0 0 24 24"><ellipse cx="12" cy="7" rx="8" ry="4"/><path d="M4 7v5c0 2.2 3.6 4 8 4s8-1.8 8-4V7"/><path d="M4 12v5c0 2.2 3.6 4 8 4s8-1.8 8-4v-5"/></svg>,
    redis:      <svg {...common} viewBox="0 0 24 24"><path d="M4 9l8-4 8 4-8 4z"/><path d="M4 9v6l8 4 8-4V9"/><path d="M4 12l8 4 8-4"/></svg>,
    mysql:      <svg {...common} viewBox="0 0 24 24"><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>,
    git:        <svg {...common} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M12 9V5M6 8l4 2M12 15v3M18 16l-4-2"/></svg>,
    figma:      <svg {...common} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M6 6h3a3 3 0 010 6H6z"/><path d="M6 12h3a3 3 0 010 6H6z"/><path d="M6 18h3a3 3 0 003-3"/><path d="M12 6h3a3 3 0 010 6h-3z"/><path d="M12 3h3a3 3 0 010 6h-3z"/></svg>,
    vscode:     <svg {...common} viewBox="0 0 24 24"><path d="M17 3l4 2v14l-4 2-10-8 -4 3V8l4 3z"/><path d="M17 3L7 13l10 8"/></svg>,
    postman:    <svg {...common} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>,
  };

  return icons[icon] || (
    <svg {...common} viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="16" rx="3"/>
      <path d="M9 9h6M9 12h6M9 15h4"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   SKILL CARD — Glass card with animated bar
───────────────────────────────────────────────────────────── */
function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const barRef  = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const theme   = CATEGORY_THEME[skill.category] || CATEGORY_THEME.Tools;

  useEffect(() => {
    const bar  = barRef.current;
    const card = cardRef.current;
    if (!bar || !card) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => { bar.style.transform = `scaleX(${skill.proficiency / 100})`; }, 150 + index * 60);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(card);
    return () => obs.disconnect();
  }, [skill.proficiency, index]);

  return (
    <article
      ref={cardRef}
      className="skill-card-item"
      style={{ '--card-glow': theme.glow, '--card-border': theme.border } as React.CSSProperties}
      aria-label={`${skill.name}, ${skill.category}, ${skill.proficiency}% proficiency`}
    >
      {/* Top row — icon + name + percentage */}
      <div className="skill-card-top">
        <div className="skill-icon-wrap" style={{ background: theme.bg, borderColor: theme.border }}>
          <SkillIcon icon={skill.icon} color={theme.text} />
        </div>
        <div className="skill-card-info">
          <span className="skill-card-name">{skill.name}</span>
          <span className="skill-card-cat" style={{ color: theme.text }}>
            {skill.category}
          </span>
        </div>
        <span className="skill-card-pct" style={{ color: theme.text }}>
          {skill.proficiency}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="skill-bar-track" role="progressbar" aria-valuenow={skill.proficiency} aria-valuemin={0} aria-valuemax={100}>
        <div
          ref={barRef}
          className="skill-bar-fill"
          style={{ background: theme.gradient }}
        />
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────
   FALLBACK DATA
───────────────────────────────────────────────────────────── */
const FALLBACK_SKILLS: Skill[] = [
  { _id: '1', name: 'React',      category: 'Frontend',  proficiency: 95, icon: 'react',      isPrimary: true },
  { _id: '2', name: 'Next.js',    category: 'Frontend',  proficiency: 92, icon: 'nextjs',     isPrimary: true },
  { _id: '3', name: 'TypeScript', category: 'Frontend',  proficiency: 90, icon: 'typescript', isPrimary: true },
  { _id: '4', name: 'Node.js',    category: 'Backend',   proficiency: 92, icon: 'nodejs',     isPrimary: true },
  { _id: '5', name: 'MongoDB',    category: 'Databases', proficiency: 90, icon: 'mongodb',    isPrimary: true },
  { _id: '6', name: 'Docker',     category: 'DevOps',    proficiency: 80, icon: 'docker',     isPrimary: true },
];

/* ─────────────────────────────────────────────────────────────
   SKILLS SECTION
───────────────────────────────────────────────────────────── */
export default function Skills({ skills: propSkills }: { skills?: Skill[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const sectionRef = useScrollReveal<HTMLElement>();
  const skills     = propSkills && propSkills.length > 0 ? propSkills : FALLBACK_SKILLS;

  const categories = ['All', ...Array.from(new Set(skills.map((s) => s.category)))];
  const filtered   = activeCategory === 'All' ? skills : skills.filter((s) => s.category === activeCategory);

  // Pill indicator for category filter
  const filterListRef = useRef<HTMLDivElement>(null);
  const filterRefs    = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [filterPill, setFilterPill] = useState({ left: 0, width: 0, opacity: 0 });

  const updateFilterPill = useCallback(() => {
    const btn  = filterRefs.current.get(activeCategory);
    const list = filterListRef.current;
    if (!btn || !list) return;
    const lr = list.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    setFilterPill({ left: br.left - lr.left, width: br.width, opacity: 1 });
  }, [activeCategory]);

  useEffect(() => {
    updateFilterPill();
    window.addEventListener('resize', updateFilterPill);
    return () => window.removeEventListener('resize', updateFilterPill);
  }, [updateFilterPill]);

  return (
    <>
      <style>{`
        /* ── Section header ─────────────────────────────── */
        .skills-section-label {
          font-size: 0.8125rem;
          font-family: var(--font-mono);
          color: #818cf8;
          margin-bottom: 0.5rem;
        }
        .skills-section-title {
          font-size: clamp(1.75rem, 5vw, 2.5rem);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.025em;
          line-height: 1.15;
        }
        .skills-section-title span {
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }

        /* ── Globe + filters row ────────────────────────── */
        .skills-hero-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        @media (min-width: 1024px) {
          .skills-hero-row {
            flex-direction: row;
            gap: 2rem;
          }
        }
        .skills-globe-wrap {
          width: 180px;
          height: 180px;
          border-radius: 1.25rem;
          overflow: hidden;
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        /* ── Category filter pills ──────────────────────── */
        .skills-filter-wrap {
          position: relative;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.35rem;
          padding: 0.3rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          align-items: center;
        }
        @media (min-width: 768px) {
          .skills-filter-wrap {
            justify-content: flex-start;
            flex-wrap: nowrap;
          }
        }
        .skills-filter-pill {
          position: absolute;
          top: 50%;
          height: calc(100% - 0.4rem);
          transform: translateY(-50%);
          border-radius: 9999px;
          background: rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(99, 102, 241, 0.22);
          pointer-events: none;
          transition: left 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      width 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 0.2s ease;
        }
        .skills-filter-btn {
          position: relative;
          z-index: 1;
          padding: 0.45rem 0.875rem;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #64748b;
          border-radius: 9999px;
          border: none;
          background: transparent;
          cursor: pointer;
          white-space: nowrap;
          transition: color 0.2s;
        }
        .skills-filter-btn:hover {
          color: #cbd5e1;
        }
        .skills-filter-btn.active {
          color: #fff;
        }

        /* ── Skill cards bento grid ─────────────────────── */
        .skills-grid {
          display: grid;
          gap: 0.875rem;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
        }

        .skill-card-item {
          position: relative;
          padding: 1.125rem;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.3s ease,
                      box-shadow 0.3s ease,
                      background 0.3s ease;
          will-change: transform;
        }
        .skill-card-item:hover {
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.04);
          border-color: var(--card-border);
          box-shadow: 0 16px 48px var(--card-glow),
                      0 0 0 1px var(--card-border);
        }
        /* Touch: disable hover lift */
        @media (hover: none) {
          .skill-card-item:hover {
            transform: none;
            box-shadow: none;
          }
          .skill-card-item:active {
            background: rgba(255, 255, 255, 0.05);
            border-color: var(--card-border);
            transition-duration: 0.1s;
          }
        }

        .skill-card-top {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .skill-icon-wrap {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.625rem;
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .skill-card-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }
        .skill-card-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #f1f5f9;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .skill-card-cat {
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .skill-card-pct {
          font-size: 0.75rem;
          font-weight: 600;
          font-family: var(--font-mono);
          font-variant-numeric: tabular-nums;
          flex-shrink: 0;
        }

        /* ── Progress bar ───────────────────────────────── */
        .skill-bar-track {
          height: 3px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          overflow: hidden;
        }
        .skill-bar-fill {
          height: 100%;
          border-radius: 999px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }

        /* ── Description text ───────────────────────────── */
        .skills-description {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.6;
          max-width: 480px;
        }
        @media (max-width: 1023px) {
          .skills-description {
            text-align: center;
          }
        }
      `}</style>

      <section
        id="skills"
        ref={sectionRef}
        className="relative section-pad"
        aria-labelledby="skills-heading"
      >
        <div className="max-w-6xl mx-auto">
          {/* ── Section header ────────────────────────────── */}
          <div style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
            <p className="skills-section-label">02. what i use</p>
            <h2 id="skills-heading" className="skills-section-title">
              Skills & <span>Technologies</span>
            </h2>
          </div>

          {/* ── Globe + filter row ────────────────────────── */}
          <div className="skills-hero-row">
            {/* Globe */}
            <div className="skills-globe-wrap" aria-hidden="true">
              <LazySkillsGlobe />
            </div>

            {/* Right side: description + filter pills */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
              <p className="skills-description" style={{ display: 'none' }}>
                Hover the globe to accelerate. Click a category to filter the grid below.
              </p>

              {/* Filter pills with sliding indicator */}
              <div
                ref={filterListRef}
                className="skills-filter-wrap"
                role="tablist"
                aria-label="Filter skills by category"
              >
                {/* Sliding background pill */}
                <span
                  className="skills-filter-pill"
                  aria-hidden="true"
                  style={{
                    left:    `${filterPill.left}px`,
                    width:   `${filterPill.width}px`,
                    opacity: filterPill.opacity,
                  }}
                />

                {categories.map((cat) => (
                  <button
                    key={cat}
                    ref={(el) => { if (el) filterRefs.current.set(cat, el); }}
                    role="tab"
                    aria-selected={activeCategory === cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`skills-filter-btn${activeCategory === cat ? ' active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bento grid ────────────────────────────────── */}
          <div
            className="skills-grid"
            role="tabpanel"
            aria-label={`${activeCategory} skills`}
          >
            {filtered.map((skill, i) => (
              <SkillCard key={skill._id} skill={skill} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
