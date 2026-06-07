'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { ExternalLink, Github, Star, ArrowUpRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { Project } from '@/types';

/* ─────────────────────────────────────────────────────────────
   FILTERS
───────────────────────────────────────────────────────────── */
const FILTERS = ['All', 'Frontend', 'Full-Stack', 'API'] as const;
type Filter = (typeof FILTERS)[number];

/* ─────────────────────────────────────────────────────────────
   FALLBACK DATA
───────────────────────────────────────────────────────────── */
const FALLBACK_PROJECTS: Project[] = [
  {
    _id: '1', title: 'DevFlow – Project Management SaaS', featured: true, category: 'Full-Stack',
    description: 'A real-time collaborative project management platform with boards, sprints, and analytics.',
    techStack: ['Next.js', 'TypeScript', 'Socket.io', 'PostgreSQL'],
    liveUrl: '#', repoUrl: '#',
    coverGradient: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#0891b2 100%)',
    order: 1,
  },
  {
    _id: '2', title: 'Luminary UI – Component Library', featured: true, category: 'Frontend',
    description: 'An accessible, themeable React component library with 60+ components and full TypeScript definitions.',
    techStack: ['React', 'TypeScript', 'Storybook', 'Rollup'],
    liveUrl: '#', repoUrl: '#',
    coverGradient: 'linear-gradient(135deg,#0891b2 0%,#2563eb 50%,#4f46e5 100%)',
    order: 2,
  },
  {
    _id: '3', title: 'NexaAPI – REST & GraphQL Gateway', featured: true, category: 'API',
    description: 'A high-performance API gateway with JWT auth, rate limiting, and OpenAPI docs generation.',
    techStack: ['Node.js', 'GraphQL', 'Redis', 'MongoDB'],
    liveUrl: '', repoUrl: '#',
    coverGradient: 'linear-gradient(135deg,#059669 0%,#0d9488 50%,#0891b2 100%)',
    order: 3,
  },
  {
    _id: '4', title: 'PulseStore – E-Commerce Platform', featured: false, category: 'Full-Stack',
    description: 'Full-featured e-commerce with Stripe payments, inventory management, and SSR for SEO.',
    techStack: ['Next.js', 'Stripe', 'MongoDB', 'Redux'],
    liveUrl: '#', repoUrl: '#',
    coverGradient: 'linear-gradient(135deg,#ea580c 0%,#ec4899 50%,#e11d48 100%)',
    order: 4,
  },
  {
    _id: '5', title: 'Chartify – Data Visualization', featured: false, category: 'Frontend',
    description: 'Interactive analytics dashboard with 20+ chart types and real-time data streaming.',
    techStack: ['React', 'D3.js', 'TypeScript', 'WebSockets'],
    liveUrl: '#', repoUrl: '#',
    coverGradient: 'linear-gradient(135deg,#7c3aed 0%,#4f46e5 50%,#2563eb 100%)',
    order: 5,
  },
  {
    _id: '6', title: 'AuthVault – Identity Service', featured: false, category: 'API',
    description: 'Production-grade authentication microservice with OAuth2, TOTP 2FA, and audit logging.',
    techStack: ['Node.js', 'PostgreSQL', 'Redis', 'OAuth2'],
    liveUrl: '', repoUrl: '#',
    coverGradient: 'linear-gradient(135deg,#334155 0%,#1e293b 50%,#0f172a 100%)',
    order: 6,
  },
  {
    _id: '7', title: 'Yalla Nbadel – Bartering Marketplace', featured: true, category: 'Full-Stack',
    description: 'A peer-to-peer bartering platform where users exchange goods and services without money. Features verified profiles, built-in messaging, and category-based browsing.',
    techStack: ['Next.js', 'React', 'TypeScript', 'Node.js'],
    liveUrl: 'https://senior-frontend-murex.vercel.app/', repoUrl: '',
    coverGradient: 'linear-gradient(135deg,#f59e0b 0%,#ea580c 50%,#dc2626 100%)',
    previewUrl: 'https://senior-frontend-murex.vercel.app/',
    order: 7,
  },
];

