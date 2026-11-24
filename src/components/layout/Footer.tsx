import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useNewsletter } from '../../hooks/useNewsletter';

const linkClass =
  'group inline-flex items-center gap-1 text-sm text-white/65 transition-colors duration-200 hover:text-[color:var(--vibe-accent,#f2ceff)]';

const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link to={to} className={linkClass}>
    <span className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">{children}</span>
  </Link>
);

const Footer: React.FC = () => {
  const { email, setEmail, isSubscribing, handleSubscribe, status, message, resetStatus } = useNewsletter(
    undefined,
    undefined,
    'footer_newsletter',
  );

  const shopLinks = [
    { name: 'Shop All', path: '/shop' },
    { name: 'New Arrivals', path: '/new-arrivals' },
    { name: 'Best Sellers', path: '/shop?filter=bestsellers' },
    { name: 'Sale', path: '/shop?filter=sale' },
    { name: 'Branding', path: '/virtual-stylist' },
    { name: 'Design studio', path: '/design-studio' },
  ];

  const printingLinks = [
    { name: 'Services & areas', path: '/printing' },
    { name: 'Centurion', path: '/locations/centurion' },
    { name: 'Pretoria', path: '/locations/pretoria' },
    { name: 'Johannesburg', path: '/locations/johannesburg' },
    { name: 'Request a quote', path: '/virtual-stylist' },
  ];

  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com/skipaman' },
    { name: 'Instagram', href: 'https://instagram.com/skipaman' },
    { name: 'Twitter', href: 'https://twitter.com/skipaman' },
    { name: 'YouTube', href: 'https://youtube.com/skipaman' },
  ];

  const headingClass = 'text-xs font-semibold uppercase tracking-[0.22em] text-white/40';

  return (
    <footer id="footer" className="relative overflow-hidden bg-black px-4 pb-8 pt-14 sm:px-6 lg:px-8">
      <div className="relative mx-auto w-full max-w-7xl">
        {/* Newsletter card */}
        <style>{`
          .footer-news {
            background-image: linear-gradient(115deg, #ffd4c4, #fad0e1, #f2ceff, #cfdcff, #c9f0e4, #ffd4c4);
            background-size: 300% 300%;
            animation: footer-news-shift 14s ease-in-out infinite;
          }
          @keyframes footer-news-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @media (prefers-reduced-motion: reduce) { .footer-news { animation: none; } }
        `}</style>
        <section
          aria-labelledby="footer-newsletter-heading"
          className="footer-news grid gap-8 rounded-[2rem] p-7 text-[#211527] sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b4a7a]">Newsletter</p>
            <h2
              id="footer-newsletter-heading"
              className="mt-3 text-[clamp(1.9rem,4vw,3.25rem)] font-black leading-[0.98] tracking-[-0.04em]"
            >
              Never miss a drop.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#513a5c]">
              New drops, restocks, and offers. One short email.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full min-w-0" noValidate>
            <label className="sr-only" htmlFor="footer-newsletter-email">
              Email address
            </label>
            <div className="flex w-full min-w-0 flex-col gap-2 rounded-[1.75rem] bg-white p-1.5 shadow-[0_18px_40px_-24px_rgba(33,21,39,0.55)] sm:flex-row sm:rounded-full">
              <input
                id="footer-newsletter-email"
                type="email"
                value={email}
                onChange={(e) => {
                  if (message) resetStatus();
                  setEmail(e.target.value);
                }}
                placeholder="Enter your email"
                className="box-border h-12 w-full min-w-0 flex-1 rounded-full bg-transparent px-5 text-sm text-[#211527] placeholder:text-[#211527]/45 outline-none"
                autoComplete="email"
                disabled={isSubscribing}
                required
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#211527] px-6 text-sm font-semibold text-white transition hover:bg-[#33203f] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubscribing ? 'Subscribing…' : 'Subscribe'}
                {!isSubscribing && <ArrowRight size={16} aria-hidden />}
              </button>
            </div>
            {message && (
              <p
                className={`mt-3 px-2 text-sm font-medium ${status === 'success' ? 'text-green-800' : 'text-red-800'}`}
                aria-live="polite"
              >
                {message}
              </p>
            )}
          </form>
        </section>

        {/* Links */}
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link to="/" className="inline-flex items-center">
              <span className="text-3xl font-black tracking-tight text-white">SKIPAMAN</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Elevating your style with premium quality fashion. Sustainable, modern, and made for you.
            </p>
            <div className="mt-5 flex flex-col items-start gap-2">
              <a href="tel:0744702010" className={linkClass}>
                0744702010
              </a>
              <a href="mailto:admin@skipaman.co.za" className={linkClass}>
                admin@skipaman.co.za
              </a>
              <a href="mailto:sales@skipaman.co.za" className={linkClass}>
                sales@skipaman.co.za
              </a>
            </div>
          </div>

          <nav aria-label="Shop">
            <h3 className={headingClass}>Shop</h3>
            <div className="mt-5 flex flex-col items-start gap-2.5">
              {shopLinks.map((link) => (
                <FooterLink key={link.name} to={link.path}>
                  {link.name}
                </FooterLink>
              ))}
            </div>
          </nav>

          <nav aria-label="Help">
            <h3 className={headingClass}>Help</h3>
            <div className="mt-5 flex flex-col items-start gap-2.5">
              <FooterLink to="/support">Support / tickets</FooterLink>
              <FooterLink to="/design-brief">Design brief</FooterLink>
            </div>
          </nav>

          <nav aria-label="Printing">
            <h3 className={headingClass}>Printing</h3>
            <div className="mt-5 flex flex-col items-start gap-2.5">
              {printingLinks.map((link) => (
                <FooterLink key={link.name} to={link.path}>
                  {link.name}
                </FooterLink>
              ))}
            </div>
          </nav>

          <div>
            <h3 className={headingClass}>Follow</h3>
            <div className="mt-5 flex flex-wrap gap-2 lg:flex-col lg:items-start">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-white/75 transition-colors duration-200 hover:border-[color:var(--vibe-accent,#f2ceff)] hover:bg-[color:var(--vibe-accent,#f2ceff)] hover:text-[#211527]"
                >
                  {link.name}
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
                    aria-hidden
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:pr-20">
          <p className="text-xs text-white/50">© {new Date().getFullYear()} SKIPAMAN</p>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="text-xs text-white/50 transition-colors hover:text-[color:var(--vibe-accent,#f2ceff)]">
              Terms &amp; Conditions
            </Link>
            <div className="h-4 w-px bg-white/20" />
            <Link to="/privacy" className="text-xs text-white/50 transition-colors hover:text-[color:var(--vibe-accent,#f2ceff)]">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
