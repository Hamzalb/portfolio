import { Github, Linkedin, Mail } from 'lucide-react';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative border-t"
      style={{
        borderColor: 'rgba(255,255,255,0.06)',
        padding: 'clamp(2rem,5vw,3.5rem) clamp(1rem,4vw,1.5rem)',
      }}
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}
              aria-hidden="true"
            >
              HL
            </div>
            <span className="font-semibold text-white text-sm">Hamza Loubani</span>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" role="list">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm text-slate-500 hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {[
              { href: 'https://github.com/hamzaloubani', Icon: Github, label: 'GitHub' },
              { href: 'https://linkedin.com/in/hamzaloubani', Icon: Linkedin, label: 'LinkedIn' },
              { href: 'mailto:hamzaloubani1234@gmail.com', Icon: Mail, label: 'Email' },
            ].map(({ href, Icon, label }) => (
              <a
                key={href}
                href={href}
                aria-label={label}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-white transition-colors hover:bg-white/5"
              >
                <Icon size={16} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p>© {year} Hamza Loubani. All rights reserved.</p>
          <p>
            Built with{' '}
            <span className="text-slate-400">Next.js</span>,{' '}
            <span className="text-slate-400">Express</span> &amp;{' '}
            <span className="text-slate-400">MongoDB</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
