'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import api from '@/lib/api';
import type { Project, Skill } from '@/types';

// HeroSection — Canvas 2D background + hero content. R3F/WebGPU overlay
// is loaded inside it only when a GPU adapter is available, so no R3F
// module evaluation crash on machines without WebGPU.
const HeroSection = dynamic(
  () => import('@/components/ui/HeroSection'),
  { ssr: false, loading: () => null },
);

// Whobee — small fixed mascot in the bottom-right corner; persists across scroll.
const FloatingWhobee = dynamic(
  () => import('@/components/three/FloatingWhobee'),
  { ssr: false, loading: () => null },
);

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [skillsLoading, setSkillsLoading] = useState(true);

  useEffect(() => {
    api.get<{ success: boolean; data?: Project[] }>('/api/projects')
      .then((res) => { if (res.data.success) setProjects(res.data.data ?? []); })
      .catch(() => {})
      .finally(() => setProjectsLoading(false));

    api.get<{ success: boolean; data?: Skill[] }>('/api/skills')
      .then((res) => { if (res.data.success) setSkills(res.data.data ?? []); })
      .catch(() => {})
      .finally(() => setSkillsLoading(false));
  }, []);

  return (
    <main id="main-content" tabIndex={-1}>
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:text-white focus:text-sm"
        style={{ background: '#6366f1' }}
      >
        Skip to main content
      </a>

      {/* ── Hero — Canvas 2D bg + optional WebGPU overlay ────────── */}
      <HeroSection />

      <ErrorBoundary>
        <About />
      </ErrorBoundary>

      <ErrorBoundary>
        <Skills skills={skillsLoading ? [] : skills} />
      </ErrorBoundary>

      <ErrorBoundary>
        <Projects projects={projectsLoading ? [] : projects} loading={projectsLoading} />
      </ErrorBoundary>

      <ErrorBoundary>
        <Experience />
      </ErrorBoundary>

      <ErrorBoundary>
        <Contact />
      </ErrorBoundary>

      <Footer />

      {/* Fixed floating mascot — stays in the bottom-right corner while scrolling */}
      <FloatingWhobee />
    </main>
  );
}
