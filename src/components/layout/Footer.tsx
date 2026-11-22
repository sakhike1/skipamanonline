import React from 'react';
import { Link } from 'react-router-dom';
import { useNewsletter } from '../../hooks/useNewsletter';

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
    { name: 'Branding', path: '/virtual-stylist' }
  ];

  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com/skipaman' },
    { name: 'Instagram', href: 'https://instagram.com/skipaman' },
    { name: 'Twitter', href: 'https://twitter.com/skipaman' },
    { name: 'YouTube', href: 'https://youtube.com/skipaman' }
  ];

  return (
    <footer id="footer" className="bg-black px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-6 lg:gap-8">
          
          {/* Brand Section */}
          <div className="flex flex-col items-start text-left lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">SKIPAMAN</span>
            </Link>
            <div className="mt-6 h-px w-full max-w-52 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              Elevating your style with premium quality fashion. Sustainable, modern, and made for you.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <a href="tel:0744702010" className="text-sm text-white/60 transition-colors hover:text-white">
                0744702010
              </a>
              <a
                href="mailto:admin@skipaman.co.za"
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                admin@skipaman.co.za
              </a>
              <a
                href="mailto:sales@skipaman.co.za"
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                sales@skipaman.co.za
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="flex flex-col items-start text-left">
            <h3 className="text-sm font-semibold tracking-wide text-white">Shop</h3>
            <div className="mt-5 flex flex-col gap-2">
              {shopLinks.map((link, index) => (
                <Link 
                  key={index}
                  to={link.path} 
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Help */}
          <div className="flex flex-col items-start text-left">
            <h3 className="text-sm font-semibold tracking-wide text-white">Help</h3>
            <div className="mt-5 flex flex-col gap-2">
              <Link to="/support" className="text-sm text-white/60 transition-colors hover:text-white">
                Support / tickets
              </Link>
              <Link to="/design-brief" className="text-sm text-white/60 transition-colors hover:text-white">
                Design brief
              </Link>
            </div>
          </div>

          {/* Printing / local SEO */}
          <div className="flex flex-col items-start text-left">
            <h3 className="text-sm font-semibold tracking-wide text-white">Printing</h3>
            <div className="mt-5 flex flex-col gap-2">
              <Link to="/printing" className="text-sm text-white/60 transition-colors hover:text-white">
                Services &amp; areas
              </Link>
              <Link to="/locations/centurion" className="text-sm text-white/60 transition-colors hover:text-white">
                Centurion
              </Link>
              <Link to="/locations/pretoria" className="text-sm text-white/60 transition-colors hover:text-white">
                Pretoria
              </Link>
              <Link to="/locations/johannesburg" className="text-sm text-white/60 transition-colors hover:text-white">
                Johannesburg
              </Link>
              <Link to="/virtual-stylist" className="text-sm text-white/60 transition-colors hover:text-white">
                Request a quote
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-start text-left">
            <h3 className="text-sm font-semibold tracking-wide text-white">Follow</h3>
            <div className="mt-5 flex flex-col gap-2">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="flex flex-col items-start text-left">
            <h3 className="text-sm font-semibold tracking-wide text-white">Newsletter</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              New drops, restocks, and offers—one short email.
            </p>
            <form onSubmit={handleSubscribe} className="mt-5 w-full min-w-0 max-w-sm" noValidate>
              <div className="flex flex-col gap-2.5">
                <label className="sr-only" htmlFor="footer-newsletter-email">
                  Email address
                </label>
                <div className="w-full min-w-0 rounded-full border border-white/15 bg-white/[0.03] px-1 py-1">
                  <input
                    id="footer-newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      if (message) resetStatus();
                      setEmail(e.target.value);
                    }}
                    placeholder="Enter your email"
                    className="box-border h-11 w-full min-w-0 rounded-full bg-transparent px-4 text-sm text-white placeholder:text-white/55 placeholder:text-sm outline-none"
                    autoComplete="email"
                    disabled={isSubscribing}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="h-11 w-full shrink-0 rounded-full bg-white px-5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubscribing ? 'Subscribing…' : 'Subscribe'}
                </button>
              </div>
              {message && (
                <p
                  className={`mt-3 text-sm ${
                    status === 'success' ? 'text-green-400' : 'text-red-300'
                  }`}
                  aria-live="polite"
                >
                  {message}
                </p>
              )}
            </form>
          </div>

        </div>

        <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="flex flex-col items-start justify-between gap-4 text-left sm:flex-row sm:items-center">
          <p className="text-xs text-white/60">© 2025 SKIPAMAN</p>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="text-xs text-white/60 transition-colors hover:text-white">
              Terms & Conditions
            </Link>
            <div className="h-4 w-px bg-white/20" />
            <Link to="/privacy" className="text-xs text-white/60 transition-colors hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
