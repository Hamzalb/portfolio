'use client';
import { Github, Linkedin, Mail, ArrowUpRight, Heart } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   FOOTER — Trendy, glassmorphic, matching the floating nav
───────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'About',      href: '#about' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact',    href: '#contact' },
];

const SOCIALS = [
  { href: 'https://github.com/hamzaloubani',    Icon: Github,   label: 'GitHub' },
  { href: 'https://linkedin.com/in/hamzaloubani', Icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:hamzaloubani1234@gmail.com',  Icon: Mail,     label: 'Email' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollTo = (href: string) => {
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer role="contentinfo">
      <style>{`
        .footer-root {
          position: relative;
          overflow: hidden;
          padding: clamp(3rem, 6vw, 5rem) clamp(1rem, 4vw, 1.5rem) 0;
        }

        /* Top accent line — gradient */
        .footer-root::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(600px, 80%);
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(99, 102, 241, 0.5) 30%,
            rgba(6, 182, 212, 0.5) 70%,
            transparent 100%
          );
        }

        .footer-inner {
          max-width: 72rem;
          margin: 0 auto;
        }

        /* ── Top section: logo + tagline ─────────────────── */
        .footer-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }

        .footer-logo {
          width: 3rem;
          height: 3rem;
          border-radius: 0.875rem;
          overflow: hidden;
          flex-shrink: 0;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .footer-logo:hover {
          transform: scale(1.08) rotate(-3deg);
        }
        .footer-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
        }
        .footer-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.01em;
        }
        .footer-tagline {
          font-size: 0.8125rem;
          color: #64748b;
          max-width: 280px;
        }

        /* ── Middle: nav links in a pill row ─────────────── */
        .footer-nav-pill {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.25rem;
          padding: 0.35rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          margin: 0 auto 2.5rem;
          width: fit-content;
        }
        .footer-nav-link {
          padding: 0.5rem 1rem;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #64748b;
          border-radius: 9999px;
          text-decoration: none;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
          cursor: pointer;
        }
        .footer-nav-link:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.06);
        }

        /* ── Social links row ────────────────────────────── */
        .footer-socials {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 2.5rem;
        }
        .footer-social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.75rem;
          color: #64748b;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          text-decoration: none;
          transition: color 0.2s, background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .footer-social-link:hover {
          color: #fff;
          background: rgba(99, 102, 241, 0.1);
          border-color: rgba(99, 102, 241, 0.25);
          transform: translateY(-2px);
        }

        /* ── Bottom bar ──────────────────────────────────── */
        .footer-bottom {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.5rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        @media (min-width: 640px) {
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
          }
        }
        .footer-copyright {
          font-size: 0.75rem;
          color: #475569;
        }
        .footer-built {
          font-size: 0.75rem;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .footer-built .heart {
          color: #6366f1;
          animation: pulse-heart 2s ease-in-out infinite;
        }
        .footer-tech {
          color: #64748b;
          transition: color 0.2s;
        }
        .footer-tech:hover {
          color: #94a3b8;
        }
        @keyframes pulse-heart {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        /* Back-to-top integrated into footer */
        .footer-back-top {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: #64748b;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          cursor: pointer;
          transition: color 0.2s, background 0.2s, border-color 0.2s;
          margin-bottom: 2rem;
        }
        .footer-back-top:hover {
          color: #fff;
          background: rgba(99, 102, 241, 0.08);
          border-color: rgba(99, 102, 241, 0.2);
        }
        .footer-back-top svg {
          transition: transform 0.2s;
        }
        .footer-back-top:hover svg {
          transform: translateY(-2px);
        }
      `}</style>

      <div className="footer-root">
        <div className="footer-inner">
          {/* ── Top: Logo + brand ──────────────────────────── */}
          <div className="footer-top">
            <a
              href="#hero"
              onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }}
              className="footer-logo"
              aria-label="Back to top"
            >
              <img
                src="/assets/logo.png"
                alt=""
                width={48}
                height={48}
                draggable={false}
              />
            </a>
            <div className="footer-brand">
              <span className="footer-name">Hamza Loubani</span>
              <span className="footer-tagline">
                Building performant web experiences with clean architecture.
              </span>
            </div>
          </div>

          {/* ── Nav links in pill container ────────────────── */}
          <nav aria-label="Footer navigation">
            <div className="footer-nav-pill" role="list">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  role="listitem"
                  onClick={(e) => { e.preventDefault(); scrollTo(href); }}
                  className="footer-nav-link"
                >
                  {label}
                </a>
              ))}
            </div>
          </nav>

          {/* ── Social links ──────────────────────────────── */}
          <div className="footer-socials">
            {SOCIALS.map(({ href, Icon, label }) => (
              <a
                key={href}
                href={href}
                aria-label={label}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="footer-social-link"
              >
                <Icon size={16} aria-hidden="true" />
              </a>
            ))}
          </div>

          {/* ── Back to top pill ───────────────────────────── */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              className="footer-back-top"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Scroll back to top"
            >
              Back to top
              <ArrowUpRight size={13} strokeWidth={2.5} aria-hidden="true" style={{ transform: 'rotate(-45deg)' }} />
            </button>
          </div>

          {/* ── Bottom bar ────────────────────────────────── */}
          <div className="footer-bottom">
            <p className="footer-copyright">
              © {year} Hamza Loubani. All rights reserved.
            </p>
            <p className="footer-built">
              Crafted with
              <Heart size={12} className="heart" fill="currentColor" aria-hidden="true" />
              using
              <span className="footer-tech">Next.js</span>
              <span style={{ color: '#475569' }}>&middot;</span>
              <span className="footer-tech">Express</span>
              <span style={{ color: '#475569' }}>&middot;</span>
              <span className="footer-tech">MongoDB</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
