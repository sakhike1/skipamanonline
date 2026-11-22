import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';
import {
  hasRecordedConsent,
  setConsent,
} from '../../lib/analytics';

export default function CookieConsentBanner() {
  const [open, setOpen] = useState(() => !hasRecordedConsent());

  if (!open) return null;

  const chooseNecessary = () => {
    setConsent('necessary_only');
    setOpen(false);
  };

  const chooseAll = () => {
    setConsent('all');
    setOpen(false);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-white/10 bg-neutral-950/98 px-4 py-4 shadow-[0_-8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md md:py-5"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="flex min-w-0 flex-1 gap-3">
          <Cookie className="mt-0.5 h-6 w-6 shrink-0 text-amber-400" aria-hidden />
          <div className="min-w-0">
            <p id="cookie-consent-title" className="text-sm font-semibold text-white">
              Cookies &amp; marketing preferences
            </p>
            <p id="cookie-consent-desc" className="mt-1 text-xs leading-relaxed text-white/75 sm:text-sm">
              We use essential cookies to run the store (cart, sign-in, security). If you choose &quot;Accept all&quot;, we may load
              analytics and advertising tools (Google Analytics, Meta Pixel) to measure traffic and campaigns. See our{' '}
              <Link to="/privacy" className="font-medium text-white underline underline-offset-2 hover:text-white/90">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link to="/terms" className="font-medium text-white underline underline-offset-2 hover:text-white/90">
                Terms
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={chooseNecessary}
            className="rounded-full border border-white/20 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={chooseAll}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-100"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
