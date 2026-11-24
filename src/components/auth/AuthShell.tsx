import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

type AuthShellProps = {
  mode: 'signin' | 'signup';
  title: string;
  subtitle: string;
  /** Hide the Sign in / Sign up switch (used on the staff portal). */
  hideTabs?: boolean;
  children: React.ReactNode;
};

/** Class for every text input so Login and Register stay identical. */
export const authInputClass =
  'block w-full rounded-full border border-[#211527]/15 bg-white/70 py-3.5 pl-5 pr-12 text-sm text-[#211527] placeholder:text-[#211527]/45 outline-none transition focus:border-[#211527]/60 focus:bg-white focus:ring-2 focus:ring-[#f2ceff]';

export const authButtonClass =
  'inline-flex w-full items-center justify-center rounded-full bg-[#211527] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#33203f] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211527]';

const AuthShell: React.FC<AuthShellProps> = ({ mode, title, subtitle, hideTabs, children }) => {
  const tab = (active: boolean) =>
    `flex-1 rounded-full py-2.5 text-center text-sm font-medium transition ${
      active ? 'bg-[#211527] text-white shadow-sm' : 'text-[#513a5c] hover:text-[#211527]'
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3eff5] px-3 pb-10 pt-28 sm:px-6 md:pt-32">
      <style>{`
        .auth-art {
          background-image: linear-gradient(135deg, #ffd4c4, #fad0e1, #f2ceff, #cfdcff, #ffd4c4);
          background-size: 300% 300%;
          animation: auth-art-shift 16s ease-in-out infinite;
        }
        @keyframes auth-art-shift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes auth-blob { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(6%,-8%,0) scale(1.08); } }
        .auth-blob { animation: auth-blob 14s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .auth-art, .auth-blob { animation: none; } }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_100px_-40px_rgba(33,21,39,0.5)] ring-1 ring-[#211527]/10 md:min-h-[38rem] md:grid-cols-2"
      >
        {/* Form side */}
        <div className="flex flex-col justify-center bg-gradient-to-b from-[#f7f4f9] to-white px-6 py-10 sm:px-12">
          <div className="mx-auto w-full max-w-sm">
            <Link to="/" className="inline-flex items-center gap-3" aria-label="Skipaman home">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#211527] text-sm font-black text-white">S</span>
              <span className="text-xl font-black tracking-tight text-[#211527]">SKIPAMAN</span>
            </Link>

            <h1 className="mt-8 text-2xl font-semibold tracking-tight text-[#211527]">{title}</h1>
            <p className="mt-1 text-sm text-[#6b5a73]">{subtitle}</p>

            {!hideTabs && (
              <div className="mt-6 flex gap-1 rounded-full border border-[#211527]/15 bg-white p-1" role="tablist" aria-label="Account">
                <Link to="/login" role="tab" aria-selected={mode === 'signin'} className={tab(mode === 'signin')}>
                  Sign in
                </Link>
                <Link to="/register" role="tab" aria-selected={mode === 'signup'} className={tab(mode === 'signup')}>
                  Sign up
                </Link>
              </div>
            )}

            <div className="mt-6">{children}</div>
          </div>
        </div>

        {/* Art side */}
        <div className="auth-art relative hidden overflow-hidden md:block">
          <div className="auth-blob absolute -left-16 top-10 h-72 w-72 rounded-full bg-[#211527]/80 blur-3xl" aria-hidden />
          <div className="auth-blob absolute -right-10 bottom-24 h-64 w-64 rounded-full bg-[#8fb0ff]/70 blur-3xl [animation-delay:-5s]" aria-hidden />
          <div className="auth-blob absolute left-1/3 top-1/2 h-56 w-56 rounded-full bg-[#f2ceff] blur-3xl [animation-delay:-9s]" aria-hidden />

          <div className="relative flex h-full flex-col justify-between p-10 text-[#211527]">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#211527]/80">Skipaman</p>
            <div>
              <p className="text-[clamp(2rem,3.4vw,3rem)] font-black leading-[0.98] tracking-[-0.04em] text-[#211527]">
                Wear it.
                <br />
                Own it.
              </p>
              <p className="mt-3 max-w-xs text-sm text-[#211527]/80">
                Track orders, save your favourites and check out faster.
              </p>
            </div>
            <div className="rounded-2xl border border-white/40 bg-white/25 px-5 py-4 text-xs leading-relaxed text-[#211527] backdrop-blur-md">
              © {new Date().getFullYear()} Skipaman. By continuing you agree to our{' '}
              <Link to="/terms" className="font-semibold underline underline-offset-2">Terms</Link> and{' '}
              <Link to="/privacy" className="font-semibold underline underline-offset-2">Privacy Policy</Link>.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthShell;
