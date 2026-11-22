import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type LegalDocumentLayoutProps = {
  title: string;
  children: ReactNode;
};

export default function LegalDocumentLayout({ title, children }: LegalDocumentLayoutProps) {
  return (
    <main className="min-h-screen bg-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <strong>Important:</strong> This document is a general template for an online retail and printing business in South Africa.
          It is <strong>not legal advice</strong>. Have it reviewed by your attorney before relying on it for POPIA, CPA, or advertising
          compliance.
        </p>

        <nav className="mb-8 text-sm text-neutral-600">
          <Link to="/" className="hover:text-black">
            Home
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <span className="text-neutral-900">{title}</span>
        </nav>

        <h1 className="text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-neutral-500">Last updated: {new Date().toISOString().slice(0, 10)}</p>

        <div className="mt-10 space-y-6 text-[15px] leading-relaxed text-neutral-700 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-neutral-900 [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-neutral-900 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1">
          {children}
        </div>
      </article>
    </main>
  );
}
