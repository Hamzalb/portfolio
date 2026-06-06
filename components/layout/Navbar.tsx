'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowUpRight } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   NAV CONFIG
───────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'About',      href: '#about' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact',    href: '#contact' },
];

const SECTION_IDS = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];

/* ─────────────────────────────────────────────────────────────
   NAVBAR — Floating pill, always full links (no hamburger)
───────────────────────────────────────────────────────────── */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState('');
  const [visible, setVisible]   = useState(false);

  // Refs for the sliding pill indicator
  const navListRef  = useRef<HTMLUListElement>(null);
  const linkRefs    = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [pill, setPill] = useState({ left: 0, width: 0, opacity: 0 });

  /* ── Scroll & visibility ──────────────────────────────────── */
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll); };
  }, []);

  /* ── Intersection-based active section ────────────────────── */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-40% 0px -40% 0px' },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* ── Update sliding pill position when active changes ─────── */
  const updatePill = useCallback(() => {
    const activeHref = `#${active}`;
    const linkEl = linkRefs.current.get(activeHref);
    const listEl = navListRef.current;
    if (!linkEl || !listEl) {
      setPill((p) => ({ ...p, opacity: 0 }));
      return;
    }
    const listRect = listEl.getBoundingClientRect();
    const linkRect = linkEl.getBoundingClientRect();
    setPill({
      left:    linkRect.left - listRect.left,
      width:   linkRect.width,
      opacity: 1,
    });
  }, [active]);

  useEffect(() => {
    updatePill();
    window.addEventListener('resize', updatePill);
    return () => window.removeEventListener('resize', updatePill);
  }, [updatePill]);

  /* ── Nav click handler ────────────────────────────────────── */
  const handleNavClick = (href: string) => {
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        .nav-floating {
          position: fixed;
          top: 0.75rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: fixed;
          gap: 0.2rem;
          padding: 0.35rem 0.35rem 0.35rem 0.45rem;
          border-radius: 9999px;
          width: 70%;
          min-width: fit-content;
          max-width: calc(70% - 1rem);
          flex-wrap: nowrap;
          transition: background 0.35s ease,
                      border-color 0.35s ease,
                      box-shadow 0.35s ease,
                      opacity 0.6s cubic-bezier(0.16,1,0.3,1),
                      transform 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        @media (min-width: 640px) {
          .nav-floating {
            top: 1rem;
            gap: 0.25rem;
            padding: 0.4rem 0.4rem 0.4rem 0.5rem;
          }
        }
        .nav-floating.hidden-nav {
          opacity: 0;
          transform: translateX(-50%) translateY(-120%);
        }
        .nav-floating.transparent {
          background: rgba(10, 10, 20, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(16px) saturate(150%);
          -webkit-backdrop-filter: blur(16px) saturate(150%);
        }
        .nav-floating.glass {
          background: rgba(10, 10, 20, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
                      0 0 0 1px rgba(255, 255, 255, 0.04) inset;
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
        }

        /* Sliding pill indicator */
        .nav-pill-indicator {
          position: absolute;
          top: 50%;
          height: calc(100% - 0.45rem);
          transform: translateY(-50%);
          border-radius: 9999px;
          background: rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(99, 102, 241, 0.22);
          pointer-events: none;
          transition: left 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      width 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 0.25s ease;
        }

        /* Nav links */
        .nav-link {
          position: relative;
          z-index: 1;
          padding: 0.4rem 0.5rem;
          font-size: 0.625rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          color: rgba(148, 163, 184, 1);
          border-radius: 9999px;
          white-space: nowrap;
          transition: color 0.2s ease;
          text-decoration: none;
        }
        @media (min-width: 400px) {
          .nav-link {
            padding: 0.45rem 0.625rem;
            font-size: 0.6875rem;
          }
        }
        @media (min-width: 640px) {
          .nav-link {
            padding: 0.5rem 0.875rem;
            font-size: 0.8125rem;
          }
        }
        .nav-link:hover { color: #fff; }
        .nav-link.active { color: #fff; }

        /* CTA button */
        .nav-cta {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          padding: 0.4rem 0.6rem;
          font-size: 0.625rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          color: #fff;
          border-radius: 9999px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          white-space: nowrap;
          transition: box-shadow 0.25s ease, transform 0.2s ease;
          text-decoration: none;
          border: none;
          cursor: pointer;
          flex-shrink: 0;
        }
        @media (min-width: 400px) {
          .nav-cta {
            padding: 0.45rem 0.75rem;
            font-size: 0.6875rem;
            gap: 0.25rem;
          }
        }
        @media (min-width: 640px) {
          .nav-cta {
            padding: 0.5rem 1rem;
            font-size: 0.8125rem;
            gap: 0.3rem;
          }
        }
        .nav-cta:hover {
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.45);
          transform: translateY(-1px);
        }
        .nav-cta:active { transform: scale(0.97); }
        .nav-cta svg { transition: transform 0.2s ease; }
        .nav-cta:hover svg { transform: translate(1px, -1px); }

        /* Logo */
        .nav-logo {
          position: relative;
          z-index: 1;
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 0.5rem;
          overflow: hidden;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }
        @media (min-width: 640px) {
          .nav-logo {
            width: 2.25rem;
            height: 2.25rem;
            border-radius: 0.625rem;
          }
        }
        .nav-logo:hover { transform: scale(1.08); }
        .nav-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        /* Separator dot */
        .nav-sep {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          flex-shrink: 0;
          margin: 0 0.1rem;
        }
        @media (min-width: 640px) {
          .nav-sep { margin: 0 0.25rem; }
        }
      `}</style>

      {/* ── FLOATING NAVBAR ────────────────────────────────────── */}
      <header
        role="banner"
        className={`nav-floating ${
          !visible ? 'hidden-nav' : ''
        } ${scrolled ? 'glass' : 'transparent'}`}
      >
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); handleNavClick('#hero'); }}
          aria-label="Hamza Loubani — home"
          className="nav-logo"
        >
          <img
            src="/assets/logo.png"
            alt="HL"
            width={36}
            height={36}
            draggable={false}
          />
        </a>

        {/* Separator */}
        <div className="nav-sep" aria-hidden="true" />

        {/* Links with sliding pill */}
        <ul
          ref={navListRef}
          role="list"
          style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1px', flex: 1, justifyContent: 'center' }}
        >
          {/* Sliding pill background */}
          <li aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
            <span
              className="nav-pill-indicator"
              style={{
                left:    `${pill.left}px`,
                width:   `${pill.width}px`,
                opacity: pill.opacity,
              }}
            />
          </li>

          {NAV_LINKS.map(({ label, href }) => {
            const id = href.replace('#', '');
            const isActive = active === id;
            return (
              <li key={href}>
                <a
                  ref={(el) => { if (el) linkRefs.current.set(href, el); }}
                  href={href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`nav-link${isActive ? ' active' : ''}`}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      </header>
    </>
  );
}
