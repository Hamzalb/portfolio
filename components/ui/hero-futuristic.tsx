/// <reference types="@react-three/fiber" />
'use client';
import { Github, Linkedin, Mail } from 'lucide-react';
// Direct import is safe — this module is only ever loaded via ssr:false dynamic import
import HeroScene from '../three/HeroScene';

/**
 * FuturisticHeroCanvas
 * ─────────────────────────────────────────────────────────────────────
 * WebGPU depth-map parallax hero background.
 *
 * Layers:
 *  1. Depth-map parallax: mouse pointer shifts the UV of a portrait image
 *     by the red channel of its depth map — real 3-D feel on 2-D hardware.
 *  2. Cell-noise dot overlay: indigo (#6366f1) particle dots that pulse
 *     along depth-slice contour lines as uProgress animates.
 *  3. Bloom: Three.js TSL bloom post-processing pass.
 *  4. Cyan scan line: a thin #06b6d4 horizontal sweep that travels top→bottom.
 *
 * Requires: @react-three/fiber, @react-three/drei, three (>=0.170 for TSL/WebGPU)
 * Must be loaded client-side only (dynamic import, ssr: false).
 */

import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useAspect, useTexture } from '@react-three/drei';
import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three/webgpu';
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js';
import type { Mesh } from 'three';

import {
  abs,
  blendScreen,
  float,
  mod,
  mx_cell_noise_float,
  oneMinus,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
  pass,
  mix,
  add,
} from 'three/tsl';

// Register WebGPU materials so R3F knows them
extend(THREE as any);

// ── Texture URLs ──────────────────────────────────────────────────────────────
const TEXTURE_SRC = 'https://i.postimg.cc/XYwvXN8D/img-4.png';
const DEPTH_SRC   = 'https://i.postimg.cc/2SHKQh2q/raw-4.webp';

// Source dimensions (used for aspect ratio calc only)
const W = 300;
const H = 300;

// ── Post-processing: bloom + cyan scan line ───────────────────────────────────
function PostProcessing({
  strength  = 1,
  threshold = 1,
}: {
  strength?:  number;
  threshold?: number;
}) {
  const { gl, scene, camera } = useThree();
  // progressRef holds the TSL uniform node — typed as any to avoid TSL/TS conflict
  const progressRef = useRef<any>({ value: 0 });

  const render = useMemo(() => {
    const pp         = new (THREE as any).PostProcessing(gl);
    const scenePass  = pass(scene, camera);
    const sceneColor = scenePass.getTextureNode('output');
    const bloomPass  = bloom(sceneColor, strength, 0.5, threshold);

    // Animated scan position
    const uScan = uniform(0);
    progressRef.current = uScan;

    // Soft-edge scan line: 0 at line centre, 1 away from it
    const uvY      = uv().y;
    const scanLine = smoothstep(0, float(0.05), abs(uvY.sub(uScan)));

    // Cyan (#06b6d4 → linear ≈ 0.024, 0.714, 0.831) glow at the scan line
    const cyanGlow = vec3(0.024, 0.714, 0.831)
      .mul(oneMinus(scanLine))
      .mul(0.45);

    // Only add cyan right at the scan edge (thin strip)
    const withScan = mix(
      sceneColor,
      add(sceneColor, cyanGlow),
      smoothstep(0.9, 1.0, oneMinus(scanLine)),
    );

    pp.outputNode = withScan.add(bloomPass);
    return pp;
  }, [camera, gl, scene, strength, threshold]);

  useFrame(({ clock }) => {
    // Animate the scan line sinusoidally top → bottom
    progressRef.current.value = Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5;
    render.renderAsync();
  }, 1); // priority 1 → runs after default scene render

  return null;
}