/* ─────────────────────────────────────────────────────────────
   PROJECT CARD
───────────────────────────────────────────────────────────── */
function ProjectCard({ project }: { project: Project }) {
  const coverRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.25);

  // Use previewUrl if set, otherwise use liveUrl if it's a real URL
  const previewSrc = project.previewUrl
    || (project.liveUrl && project.liveUrl !== '#' ? project.liveUrl : '');

  useEffect(() => {
    if (!previewSrc || !coverRef.current) return;
    const update = () => {
      if (coverRef.current) {
        setPreviewScale(coverRef.current.offsetWidth / 1440);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [previewSrc]);

  return (
    <article className="proj-card" aria-label={`Project: ${project.title}`}>
      {/* Cover — live preview or gradient */}
      {previewSrc ? (
        <div ref={coverRef} className="proj-cover proj-cover-preview" aria-hidden="true">
          <iframe
            src={previewSrc}
            className="proj-preview-iframe"
            style={{ transform: `scale(${previewScale})` }}
            title={`Preview of ${project.title}`}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
            tabIndex={-1}
          />
          {project.featured && (
            <div className="proj-featured-badge">
              <Star size={10} fill="currentColor" aria-hidden="true" />
              Featured
            </div>
          )}
          <span className="proj-category-pill">{project.category}</span>
        </div>
      ) : (
        <div ref={coverRef} className="proj-cover" style={{ background: project.coverGradient }} aria-hidden="true">
          <span className="proj-cover-mono">
            {project.title.split('–')[0].trim().slice(0, 2)}
          </span>
          {project.featured && (
            <div className="proj-featured-badge">
              <Star size={10} fill="currentColor" aria-hidden="true" />
              Featured
            </div>
          )}
          <span className="proj-category-pill">{project.category}</span>
        </div>
      )}

      {/* Body */}
      <div className="proj-body">
        <h3 className="proj-title">{project.title}</h3>
        <p className="proj-desc">{project.description}</p>

        {/* Tech stack */}
        <div className="proj-tech-row" role="list" aria-label="Technologies used">
          {project.techStack.map((tech) => (
            <span key={tech} role="listitem" className="proj-tech-chip">
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="proj-links">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View live demo of ${project.title}`}
              className="proj-link proj-link-primary"
            >
              <ExternalLink size={13} aria-hidden="true" />
              Live Demo
              <ArrowUpRight size={11} strokeWidth={2.5} aria-hidden="true" />
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View source code of ${project.title}`}
              className="proj-link proj-link-secondary"
            >
              <Github size={13} aria-hidden="true" />
              Source
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="proj-card" aria-hidden="true" style={{ pointerEvents: 'none' }}>
      <div className="proj-cover" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <div style={{ position: 'absolute', inset: 0, animation: 'pulse 2s ease-in-out infinite', background: 'rgba(255,255,255,0.02)' }} />
      </div>
      <div className="proj-body" style={{ gap: '0.75rem' }}>
        <div style={{ height: 16, width: '70%', borderRadius: 6, background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ height: 12, width: '100%', borderRadius: 4, background: 'rgba(255,255,255,0.03)' }} />
        <div style={{ height: 12, width: '85%', borderRadius: 4, background: 'rgba(255,255,255,0.03)' }} />
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          <div style={{ height: 20, width: 48, borderRadius: 4, background: 'rgba(255,255,255,0.03)' }} />
          <div style={{ height: 20, width: 48, borderRadius: 4, background: 'rgba(255,255,255,0.03)' }} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PROJECTS SECTION
───────────────────────────────────────────────────────────── */
export default function Projects({ projects: propProjects, loading }: { projects?: Project[]; loading?: boolean }) {
  const [filter, setFilter] = useState<Filter>('All');
  const sectionRef = useScrollReveal<HTMLElement>();
  const projects = propProjects && propProjects.length > 0 ? propProjects : FALLBACK_PROJECTS;
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  // Sliding pill for filter tabs
  const filterListRef = useRef<HTMLDivElement>(null);
  const filterRefs    = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [pill, setPill] = useState({ left: 0, width: 0, opacity: 0 });

  const updatePill = useCallback(() => {
    const btn  = filterRefs.current.get(filter);
    const list = filterListRef.current;
    if (!btn || !list) return;
    const lr = list.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    setPill({ left: br.left - lr.left, width: br.width, opacity: 1 });
  }, [filter]);

  useEffect(() => {
    updatePill();
    window.addEventListener('resize', updatePill);
    return () => window.removeEventListener('resize', updatePill);
  }, [updatePill]);

  return (
    <>
      <style>{`
        /* ── Section header ─────────────────────────────── */
        .proj-label {
          font-size: 0.8125rem;
          font-family: var(--font-mono);
          color: #818cf8;
          margin-bottom: 0.5rem;
        }
        .proj-heading {
          font-size: clamp(1.75rem, 5vw, 2.5rem);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.025em;
          line-height: 1.15;
        }
        .proj-heading span {
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }

        /* ── Filter pills ───────────────────────────────── */
        .proj-filter-wrap {
          position: relative;
          display: inline-flex;
          flex-wrap: wrap;
          gap: 0.3rem;
          padding: 0.3rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          margin-bottom: clamp(2rem, 4vw, 2.5rem);
        }
        .proj-filter-pill {
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
        .proj-filter-btn {
          position: relative;
          z-index: 1;
          padding: 0.45rem 0.9rem;
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
        .proj-filter-btn:hover { color: #cbd5e1; }
        .proj-filter-btn.active { color: #fff; }

        /* ── Project grid ───────────────────────────────── */
        .proj-grid {
          display: grid;
          gap: 1.25rem;
          grid-template-columns: 1fr;
        }
        @media (min-width: 640px) {
          .proj-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .proj-grid { grid-template-columns: repeat(3, 1fr); }
        }

        /* ── Project card ───────────────────────────────── */
        .proj-card {
          position: relative;
          border-radius: 1.125rem;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.35s ease,
                      box-shadow 0.35s ease;
          will-change: transform;
        }
        .proj-card:hover {
          transform: translateY(-5px);
          border-color: rgba(99, 102, 241, 0.2);
          box-shadow: 0 20px 60px rgba(99, 102, 241, 0.14),
                      0 0 0 1px rgba(99, 102, 241, 0.1);
        }
        @media (hover: none) {
          .proj-card:hover { transform: none; box-shadow: none; }
          .proj-card:active {
            border-color: rgba(99, 102, 241, 0.2);
            transition-duration: 0.1s;
          }
        }

        /* Cover */
        .proj-cover {
          position: relative;
          height: 10.5rem;
          overflow: hidden;
          transition: filter 0.35s ease;
        }
        .proj-card:hover .proj-cover {
          filter: brightness(1.12) saturate(1.1);
        }
        /* Live preview cover */
        .proj-cover-preview {
          background: #0a0a14;
          pointer-events: none;
        }
        .proj-preview-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 1440px;
          height: 900px;
          border: none;
          pointer-events: none;
          /* scale factor = cover width / 1440. Since cover = 100% of card,
             we use a CSS trick: scale to fill via container query fallback */
          transform-origin: top left;
          transform: scale(var(--preview-scale, 0.25));
        }

        .proj-cover-mono {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.08);
          text-transform: uppercase;
          letter-spacing: -0.04em;
          user-select: none;
          pointer-events: none;
        }

        /* Featured badge */
        .proj-featured-badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.3rem 0.6rem;
          border-radius: 0.5rem;
          font-size: 0.6875rem;
          font-weight: 600;
          color: #fbbf24;
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.3);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        /* Category pill — overlapping cover bottom */
        .proj-category-pill {
          position: absolute;
          bottom: -0.625rem;
          right: 0.875rem;
          padding: 0.25rem 0.625rem;
          border-radius: 9999px;
          font-size: 0.6875rem;
          font-weight: 600;
          color: #818cf8;
          background: rgba(15, 15, 26, 0.9);
          border: 1px solid rgba(99, 102, 241, 0.2);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 2;
        }

        /* Body */
        .proj-body {
          padding: 1.25rem;
          padding-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          flex: 1;
        }
        .proj-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #f1f5f9;
          line-height: 1.35;
          letter-spacing: -0.01em;
        }
        .proj-desc {
          font-size: 0.8125rem;
          color: #64748b;
          line-height: 1.6;
        }

        /* Tech chips */
        .proj-tech-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-top: 0.25rem;
        }
        .proj-tech-chip {
          padding: 0.2rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.6875rem;
          font-weight: 500;
          font-family: var(--font-mono);
          color: #94a3b8;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: border-color 0.2s, color 0.2s;
        }
        .proj-card:hover .proj-tech-chip {
          border-color: rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
        }

        /* Links row */
        .proj-links {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: auto;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }
        .proj-link {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          border-radius: 0.375rem;
          padding: 0.3rem 0.5rem;
          transition: color 0.2s, background 0.2s;
        }
        .proj-link-primary {
          color: #818cf8;
        }
        .proj-link-primary:hover {
          color: #a5b4fc;
          background: rgba(99, 102, 241, 0.08);
        }
        .proj-link-primary svg:last-child {
          transition: transform 0.2s;
        }
        .proj-link-primary:hover svg:last-child {
          transform: translate(1px, -1px);
        }
        .proj-link-secondary {
          color: #64748b;
        }
        .proj-link-secondary:hover {
          color: #cbd5e1;
          background: rgba(255, 255, 255, 0.04);
        }

        /* Empty state */
        .proj-empty {
          text-align: center;
          color: #475569;
          padding: 4rem 1rem;
          font-size: 0.875rem;
        }

        /* Pulse for skeleton */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <section
        id="projects"
        ref={sectionRef}
        className="relative section-pad"
        aria-labelledby="projects-heading"
      >
        <div className="max-w-6xl mx-auto">
          {/* ── Header ────────────────────────────────────── */}
          <div style={{ marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
            <p className="proj-label">03. what i&apos;ve built</p>
            <h2 id="projects-heading" className="proj-heading">
              Selected <span>Projects</span>
            </h2>
          </div>

          {/* ── Filter tabs with sliding pill ─────────────── */}
          <div
            ref={filterListRef}
            className="proj-filter-wrap"
            role="tablist"
            aria-label="Filter projects by category"
          >
            {/* Sliding indicator */}
            <span
              className="proj-filter-pill"
              aria-hidden="true"
              style={{
                left:    `${pill.left}px`,
                width:   `${pill.width}px`,
                opacity: pill.opacity,
              }}
            />

            {FILTERS.map((f) => (
              <button
                key={f}
                ref={(el) => { if (el) filterRefs.current.set(f, el); }}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={`proj-filter-btn${filter === f ? ' active' : ''}`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* ── Grid ──────────────────────────────────────── */}
          <div className="proj-grid" role="tabpanel" aria-label={`${filter} projects`}>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : filtered.map((project) => <ProjectCard key={project._id} project={project} />)}
          </div>

          {!loading && filtered.length === 0 && (
            <p className="proj-empty">No projects in this category yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
