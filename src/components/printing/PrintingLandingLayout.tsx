import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Clock, FileImage, MapPin, Package, Palette, Phone, Truck, Users } from 'lucide-react';
import type { PrintingLandingBlock } from '../../data/printingLandingContent';
import { getRelatedPrintingLinks } from '../../data/printingLandingContent';
import { getPublicSiteUrl } from '../../seo/publicSiteUrl';

interface PrintingLandingLayoutProps {
  page: PrintingLandingBlock;
}

function buildFaqJsonLd(page: PrintingLandingBlock, pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
    url: pageUrl,
  };
}

function buildServiceJsonLd(page: PrintingLandingBlock, pageUrl: string) {
  const areaServed =
    page.kind === 'location'
      ? `${page.slug.replace(/-/g, ' ')} — Gauteng & South Africa`
      : 'South Africa';
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.h1,
    description: page.seoDescription,
    url: pageUrl,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Skipaman',
      areaServed: areaServed,
      url: getPublicSiteUrl(),
    },
  };
}

const PrintingLandingLayout: FC<PrintingLandingLayoutProps> = ({ page }) => {
  const site = getPublicSiteUrl();
  const path = page.kind === 'location' ? `/locations/${page.slug}` : `/services/${page.slug}`;
  const pageUrl = `${site}${path}`;
  const related = getRelatedPrintingLinks(page.kind, page.slug);
  const faqLd = buildFaqJsonLd(page, pageUrl);
  const serviceLd = buildServiceJsonLd(page, pageUrl);

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(serviceLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      <main className="min-h-screen bg-white pb-20 pt-28 md:pt-32 lg:pt-36">
        <section className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-neutral-900 shadow-xl">
            <div className="relative aspect-[21/9] min-h-[220px] w-full md:aspect-[24/9]">
              <img
                src={page.heroImage}
                alt={page.h1}
                className="absolute inset-0 h-full w-full object-cover opacity-90"
                width={1920}
                height={640}
                decoding="async"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 max-w-4xl p-6 sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  {page.kind === 'location' ? 'Areas we serve' : 'Printing service'}
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
                  {page.h1}
                </h1>
                <p className="mt-4 max-w-2xl text-base text-white/85 sm:text-lg">{page.heroSubtitle}</p>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-6 text-base leading-relaxed text-neutral-700">
            {page.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-6">
              <div className="flex items-center gap-2 text-neutral-900">
                <Users className="h-5 w-5 shrink-0" aria-hidden />
                <h2 className="text-lg font-bold">Who it&apos;s for</h2>
              </div>
              <ul className="mt-4 list-inside list-disc space-y-2 text-neutral-700">
                {page.whoItsFor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-6">
              <div className="flex items-center gap-2 text-neutral-900">
                <Palette className="h-5 w-5 shrink-0" aria-hidden />
                <h2 className="text-lg font-bold">What we print</h2>
              </div>
              <ul className="mt-4 list-inside list-disc space-y-2 text-neutral-700">
                {page.whatWePrint.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 p-5">
              <Package className="h-5 w-5 text-neutral-900" aria-hidden />
              <h3 className="mt-3 font-semibold text-neutral-900">Minimums</h3>
              <p className="mt-2 text-sm text-neutral-600">{page.minimums}</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 p-5">
              <Clock className="h-5 w-5 text-neutral-900" aria-hidden />
              <h3 className="mt-3 font-semibold text-neutral-900">Lead times & turnaround</h3>
              <p className="mt-2 text-sm text-neutral-600">{page.leadTimes}</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 p-5 sm:col-span-2 lg:col-span-1">
              <FileImage className="h-5 w-5 text-neutral-900" aria-hidden />
              <h3 className="mt-3 font-semibold text-neutral-900">Artwork requirements</h3>
              <p className="mt-2 text-sm text-neutral-600">{page.artworkRequirements}</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 p-5">
              <Truck className="h-5 w-5 text-neutral-900" aria-hidden />
              <h3 className="mt-3 font-semibold text-neutral-900">Delivery & pickup</h3>
              <p className="mt-2 text-sm text-neutral-600">{page.deliveryPickup}</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 p-5 sm:col-span-2">
              <MapPin className="h-5 w-5 text-neutral-900" aria-hidden />
              <h3 className="mt-3 font-semibold text-neutral-900">Pricing (ballpark)</h3>
              <p className="mt-2 text-sm text-neutral-600">{page.pricingRange}</p>
            </div>
          </div>

          <section className="mt-16" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-black text-neutral-900">
              FAQs
            </h2>
            <div className="mt-6 space-y-3">
              {page.faqs.map((f) => (
                <details
                  key={f.question}
                  className="group rounded-2xl border border-neutral-200 bg-white px-4 py-3 open:bg-neutral-50"
                >
                  <summary className="cursor-pointer list-none font-semibold text-neutral-900 outline-none marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-start justify-between gap-2">
                      {f.question}
                      <span className="text-neutral-400 transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl bg-neutral-900 px-6 py-8 text-white sm:flex-row sm:items-center sm:px-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-white/70">Next step</p>
              <p className="mt-1 text-lg font-bold">Ready for a written quote?</p>
              <p className="mt-1 text-sm text-white/75">
                Tell us quantities, sizes, and dates—we&apos;ll confirm method and pricing.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/virtual-stylist"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-neutral-900 transition hover:bg-neutral-100"
              >
                Request a quote
              </Link>
              <a
                href="tel:0744702010"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                <Phone className="h-4 w-4" aria-hidden />
                074 470 2010
              </a>
            </div>
          </div>

          <nav className="mt-16 border-t border-neutral-200 pt-10" aria-label="Related printing pages">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((block) => (
                <div key={block.title}>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-500">{block.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {block.links.map((l) => (
                      <li key={l.to}>
                        <Link to={l.to} className="text-neutral-800 underline-offset-4 hover:underline">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </section>
      </main>
    </>
  );
};

export default PrintingLandingLayout;
