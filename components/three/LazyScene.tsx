'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports with ssr:false — Three.js / WebGPU require a browser context.
// The `mounted` guard prevents any SSR attempt and eliminates the
// "Bail out to client-side rendering: next/dynamic" error in App Router.
const HeroSceneDynamic      = dynamic(() => import('./HeroScene'),                         { ssr: false, loading: () => null });
// FuturisticHero removed — R3F v8 crashes under React 19 on module evaluation.
// The WebGPU overlay is now loaded conditionally inside HeroSection.tsx.
const WhobeeDynamic         = dynamic(() => import('./Whobee'),                            { ssr: false, loading: () => null });
const OrbitalRingsDynamic   = dynamic(() => import('./OrbitalRings'),                      { ssr: false, loading: () => null });
const SkillsGlobeDynamic    = dynamic(() => import('./SkillsGlobe'),                       { ssr: false, loading: () => null });

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}

export function LazyHeroScene() {
  const mounted = useMounted();
  if (!mounted) return null;
  return <HeroSceneDynamic />;
}

// LazyFuturisticHero removed — see HeroSection.tsx

/** Whobee robot character — Canvas 2D, fills its parent. */
export function LazyWhobee() {
  const mounted = useMounted();
  if (!mounted) return null;
  return <WhobeeDynamic />;
}

export function LazyOrbitalRings() {
  const mounted = useMounted();
  if (!mounted) return (
    // SSR placeholder keeps layout stable while Three.js loads
    <div style={{ width: '100%', height: '100%', minHeight: 280 }} />
  );
  return <OrbitalRingsDynamic />;
}

export function LazySkillsGlobe() {
  const mounted = useMounted();
  if (!mounted) return (
    <div style={{ width: '100%', height: '100%', minHeight: 200 }} />
  );
  return <SkillsGlobeDynamic />;
}
