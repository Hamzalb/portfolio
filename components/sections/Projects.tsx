'use client';
import { useState } from 'react';
import { ExternalLink, Github, Star } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { Project } from '@/types';

const FILTERS = ['All', 'Frontend', 'Full-Stack', 'API'] as const;
type Filter = (typeof FILTERS)[number];

// CSS gradient strings (not Tailwind classes — avoids purge issue with dynamic classes)
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
];

function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="glass-card overflow-hidden cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={
        hovered
          ? { transform: 'translateY(-6px) scale(1.01)', boxShadow: '0 24px 64px rgba(99,102,241,0.2)' }
          : { transform: 'translateY(0) scale(1)', boxShadow: 'none' }
      }
      aria-label={`Project: ${project.title}`}
    >
      {/* Cover — uses inline gradient (always works in prod) */}
      <div
        className="relative h-44 overflow-hidden"
        style={{
          background: project.coverGradient,
          transition: 'filter 0.3s',
          filter: hovered ? 'brightness(1.1)' : 'brightness(1)',
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl font-black text-white/10 select-none tracking-tighter uppercase">
            {project.title.split(' ')[0].slice(0, 2)}
          </span>
        </div>
        {project.featured && (
          <div
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-amber-300"
            style={{ background: 'rgba(245,158,11,0.18)', border: '1px solid rgba(245,158,11,0.35)' }}
          >
            <Star size={10} fill="currentColor" aria-hidden="true" />
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-4">
        <div>
          <h3 className="font-semibold text-white mb-2 text-base leading-snug">{project.title}</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{project.description}</p>
        </div>

        {/* Tech stack badges */}
        <div className="flex flex-wrap gap-1.5" role="list" aria-label="Technologies used">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              role="listitem"
              className="px-2.5 py-0.5 rounded-md text-xs font-medium text-slate-300"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 mt-auto pt-2 border-t border-white/5">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View live demo of ${project.title}`}
              className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <ExternalLink size={13} aria-hidden="true" />
              Live Demo
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View source code of ${project.title} on GitHub`}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Github size={13} aria-hidden="true" />
              Source
            </a>
          )}
          <span
            className="ml-auto text-xs px-2.5 py-0.5 rounded-full"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8' }}
          >
            {project.category}
          </span>
        </div>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="glass-card overflow-hidden animate-pulse" aria-hidden="true">
      <div className="h-44" style={{ background: 'rgba(255,255,255,0.04)' }} />
      <div className="p-5 space-y-3">
        <div className="h-4 rounded w-3/4" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="h-3 rounded w-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="h-3 rounded w-5/6" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="flex gap-2 mt-3">
          <div className="h-5 w-14 rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
          <div className="h-5 w-14 rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
        </div>
      </div>
    </div>
  );
}

export default function Projects({ projects: propProjects, loading }: { projects?: Project[]; loading?: boolean }) {
  const [filter, setFilter] = useState<Filter>('All');
  const sectionRef = useScrollReveal<HTMLElement>();
  const projects = propProjects && propProjects.length > 0 ? propProjects : FALLBACK_PROJECTS;

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" ref={sectionRef} className="relative section-pad" aria-labelledby="projects-heading">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-sm font-mono text-indigo-400 mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
            03. what i&apos;ve built
          </p>
          <h2 id="projects-heading" className="section-heading text-3xl md:text-4xl font-bold text-white">
            Selected Projects
          </h2>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Filter projects by category">
          {FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={
                filter === f
                  ? { background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)', color: '#818cf8' }
                  : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#94a3b8' }
              }
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          role="tabpanel"
          aria-label={`${filter} projects`}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map((project) => <ProjectCard key={project._id} project={project} />)}
        </div>

        {!loading && filtered.length === 0 && (
          <p className="text-center text-slate-500 py-16">No projects in this category yet.</p>
        )}
      </div>
    </section>
  );
}
