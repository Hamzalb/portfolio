'use client';
import { useEffect, useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Briefcase, GraduationCap, ChevronRight, MapPin, Calendar } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
interface ExperienceEntry {
  role: string;
  company: string;
  location?: string;
  period: string;
  type: 'work' | 'education';
  achievements: string[];
}

const EXPERIENCES: ExperienceEntry[] = [
  {
    role: 'Senior Full-Stack Engineer',
    company: 'TechScale Solutions',
    period: '2023 – Present',
    type: 'work',
    achievements: [
      'Led architecture of a real-time SaaS platform serving 50k+ users using Next.js and Socket.io',
      'Reduced API response times by 60% through Redis caching and query optimization',
      'Mentored 3 junior engineers, established code review practices and testing standards',
      'Shipped 12 major features with zero-downtime deployments on AWS ECS',
    ],
  },
  {
    role: 'Full-Stack Developer',
    company: 'PixelCraft Agency',
    period: '2022 – 2023',
    type: 'work',
    achievements: [
      'Delivered 8 client projects across e-commerce, SaaS, and marketing verticals',
      'Built reusable React component library reducing development time by 40%',
      'Integrated third-party APIs: Stripe, Cloudinary, SendGrid, and various REST services',
      'Improved Core Web Vitals scores to 90+ across all delivered projects',
    ],
  },
  {
    role: 'Frontend Developer (Contract)',
    company: 'Freelance',
    period: '2021 – 2022',
    type: 'work',
    achievements: [
      'Built and launched 5 web applications for startups and SMBs across MENA region',
      'Developed mobile-first designs implementing WCAG 2.1 AA accessibility standards',
      'Established CI/CD pipelines with GitHub Actions, cutting deployment time by 70%',
    ],
  },
  {
    role: 'Bachelor of Computer Science',
    company: 'Lebanese International University',
    period: '2018 – 2022',
    type: 'education',
    achievements: [
      'Graduated with High Distinction, GPA 3.8/4.0',
      'Specialization in Software Engineering and Web Technologies',
      'Capstone project: Full-stack collaborative code editor (like CodeSandbox)',
    ],
  },
];

