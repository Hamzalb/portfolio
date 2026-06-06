'use client';
import { useEffect, useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';

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

function TimelineCard({ entry, index }: { entry: ExperienceEntry; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isLeft = index % 2 === 0;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    el.style.opacity = '0';
    el.style.transform = `translateX(${isLeft ? '-24px' : '24px'})`;
    el.style.transition = `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s`;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [isLeft, index, reduced]);

  return (
    <div
      className={`relative flex items-start gap-8 ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      } flex-row`}
    >
      {/* Card */}
      <div
        ref={ref}
        className="glass-card p-4 sm:p-6 md:w-[calc(50%-2.5rem)] w-full ml-9 md:ml-0"
        aria-label={`${entry.role} at ${entry.company}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-1">
          <div>
            <h3 className="font-semibold text-white text-sm sm:text-base">{entry.role}</h3>
            <p className="text-indigo-400 text-xs sm:text-sm font-medium">{entry.company}</p>
          </div>
          <span
            className="self-start sm:shrink-0 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap"
            style={
              entry.type === 'work'
                ? { background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8' }
                : { background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#22d3ee' }
            }
          >
            {entry.period}
          </span>
        </div>
        <ul className="mt-4 space-y-2" role="list">
          {entry.achievements.map((ach, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-400 leading-relaxed">
              <span className="text-indigo-400 shrink-0 mt-0.5" aria-hidden="true">▸</span>
              {ach}
            </li>
          ))}
        </ul>
      </div>

      {/* Center dot — aligned to timeline-line (left:20px on mobile → dot centre at 20px) */}
      <div
        className="absolute left-[12px] md:left-1/2 md:-translate-x-1/2 top-6 w-4 h-4 rounded-full border-2 border-indigo-500 shrink-0"
        style={{ background: '#0a0a0f', zIndex: 2 }}
        aria-hidden="true"
      />

      {/* Spacer for alternating layout */}
      <div className="hidden md:block md:w-[calc(50%-2.5rem)]" />
    </div>
  );
}

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
    <section id="experience" ref={sectionRef} className="relative section-pad" aria-labelledby="experience-heading">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <p className="text-sm font-mono text-indigo-400 mb-2" style={{ fontFamily: 'var(--font-mono)' }}>04. my journey</p>
          <h2 id="experience-heading" className="section-heading text-3xl md:text-4xl font-bold text-white">
            Experience
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="timeline-line">
            <div
              ref={lineRef}
              className="timeline-line-fill"
              style={{ height: '100%' }}
              aria-hidden="true"
            />
          </div>

          <div className="flex flex-col gap-12" role="list" aria-label="Experience timeline">
            {EXPERIENCES.map((entry, i) => (
              <div key={i} role="listitem">
                <TimelineCard entry={entry} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