// ── Depth-map parallax mesh ───────────────────────────────────────────────────
function Scene() {
  const [rawMap, depthMap] = useTexture([TEXTURE_SRC, DEPTH_SRC]);
  const meshRef   = useRef<Mesh>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (rawMap && depthMap) setLoaded(true);
  }, [rawMap, depthMap]);

  const { material, uniforms } = useMemo(() => {
    const uPointer  = uniform(new THREE.Vector2(0));
    const uProgress = uniform(0);

    const tDepth = texture(depthMap);

    // Shift the colour UV by depth × pointer — creates the parallax illusion
    const tMap = texture(
      rawMap,
      uv().add(tDepth.r.mul(uPointer).mul(0.01)),
    );

    // Cell-noise dot grid that reveals itself along depth contour lines
    const aspect   = float(W).div(H);
    const tUv      = vec2(uv().x.mul(aspect), uv().y);
    const tiling   = vec2(120.0);
    const tiledUv  = mod(tUv.mul(tiling), 2.0).sub(1.0);
    const bright   = mx_cell_noise_float(tUv.mul(tiling).div(2));
    const dist     = float(tiledUv.length());
    const dotMask  = float(smoothstep(0.5, 0.49, dist)).mul(bright);
    // .r extracts the red channel as float (smoothstep expects FloatOrNumber)
    const flow     = oneMinus(smoothstep(0, 0.02, abs(tDepth.r.sub(uProgress))));

    // Indigo (#6366f1 → linear ≈ 0.388, 0.400, 0.945) particle colour
    const mask    = dotMask.mul(flow).mul(vec3(0.388, 0.400, 0.945));
    const finalColor = blendScreen(tMap, mask);

    const mat = new (THREE as any).MeshBasicNodeMaterial({
      colorNode:   finalColor,
      transparent: true,
      opacity:     0,             // fade in once textures load
    });

    return {
      material: mat,
      uniforms: { uPointer, uProgress },
    };
  }, [rawMap, depthMap]);

  // Scale to fill viewport while keeping the image's aspect ratio (40 % of fill)
  const [w, h] = useAspect(W, H);

  useFrame(({ clock, pointer }) => {
    // Animate depth scan
    uniforms.uProgress.value = Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5;
    // Mouse parallax
    uniforms.uPointer.value = pointer;
    // Smooth opacity fade-in after texture load
    if (meshRef.current) {
      const mat = (meshRef.current as any).material;
      if (mat && typeof mat.opacity === 'number') {
        const target = loaded ? 1 : 0;
        mat.opacity = mat.opacity + (target - mat.opacity) * 0.07;
      }
    }
  });

  return (
    <mesh ref={meshRef} scale={[w * 0.40, h * 0.40, 1]} material={material}>
      <planeGeometry />
    </mesh>
  );
}

// ── Canvas-only background export (used by LazyScene / Hero fallback) ─────────
export default function FuturisticHeroCanvas() {
  return (
    <div
      // z-index 1: composites over the Canvas 2D HeroScene (z-0)
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        flat
        style={{ background: 'transparent' }}
        gl={
          (async (props: any) => {
            try {
              const renderer = new (THREE as any).WebGPURenderer({
                ...props,
                antialias: true,
                alpha: true,        // transparent canvas — lets HeroScene show through
              });
              await renderer.init();
              return renderer;
            } catch (e) {
              console.warn('[FuturisticHero] WebGPU/WebGL init failed — canvas disabled.', e);
              return { setSize: () => {}, setPixelRatio: () => {}, render: () => {}, dispose: () => {} };
            }
          }) as any
        }
      >
        <PostProcessing />
        <Scene />
      </Canvas>
    </div>
  );
}