/* ─────────────────────────────────────────────────────────────
   TIMELINE CARD
───────────────────────────────────────────────────────────── */
function TimelineCard({ entry, index }: { entry: ExperienceEntry; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isWork = entry.type === 'work';
  const Icon = isWork ? Briefcase : GraduationCap;
  const accent = isWork ? '#818cf8' : '#22d3ee';
  const accentRgb = isWork ? '99,102,241' : '6,182,212';

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    // Even index (0,2) = left-side cards → slide from left; Odd (1,3) = right-side → slide from right
    const slideX = index % 2 === 0 ? '-50px' : '50px';
    el.style.opacity = '0';
    el.style.transform = `translateX(${slideX})`;
    el.style.transition = `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${index * 0.15}s, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${index * 0.15}s`;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
        obs.disconnect();
      }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [index, reduced]);

  return (
    <div className="exp-timeline-item" role="listitem">
      {/* Timeline node */}
      <div
        className="exp-node"
        style={{
          borderColor: `rgba(${accentRgb},0.5)`,
          boxShadow: `0 0 16px rgba(${accentRgb},0.3), 0 0 0 5px rgba(${accentRgb},0.06)`,
        }}
        aria-hidden="true"
      >
        <Icon size={15} strokeWidth={2} style={{ color: accent }} />
      </div>

      {/* Card */}
      <div
        ref={ref}
        className="exp-card"
        aria-label={`${entry.role} at ${entry.company}`}
        style={{
          '--accent': accent,
          '--accent-rgb': accentRgb,
        } as React.CSSProperties}
      >
        {/* Gradient accent top bar */}
        <div className="exp-card-accent" style={{
          background: isWork
            ? 'linear-gradient(90deg, #6366f1, #818cf8, #6366f1)'
            : 'linear-gradient(90deg, #06b6d4, #22d3ee, #06b6d4)',
        }} />

        {/* Type badge */}
        <div className="exp-type-badge" style={{
          color: accent,
          background: `rgba(${accentRgb},0.08)`,
          borderColor: `rgba(${accentRgb},0.2)`,
        }}>
          <Icon size={11} strokeWidth={2.5} />
          {isWork ? 'Work' : 'Education'}
        </div>

        {/* Header */}
        <div className="exp-card-header">
          <h3 className="exp-role">{entry.role}</h3>
          <div className="exp-meta">
            <span className="exp-company" style={{ color: accent }}>
              {entry.company}
            </span>
            <span className="exp-meta-sep" aria-hidden="true">·</span>
            <span className="exp-period-inline">
              <Calendar size={12} strokeWidth={2} aria-hidden="true" />
              {entry.period}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="exp-divider" style={{
          background: `linear-gradient(90deg, rgba(${accentRgb},0.2), rgba(${accentRgb},0.05))`,
        }} />

        {/* Achievements */}
        <ul className="exp-achievements" role="list">
          {entry.achievements.map((ach, i) => (
            <li key={i} className="exp-ach-item">
              <span className="exp-ach-icon" style={{ color: accent }}>
                <ChevronRight size={13} strokeWidth={2.5} />
              </span>
              <span>{ach}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   EXPERIENCE SECTION
───────────────────────────────────────────────────────────── */
export default function Experience() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const lineRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const line = lineRef.current;
    if (!line || reduced) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        line.style.transform = 'scaleY(1)';
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(line.parentElement!);
    return () => obs.disconnect();
  }, [reduced]);

  return (
    <>
      <style>{`
        /* ── Section header ─────────────────────────────── */
        .exp-label {
          font-size: 0.8125rem;
          font-family: var(--font-mono);
          color: #818cf8;
          margin-bottom: 0.5rem;
          letter-spacing: 0.04em;
        }
        .exp-title {
          font-size: clamp(1.75rem, 5vw, 2.5rem);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.025em;
          line-height: 1.15;
        }
        .exp-title span {
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }

        /* ── Timeline container ─────────────────────────── */
        .exp-timeline {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: clamp(2rem, 4vw, 3rem);
        }

        /* Vertical line */
        .exp-line {
          position: absolute;
          left: 19px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 1px;
        }
        @media (min-width: 768px) {
          .exp-line {
            left: 50%;
            transform: translateX(-50%);
          }
        }
        .exp-line-fill {
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, #6366f1 0%, #a78bfa 40%, #06b6d4 100%);
          transform-origin: top;
          transform: scaleY(0);
          transition: transform 1.8s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }

        /* ── Timeline item ──────────────────────────────── */
        .exp-timeline-item {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          padding-left: 3.25rem;
        }
        @media (min-width: 768px) {
          .exp-timeline-item {
            padding-left: 0;
          }
          /* Even children = left-side cards (1st, 3rd entry — offset by .exp-line being child 1) */
          .exp-timeline-item:nth-child(even) {
            justify-content: flex-start;
            flex-direction: row-reverse;
            padding-right: calc(50% + 2rem);
          }
          .exp-timeline-item:nth-child(even) .exp-card {
            text-align: left;
          }
          .exp-timeline-item:nth-child(even) .exp-card-header {
            align-items: flex-start;
          }
          .exp-timeline-item:nth-child(even) .exp-meta {
            justify-content: flex-start;
          }
          .exp-timeline-item:nth-child(even) .exp-ach-item {
            flex-direction: row;
            text-align: left;
          }
          /* Odd children = right-side cards (2nd, 4th entry) — text left-aligned */
          .exp-timeline-item:nth-child(odd) {
            justify-content: flex-end;
            padding-left: calc(50% + 2rem);
          }
          .exp-timeline-item:nth-child(odd) .exp-card {
            text-align: left;
          }
          .exp-timeline-item:nth-child(odd) .exp-card-header {
            align-items: flex-start;
          }
          .exp-timeline-item:nth-child(odd) .exp-meta {
            justify-content: flex-start;
          }
          .exp-timeline-item:nth-child(odd) .exp-ach-item {
            flex-direction: row;
            text-align: left;
          }
        }

        /* ── Node (icon circle) ─────────────────────────── */
        .exp-node {
          position: absolute;
          left: 6px;
          top: 1.5rem;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          border: 2px solid;
          background: #0a0a14;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          flex-shrink: 0;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.3s ease;
        }
        @media (hover: hover) and (pointer: fine) {
          .exp-timeline-item:hover .exp-node {
            transform: scale(1.18);
          }
        }
        @media (min-width: 768px) {
          .exp-node {
            left: 50%;
            transform: translateX(-50%);
          }
          @media (hover: hover) and (pointer: fine) {
            .exp-timeline-item:hover .exp-node {
              transform: translateX(-50%) scale(1.18);
            }
          }
        }

        /* ── Card ────────────────────────────────────────── */
        .exp-card {
          position: relative;
          width: 100%;
          padding: 1.5rem;
          padding-top: 2rem;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.3s ease,
                      box-shadow 0.3s ease;
          will-change: transform;
        }
        @media (hover: hover) and (pointer: fine) {
          .exp-card:hover {
            transform: translateY(-4px);
            border-color: rgba(var(--accent-rgb, 99,102,241), 0.25);
            box-shadow: 0 20px 60px rgba(var(--accent-rgb, 99,102,241), 0.12),
                        0 0 0 1px rgba(var(--accent-rgb, 99,102,241), 0.08),
                        inset 0 1px 0 rgba(255,255,255,0.04);
          }
          .exp-card:hover .exp-ach-icon {
            transform: translateX(2px);
          }
        }
        @media (hover: none) {
          .exp-card:active {
            border-color: rgba(var(--accent-rgb, 99,102,241), 0.25);
            transition-duration: 0.1s;
          }
        }
        @media (min-width: 768px) {
          .exp-card {
            width: 100%;
          }
        }

        /* Gradient accent bar at top of card */
        .exp-card-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }
        @media (hover: hover) and (pointer: fine) {
          .exp-card:hover .exp-card-accent {
            opacity: 1;
          }
        }

        /* Type badge */
        .exp-type-badge {
          position: absolute;
          top: 0.75rem;
          left: 1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.2rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.625rem;
          font-weight: 700;
          font-family: var(--font-mono);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border: 1px solid;
          line-height: 1;
        }

        /* ── Card header ────────────────────────────────── */
        .exp-card-header {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          margin-bottom: 0.875rem;
          margin-top: 0.5rem;
        }
        .exp-role {
          font-size: 1rem;
          font-weight: 700;
          color: #f1f5f9;
          line-height: 1.35;
          letter-spacing: -0.015em;
        }
        @media (min-width: 640px) {
          .exp-role {
            font-size: 1.0625rem;
          }
        }
        .exp-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .exp-company {
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.01em;
        }
        .exp-meta-sep {
          color: rgba(255,255,255,0.15);
          font-size: 0.75rem;
        }
        .exp-period-inline {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: #64748b;
          font-weight: 500;
        }

        /* Divider */
        .exp-divider {
          height: 1px;
          margin-bottom: 0.875rem;
          border-radius: 1px;
        }

        /* ── Achievements ───────────────────────────────── */
        .exp-achievements {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .exp-ach-item {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          font-size: 0.8125rem;
          color: #94a3b8;
          line-height: 1.65;
        }
        .exp-ach-icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          margin-top: 0.2rem;
          transition: transform 0.25s cubic-bezier(0.16,1,0.3,1);
        }

        /* ── Responsive card width tweak ────────────────── */
        @media (max-width: 767px) {
          .exp-type-badge {
            position: relative;
            top: auto;
            left: auto;
            margin-bottom: 0.5rem;
            width: fit-content;
          }
          .exp-card {
            padding-top: 1.25rem;
          }
        }
      `}</style>

      <section
        id="experience"
        ref={sectionRef}
        className="relative section-pad"
        aria-labelledby="experience-heading"
      >
        <div className="max-w-5xl mx-auto">
          {/* ── Header ────────────────────────────────────── */}
          <div style={{ marginBottom: 'clamp(2rem, 4vw, 3.5rem)' }}>
            <p className="exp-label">04. my journey</p>
            <h2 id="experience-heading" className="exp-title">
              Experience & <span>Education</span>
            </h2>
          </div>

          {/* ── Timeline ──────────────────────────────────── */}
          <div className="exp-timeline" role="list" aria-label="Experience timeline">
            {/* Vertical line */}
            <div className="exp-line" aria-hidden="true">
              <div ref={lineRef} className="exp-line-fill" />
            </div>

            {EXPERIENCES.map((entry, i) => (
              <TimelineCard key={i} entry={entry} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
