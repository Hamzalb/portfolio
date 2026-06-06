'use client';
import { useEffect, useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Briefcase, GraduationCap } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
interface ExperienceEntry {
  role: string;
  company: string;
  companyUrl?: string;
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

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s`;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        obs.disconnect();
      }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [index, reduced]);

  return (
    <div className="exp-timeline-item" role="listitem">
      {/* Timeline node — icon inside circle */}
      <div
        className="exp-node"
        style={{
          borderColor: isWork ? 'rgba(99,102,241,0.5)' : 'rgba(6,182,212,0.5)',
          boxShadow: isWork
            ? '0 0 12px rgba(99,102,241,0.3), 0 0 0 4px rgba(99,102,241,0.08)'
            : '0 0 12px rgba(6,182,212,0.3), 0 0 0 4px rgba(6,182,212,0.08)',
        }}
        aria-hidden="true"
      >
        <Icon size={14} strokeWidth={2} style={{ color: isWork ? '#818cf8' : '#22d3ee' }} />
      </div>

      {/* Card */}
      <div ref={ref} className="exp-card" aria-label={`${entry.role} at ${entry.company}`}>
        {/* Header row */}
        <div className="exp-card-header">
          <div className="exp-card-titles">
            <h3 className="exp-role">{entry.role}</h3>
            <p className="exp-company" style={{ color: isWork ? '#818cf8' : '#22d3ee' }}>
              {entry.company}
            </p>
          </div>
          <span
            className="exp-period"
            style={{
              color: isWork ? '#818cf8' : '#22d3ee',
              background: isWork ? 'rgba(99,102,241,0.08)' : 'rgba(6,182,212,0.08)',
              borderColor: isWork ? 'rgba(99,102,241,0.18)' : 'rgba(6,182,212,0.18)',
            }}
          >
            {entry.period}
          </span>
        </div>

        {/* Achievements */}
        <ul className="exp-achievements" role="list">
          {entry.achievements.map((ach, i) => (
            <li key={i} className="exp-ach-item">
              <span
                className="exp-ach-dot"
                style={{ background: isWork ? '#6366f1' : '#06b6d4' }}
                aria-hidden="true"
              />
              {ach}
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
          background: rgba(255, 255, 255, 0.05);
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
          background: linear-gradient(180deg, #6366f1, #06b6d4);
          transform-origin: top;
          transform: scaleY(0);
          transition: transform 1.6s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }

        /* ── Timeline item ──────────────────────────────── */
        .exp-timeline-item {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          padding-left: 3rem;
        }
        @media (min-width: 768px) {
          .exp-timeline-item {
            padding-left: 0;
            justify-content: center;
          }
          .exp-timeline-item:nth-child(odd) {
            flex-direction: row-reverse;
          }
        }

        /* ── Node (icon circle) ─────────────────────────── */
        .exp-node {
          position: absolute;
          left: 8px;
          top: 1.25rem;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
          border: 2px solid;
          background: #0a0a0f;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          flex-shrink: 0;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .exp-timeline-item:hover .exp-node {
          transform: scale(1.15);
        }
        @media (min-width: 768px) {
          .exp-node {
            left: 50%;
            transform: translateX(-50%);
          }
          .exp-timeline-item:hover .exp-node {
            transform: translateX(-50%) scale(1.15);
          }
        }

        /* ── Card ────────────────────────────────────────── */
        .exp-card {
          width: 100%;
          padding: 1.25rem;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.3s ease,
                      box-shadow 0.3s ease;
          will-change: transform;
        }
        .exp-card:hover {
          transform: translateY(-3px);
          border-color: rgba(99, 102, 241, 0.18);
          box-shadow: 0 16px 48px rgba(99, 102, 241, 0.1),
                      0 0 0 1px rgba(99, 102, 241, 0.08);
        }
        @media (hover: none) {
          .exp-card:hover { transform: none; box-shadow: none; }
          .exp-card:active {
            border-color: rgba(99, 102, 241, 0.2);
            transition-duration: 0.1s;
          }
        }
        @media (min-width: 768px) {
          .exp-card {
            width: calc(50% - 2.75rem);
          }
        }

        /* ── Card header ────────────────────────────────── */
        .exp-card-header {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        @media (min-width: 480px) {
          .exp-card-header {
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
            gap: 0.75rem;
          }
        }
        .exp-card-titles {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          min-width: 0;
        }
        .exp-role {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #f1f5f9;
          line-height: 1.35;
          letter-spacing: -0.01em;
        }
        .exp-company {
          font-size: 0.8125rem;
          font-weight: 600;
        }
        .exp-period {
          flex-shrink: 0;
          align-self: flex-start;
          padding: 0.25rem 0.625rem;
          border-radius: 9999px;
          font-size: 0.6875rem;
          font-weight: 600;
          font-family: var(--font-mono);
          border: 1px solid;
          white-space: nowrap;
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
          gap: 0.625rem;
          font-size: 0.8125rem;
          color: #94a3b8;
          line-height: 1.6;
        }
        .exp-ach-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 0.45rem;
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
