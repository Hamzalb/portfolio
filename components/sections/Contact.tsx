'use client';
import { useState } from 'react';
import { Mail, MapPin, Clock, Send, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import api from '@/lib/api';
import type { ContactFormData } from '@/types';

interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: number) => void }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed right-6 z-50 flex flex-col gap-3"
      style={{ bottom: 'clamp(15rem, 20vw, 17rem)' }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast-enter flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium max-w-xs"
          style={
            t.type === 'success'
              ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399' }
              : { background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.4)', color: '#fb7185' }
          }
          role="alert"
        >
          {t.type === 'success'
            ? <CheckCircle size={16} aria-hidden="true" />
            : <AlertCircle size={16} aria-hidden="true" />}
          <span className="flex-1 text-slate-200">{t.message}</span>
          <button
            onClick={() => dismiss(t.id)}
            aria-label="Dismiss notification"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

const INITIAL: ContactFormData = { name: '', email: '', subject: '', message: '', honeypot: '' };

export default function Contact() {
  const [form, setForm] = useState<ContactFormData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const sectionRef = useScrollReveal<HTMLElement>();

  const addToast = (type: Toast['type'], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  };

  const dismissToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.honeypot) return;
    setSubmitting(true);
    try {
      await api.post('/api/contact', form);
      addToast('success', "Message sent! I'll get back to you within 24 hours.");
      setForm(INITIAL);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      addToast('error', axiosErr?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl text-white text-sm placeholder-slate-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/50`;
  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };
  const inputFocusStyle = { border: '1px solid rgba(99,102,241,0.4)' };

  return (
    <>
      <section id="contact" ref={sectionRef} className="relative section-pad" aria-labelledby="contact-heading">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-sm font-mono text-indigo-400 mb-2" style={{ fontFamily: 'var(--font-mono)' }}>05. say hello</p>
            <h2 id="contact-heading" className="section-heading text-3xl md:text-4xl font-bold text-white">
              Get In Touch
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: contact info */}
            <div className="space-y-6">
              <p className="text-slate-400 leading-relaxed text-lg">
                Have a project in mind or want to collaborate? I&apos;m always open to discussing new opportunities.
                Drop me a message and I&apos;ll get back to you within 24 hours.
              </p>

              <div className="space-y-4" role="list" aria-label="Contact information">
                {[
                  { Icon: Mail, label: 'Email', value: 'hamzaloubani1234@gmail.com', href: 'mailto:hamzaloubani1234@gmail.com' },
                  { Icon: MapPin, label: 'Location', value: 'Tripoli, Lebanon', href: null },
                  { Icon: Clock, label: 'Timezone', value: 'EET (UTC+3) – Available 9AM–6PM', href: null },
                ].map(({ Icon, label, value, href }) => (
                  <div
                    key={label}
                    role="listitem"
                    className="glass-card p-4 flex items-center gap-4"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
                      aria-hidden="true"
                    >
                      <Icon size={18} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">{label}</p>
                      {href ? (
                        <a href={href} className="text-sm text-slate-200 hover:text-white transition-colors">{value}</a>
                      ) : (
                        <p className="text-sm text-slate-200">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social CTA */}
              <p className="text-slate-500 text-sm">
                Also open to connections on{' '}
                <a
                  href="https://linkedin.com/in/hamzaloubani"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  LinkedIn
                </a>{' '}
                or exploring my work on{' '}
                <a
                  href="https://github.com/hamzaloubani"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  GitHub
                </a>.
              </p>
            </div>

            {/* Right: form */}
            <div className="glass-card p-8">
              <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
                {/* Honeypot – hidden from real users */}
                <input
                  type="text"
                  name="honeypot"
                  value={form.honeypot}
                  onChange={handleChange}
                  tabIndex={-1}
                  aria-hidden="true"
                  style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
                  autoComplete="off"
                />

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-medium text-slate-400 mb-1.5">
                        Name <span aria-hidden="true" className="text-rose-400">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className={inputClass}
                        style={inputStyle}
                        onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
                        onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-medium text-slate-400 mb-1.5">
                        Email <span aria-hidden="true" className="text-rose-400">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className={inputClass}
                        style={inputStyle}
                        onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
                        onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-medium text-slate-400 mb-1.5">
                      Subject <span aria-hidden="true" className="text-rose-400">*</span>
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      placeholder="What's this about?"
                      className={inputClass}
                      style={inputStyle}
                      onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
                      onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-medium text-slate-400 mb-1.5">
                      Message <span aria-hidden="true" className="text-rose-400">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell me about your project or idea..."
                      className={`${inputClass} resize-none`}
                      style={inputStyle}
                      onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
                      onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    aria-busy={submitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-white transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
                  >
                    {submitting ? (
                      <>
                        <span
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          style={{ animation: 'spin 0.7s linear infinite' }}
                          aria-hidden="true"
                        />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send size={16} aria-hidden="true" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <ToastContainer toasts={toasts} dismiss={dismissToast} />
    </>
  );
}
