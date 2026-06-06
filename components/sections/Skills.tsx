'use client';
import { useEffect, useRef, useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { LazySkillsGlobe } from '@/components/three/LazyScene';
import type { Skill } from '@/types';

const CATEGORY_COLORS: Record<string, { glow: string; text: string; bg: string; border: string }> = {
  Frontend: { glow: 'rgba(99,102,241,0.3)', text: '#818cf8', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)' },
  Backend:  { glow: 'rgba(6,182,212,0.3)',  text: '#22d3ee', bg: 'rgba(6,182,212,0.08)',  border: 'rgba(6,182,212,0.2)' },
  DevOps:   { glow: 'rgba(249,115,22,0.3)', text: '#fb923c', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)' },
  Databases:{ glow: 'rgba(16,185,129,0.3)', text: '#34d399', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
  Tools:    { glow: 'rgba(168,85,247,0.3)', text: '#c084fc', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.2)' },
};

const SKILL_ICONS: Record<string, string> = {
  react: '⚛', nextjs: '▲', typescript: 'TS', tailwind: '💨', vue: 'V', framer: '◈',
  nodejs: '⬡', express: 'Ex', graphql: '◉', api: '⟐', python: '🐍',
  docker: '🐳', cicd: '♻', aws: '☁', linux: '🐧',
  mongodb: '🍃', postgresql: '🐘', redis: '⬤', mysql: '🐬',
  git: '⎇', figma: '◧', vscode: '{}', postman: '📮',
};

function SkillCard({ skill }: { skill: Skill }) {
  const barRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const colors = CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.Tools;

  useEffect(() => {
    const bar = barRef.current;
    const card = cardRef.current;
    if (!bar || !card) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => {
            bar.style.transform = `scaleX(${skill.proficiency / 100})`;
          }, 200);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(card);
    return () => obs.disconnect();
  }, [skill.proficiency]);

  return (
    <article
      ref={cardRef}
      className="glass-card p-5 flex flex-col gap-4 group"
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 20px 60px ${colors.glow}, 0 0 0 1px ${colors.border}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '';
      }}
      aria-label={`${skill.name}, ${skill.category}, ${skill.proficiency}% proficiency`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold select-none shrink-0"
            style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
            aria-hidden="true"
          >
            {SKILL_ICONS[skill.icon] || skill.name.slice(0, 2)}
          </div>
          <div>
            <p className="font-medium text-white text-sm">{skill.name}</p>
            <p className="text-xs" style={{ color: colors.text }}>{skill.category}</p>
          </div>
        </div>
        <span className="text-xs font-mono tabular-nums text-slate-400" aria-hidden="true">
          {skill.proficiency}%
        </span>
      </div>
      <div className="proficiency-bar" role="progressbar" aria-valuenow={skill.proficiency} aria-valuemin={0} aria-valuemax={100}>
        <div
          ref={barRef}
          className="proficiency-bar-fill"
          style={{ background: `linear-gradient(90deg, ${colors.text}, ${colors.text}99)` }}
        />
      </div>
    </article>
  );
}

const FALLBACK_SKILLS: Skill[] = [
  { _id: '1', name: 'React', category: 'Frontend', proficiency: 95, icon: 'react', isPrimary: true },
  { _id: '2', name: 'Next.js', category: 'Frontend', proficiency: 92, icon: 'nextjs', isPrimary: true },
  { _id: '3', name: 'TypeScript', category: 'Frontend', proficiency: 90, icon: 'typescript', isPrimary: true },
  { _id: '4', name: 'Node.js', category: 'Backend', proficiency: 92, icon: 'nodejs', isPrimary: true },
  { _id: '5', name: 'MongoDB', category: 'Databases', proficiency: 90, icon: 'mongodb', isPrimary: true },
  { _id: '6', name: 'Docker', category: 'DevOps', proficiency: 80, icon: 'docker', isPrimary: true },
];

export default function Skills({ skills: propSkills }: { skills?: Skill[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const sectionRef = useScrollReveal<HTMLElement>();
  const skills = propSkills && propSkills.length > 0 ? propSkills : FALLBACK_SKILLS;

  const categories = ['All', ...Array.from(new Set(skills.map((s) => s.category)))];
  const filtered = activeCategory === 'All' ? skills : skills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" ref={sectionRef} className="relative section-pad" aria-labelledby="skills-heading">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-sm font-mono text-indigo-400 mb-2" style={{ fontFamily: 'var(--font-mono)' }}>02. what i use</p>
          <h2 id="skills-heading" className="section-heading text-3xl md:text-4xl font-bold text-white">
            Skills & Technologies
          </h2>
        </div>

        {/* 3D Skills Globe + category filter row */}
        <div className="flex flex-col lg:flex-row items-center gap-8 mb-10">
          {/* Globe */}
          <div
            className="glass-card shrink-0 overflow-hidden"
            style={{ width: 200, height: 200 }}
            aria-hidden="true"
          >
            <LazySkillsGlobe />
          </div>

          {/* Filters */}
          <div className="flex-1 flex flex-col gap-4">
            <p className="text-slate-400 text-sm leading-relaxed hidden lg:block">
              Hover the globe to accelerate. Click a category to filter.
            </p>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter skills by category">
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={
                activeCategory === cat
                  ? { background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)', color: '#818cf8' }
                  : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#94a3b8' }
              }
            >
              {cat}
            </button>
          ))}
            </div>
          </div>
        </div>

        {/* Bento grid */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
          }}
          role="tabpanel"
          aria-label={`${activeCategory} skills`}
        >
          {filtered.map((skill) => (
            <SkillCard key={skill._id} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  );
}