// ── Html — complete hero section for direct use in page.tsx ─────────────────
// Includes: WebGPU canvas bg, word-cascade title, location badge,
// typed subtitle, CTA buttons, social links, scroll indicator.
export function Html() {
  const TITLE_WORDS = ['Hamza', 'Loubani'];
  const SUBTITLE    = 'Full-Stack Developer & Software Engineer';

  // ── state ──────────────────────────────────────────────────────────────────
  const [hasWebGPU,    setHasWebGPU]    = useState(false);
  const [visible,      setVisible]      = useState(false);
  const [wordCount,    setWordCount]    = useState(0);
  const [subVisible,   setSubVisible]   = useState(false);
  const [ctaVisible,   setCtaVisible]   = useState(false);
  // Random glitch delays calculated client-side (no SSR mismatch)
  const [wordDelays,   setWordDelays]   = useState<number[]>([]);

  // ── boot ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    // 1 – appear trigger
    const t = setTimeout(() => setVisible(true), 80);
    // 2 – client-only random delays for the glitch entrance
    setWordDelays(TITLE_WORDS.map(() => Math.random() * 0.06));
    // 3 – WebGPU availability: requestAdapter() is the real test
    //     'gpu' in navigator is true even on sandboxed GPUs (Chrome)
    (async () => {
      try {
        const nav = navigator as any;
        if (!nav?.gpu) return;
        const adapter = await nav.gpu.requestAdapter();
        if (adapter) setHasWebGPU(true);
      } catch { /* GPU not available */ }
    })();
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── word cascade ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (wordCount < TITLE_WORDS.length) {
      const t = setTimeout(() => setWordCount((n) => n + 1), 480);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setSubVisible(true), 320);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordCount]);

  useEffect(() => {
    if (!subVisible) return;
    const t = setTimeout(() => setCtaVisible(true), 440);
    return () => clearTimeout(t);
  }, [subVisible]);

  // ── helpers ────────────────────────────────────────────────────────────────
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const fadeIn = (show: boolean, delay = 0) => ({
    opacity:    show ? 1 : 0,
    transform:  show ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
  });

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <section
      id="hero"
      className="relative min-h-svh overflow-hidden flex flex-col"
      aria-label="Hero"
    >
      {/* ── Background layers ───────────────────────────────────────────── */}

      {/* Layer 1 (z-0): Original Canvas 2D — stars, dual icosahedron,
          constellation particles, HDR orbs. Always rendered. */}
      <HeroScene />

      {/* Layer 2 (z-1): WebGPU depth-map parallax — composites over the
          Canvas 2D scene when a real GPU adapter is available. */}
      {hasWebGPU && <FuturisticHeroCanvas />}

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 flex-1 flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto"
        style={{
          padding:
            'clamp(5rem,12vw,8rem) clamp(1rem,4vw,1.5rem) clamp(4rem,8vw,5rem)',
        }}
      >
        {/* Location / status badge */}
        <div
          role="status"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-sm text-slate-400"
          style={{
            ...fadeIn(visible),
            background: 'rgba(255,255,255,0.04)',
            border:     '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span
              className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
              style={{ animation: 'ping-slow 1.5s cubic-bezier(0,0,0.2,1) infinite' }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Available for work · Tripoli, Lebanon
        </div>

        {/* Title — word-by-word glitch entrance */}
        <h1
          className="font-bold tracking-tight text-white mb-4 flex flex-wrap items-center justify-center"
          style={{
            fontSize:   'clamp(2.8rem, 9vw, 7rem)',
            lineHeight: 1.05,
            gap:        'clamp(0.4rem, 2vw, 1rem)',
          }}
        >
          {TITLE_WORDS.map((word, i) => (
            <span
              key={word}
              className={i < wordCount ? 'hero-word-enter' : ''}
              style={{
                opacity:        i < wordCount ? undefined : 0,
                animationDelay: `${wordDelays[i] ?? 0}s`,
                display:        'inline-block',
                // Gradient accent on the last name.
                // Note: keep filter OFF this element — Chrome breaks
                // -webkit-background-clip:text when filter is animated on it.
                ...(i === 1
                  ? {
                      background:           'linear-gradient(135deg,#6366f1 0%,#06b6d4 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip:       'text',
                      WebkitTextFillColor:  'transparent',
                      color:                'transparent',   // standard fallback
                    }
                  : {}),
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p
          className={`text-slate-300 font-light mb-3${subVisible ? ' hero-subtitle-enter' : ''}`}
          style={{
            fontSize:       'clamp(1rem,3.5vw,1.5rem)',
            opacity:        subVisible ? undefined : 0,
            animationDelay: '0.04s',
          }}
        >
          {SUBTITLE}
        </p>

        {/* Bio */}
        <p
          className="text-slate-400 leading-relaxed"
          style={{
            ...fadeIn(subVisible, 180),
            maxWidth: '520px',
            margin:   '0 auto 2.5rem',
          }}
        >
          Crafting performant, accessible web experiences with clean
          architecture. Passionate about open source, developer tooling, and
          shipping products that matter.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
          style={fadeIn(ctaVisible)}
        >
          <button
            onClick={() => scrollTo('projects')}
            className="px-7 py-3 rounded-xl font-medium text-white transition-all duration-200 active:scale-95"
            style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                '0 8px 32px rgba(99,102,241,0.45)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = 'none')
            }
          >
            View My Work
          </button>
          <a
            href="/cv.pdf"
            download
            className="px-7 py-3 rounded-xl font-medium text-white border transition-all duration-200 hover:bg-white/5 active:scale-95"
            style={{ borderColor: 'rgba(255,255,255,0.18)' }}
          >
            Download CV
          </a>
        </div>

        {/* Social links */}
        <div
          className="flex items-center justify-center gap-3"
          style={fadeIn(ctaVisible, 100)}
        >
          {[
            {
              href:  'https://github.com/hamzaloubani',
              Icon:  Github,
              label: 'GitHub profile',
            },
            {
              href:  'https://linkedin.com/in/hamzaloubani',
              Icon:  Linkedin,
              label: 'LinkedIn profile',
            },
            {
              href:  'mailto:hamzaloubani1234@gmail.com',
              Icon:  Mail,
              label: 'Send email',
            },
          ].map(({ href, Icon, label }) => (
            <a
              key={href}
              href={href}
              aria-label={label}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={
                href.startsWith('http')
                  ? 'noopener noreferrer'
                  : undefined
              }
              className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-400 hover:text-white transition-all duration-200 hover:-translate-y-1"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border:     '1px solid rgba(255,255,255,0.08)',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor =
                  'rgba(99,102,241,0.5)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor =
                  'rgba(255,255,255,0.08)')
              }
            >
              <Icon size={18} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>{/* /content */}

      {/* ── Explore / scroll indicator ───────────────────────────────────── */}
      <button
        className="explore-btn"
        onClick={() => scrollTo('about')}
        style={{ animationDelay: '2.4s' }}
        aria-label="Scroll to About section"
      >
        Scroll to explore
        <span className="explore-arrow">
          <svg
            width="18"
            height="18"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="arrow-svg"
            aria-hidden="true"
          >
            <path
              d="M11 5V17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M6 12L11 17L16 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
    </section>
  );
}
