import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Shirt,
  Coffee,
  CircleDot,
  Calendar,
  Plus,
  Trash2,
  Send,
  Palette,
  Hash,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../ui/ToastProvider';
import SelectMenu from '../ui/SelectMenu';
import { supabase } from '../../lib/supabase';
const PRODUCT_TYPES = [
  { id: 'school-shirt', label: 'School shirt' },
  { id: 'school-jersey', label: 'School jersey' },
  { id: 'school-uniform', label: 'School / team uniform set' },
  { id: 'cap', label: 'Branded cap' },
  { id: 'cup', label: 'Branded cup / mug' },
  { id: 'business-tee', label: 'Business / event t-shirt' },
  { id: 'corporate-uniform', label: 'Corporate uniform / polo' },
  { id: 'other', label: 'Other (describe in notes)' },
] as const;

const SIZES = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'Youth S',
  'Youth M',
  'Youth L',
  'Mixed sizes (see notes)',
  'Other',
] as const;

type BrandingLineId = string;

interface BrandingLine {
  id: BrandingLineId;
  productType: string;
  size: string;
  color: string;
  quantity: number;
  neededBy: string;
}

const emptyLine = (): BrandingLine => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  productType: PRODUCT_TYPES[0].id,
  size: 'M',
  color: '',
  quantity: 1,
  neededBy: '',
});

const BrandingServicesPage: React.FC = () => {
  const { showToast } = useToast();
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  // A design sent over from the Design Studio arrives as a ready-made note
  const [notes, setNotes] = useState(() => {
    try {
      const draft = sessionStorage.getItem('skipaman_design_draft');
      if (draft) sessionStorage.removeItem('skipaman_design_draft');
      return draft ?? '';
    } catch {
      return '';
    }
  });
  const [lines, setLines] = useState<BrandingLine[]>(() => [emptyLine()]);

  const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  const addLine = useCallback(() => {
    setLines((prev) => [...prev, emptyLine()]);
  }, []);

  const removeLine = useCallback((id: BrandingLineId) => {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((l) => l.id !== id)));
  }, []);

  const updateLine = useCallback(<K extends keyof BrandingLine>(id: BrandingLineId, key: K, value: BrandingLine[K]) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, [key]: value } : l)));
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!contactName.trim() || !email.trim()) {
      showToast('Please add your name and email so we can reply.', 'warning');
      return;
    }
    const missingDate = lines.some((l) => !l.neededBy);
    if (missingDate) {
      showToast('Please choose a needed-by date for each line item.', 'warning');
      return;
    }
    const missingColor = lines.some((l) => !l.color.trim());
    if (missingColor) {
      showToast('Please enter a colour / finish for each line (e.g. Navy, Matte black).', 'warning');
      return;
    }

    const typeLabel = (id: string) => PRODUCT_TYPES.find((p) => p.id === id)?.label ?? id;
    const bodyLines = lines
      .map(
        (l, i) =>
          `${i + 1}. ${typeLabel(l.productType)} | Size: ${l.size} | Colour: ${l.color} | Qty: ${l.quantity} | Needed by: ${l.neededBy}`
      )
      .join('\n');

    if (!supabase) {
      showToast('Quotes are unavailable right now. Please try again later.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-enquiry', {
        body: {
          type: 'branding_quote',
          subject: 'Branding & uniform quote request',
          source: '/virtual-stylist',
          name: contactName,
          email,
          phone,
          organization,
          notes,
          lines: lines.map((l) => ({
            productType: l.productType,
            size: l.size,
            color: l.color,
            quantity: l.quantity,
            neededBy: l.neededBy,
          })),
          message: `Line items:\n${bodyLines}${notes.trim() ? `\n\nNotes:\n${notes.trim()}` : ''}`,
        },
      });

      if (error) throw error;
      if (!data?.ok) {
        showToast('Could not send your request. Please try again.', 'error');
        return;
      }

      if (data.emailed === false) {
        showToast('Request saved, but email sending is still being configured. We will contact you soon.', 'warning');
      } else {
        showToast('Request sent! Check your inbox for a confirmation.', 'success');
      }

      setContactName('');
      setEmail('');
      setPhone('');
      setOrganization('');
      setNotes('');
      setLines([emptyLine()]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send request. Please try again.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-100 text-neutral-900 pt-24 pb-20 md:pt-[6.75rem]">
      <section
        aria-label="Printing and branding"
        className="mx-auto mb-12 max-w-7xl px-3 sm:px-6 md:mb-16 md:h-[calc(100svh-7.75rem)] md:min-h-[34rem] lg:px-8"
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');
          .brand-hero { font-family: 'Inter', system-ui, sans-serif; }
          @keyframes brand-badge-spin { from { transform: rotate(-12deg); } 50% { transform: rotate(-4deg); } to { transform: rotate(-12deg); } }
          .brand-badge { animation: brand-badge-spin 4s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) { .brand-badge { animation: none; } }`}</style>
        <div className="brand-hero relative overflow-hidden md:flex md:h-full md:flex-col rounded-[1.75rem] bg-gradient-to-r from-[#ffd4c4] via-[#fad0e1] to-[#f2ceff] text-[#211527] md:rounded-[2.25rem]">
          <div className="relative grid items-center gap-8 px-6 py-12 md:min-h-0 md:flex-1 md:grid-cols-12 md:gap-4 md:px-12 md:py-10 lg:px-14">
            {/* Headline column */}
            <div className="relative z-20 md:col-span-8">
              <motion.h1
                className="text-[clamp(2.2rem,min(5vw,9svh),4.6rem)] font-light uppercase leading-[0.98] tracking-[-0.02em]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                T-shirt printing, uniforms &amp; corporate branding in Centurion
              </motion.h1>
              <p className="mt-6 max-w-sm text-lg text-[#211527]/80">Gear up your school, team or business.</p>
            </div>

            {/* Quote badge */}
            <div className="relative z-20 flex items-center justify-start md:col-span-4 md:justify-center">
              <a
                href="#quote-form"
                className="brand-badge mt-8 grid h-32 w-32 place-items-center rounded-full bg-[#211527] text-center text-xl font-light leading-tight text-white shadow-[0_0_0_10px_rgba(33,21,39,0.1)] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#211527] md:mt-0 md:h-[min(13rem,28svh)] md:w-[min(13rem,28svh)] md:text-2xl"
              >
                <span>
                  Get a<br />
                  <span className="font-semibold">quote!</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-6 md:mb-14 lg:grid-cols-[1.6fr_1fr] lg:gap-10">
          <p className="text-lg leading-relaxed text-[#211527]/80 md:text-xl">
            Need <strong className="text-[#211527]">bulk t-shirt printing</strong>, <strong className="text-[#211527]">uniform printing</strong>, or <strong className="text-[#211527]">cheap branded t-shirts</strong> for schools,
            teams, and businesses? We handle <strong className="text-[#211527]">DTF</strong>, <strong className="text-[#211527]">screen printing</strong>, and <strong className="text-[#211527]">vinyl printing</strong>, plus caps and
            branded mugs/cups, served from <strong className="text-[#211527]">Centurion, Gauteng</strong> with delivery across South Africa.
            Tell us what you need below: <strong className="text-[#211527]">sizes</strong>, <strong className="text-[#211527]">colours</strong>, <strong className="text-[#211527]">quantity</strong>, and <strong className="text-[#211527]">deadline</strong>.
            We&apos;ll reply with a quote and artwork checklist.
          </p>
          <Link
            to="/printing"
            className="group flex flex-col justify-between gap-4 rounded-[1.75rem] bg-[#f2ceff] p-6 text-[#211527] shadow-[0_20px_40px_-22px_rgba(31,43,71,0.6)] transition-transform hover:-translate-y-1"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Guides</span>
            <span className="text-sm leading-relaxed">
              <strong className="block text-lg">City &amp; service guides</strong>
              Minimums, lead times, and FAQs for Centurion, Pretoria, Johannesburg, and each print method.
            </span>
            <span className="inline-flex w-fit items-center rounded-full bg-[#211527] px-5 py-2 text-sm font-semibold text-white transition-transform group-hover:translate-x-1">
              Browse guides
            </span>
          </Link>
        </div>

        {/* Service tiles */}
        <div className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: GraduationCap, title: 'Schools & matric', text: 'School t-shirts, sports tees, matric jerseys, house colours.' },
            { icon: Shirt, title: 'Business & uniforms', text: 'Staff uniforms, golf shirts printing, corporate wear, event tees.' },
            { icon: Coffee, title: 'Cups & mugs', text: 'Branded mugs, travel cups, corporate gifts (small or bulk runs).' },
            { icon: CircleDot, title: 'Caps & headwear', text: 'Branded caps, beanies, team lids, embroidery or print.' },
            { icon: Palette, title: 'DTF / screen / vinyl', text: 'DTF printing, screen printing South Africa, vinyl finishes.' },
            { icon: Calendar, title: 'Fast turnarounds', text: 'T-shirt printing near you in Centurion, share your date, we plan backwards.' },
          ].map(({ icon: Icon, title, text }, i) => {
            const tone = [
              'bg-[#211527] text-white',
              'bg-[#ffd4c4] text-[#211527]',
              'bg-[#fad0e1] text-[#211527]',
              'bg-[#ffd4c4] text-[#211527]',
              'bg-[#fad0e1] text-[#211527]',
              'bg-[#211527] text-white',
            ][i];
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`flex min-h-[11rem] flex-col justify-between rounded-[1.75rem] p-6 transition-transform hover:-translate-y-1 ${tone}`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#211527]">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="mt-6">
                  <h2 className="text-xl font-bold leading-tight">{title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed opacity-85">{text}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ — helps SEO + answers high-intent questions */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
          className="mb-14 grid gap-8 rounded-[2rem] border border-[#211527]/10 bg-white p-6 shadow-sm md:p-10 lg:grid-cols-[1fr_1.7fr] lg:gap-12"
          aria-labelledby="branding-faq-heading"
        >
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="inline-flex rounded-full bg-[#f2ceff] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#211527]">FAQ</p>
            <h2 id="branding-faq-heading" className="mt-4 text-3xl font-black tracking-tight text-[#211527] md:text-4xl">
              Custom t-shirt printing & uniforms in Centurion
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              Quick answers for schools and businesses looking for bulk t-shirt printing, uniform printing, caps, cups, and corporate branding.
            </p>
          </div>

          <div className="grid content-start gap-3">
            {[
              {
                q: 'Do you do “custom t-shirts no minimum” orders?',
                a: 'Yes for some jobs. For the best price per unit, bulk t-shirt printing is recommended. Tell us your quantity and we’ll advise the best method (DTF, screen printing, or vinyl).',
              },
              {
                q: 'What’s the difference between DTF, screen printing, and vinyl?',
                a: 'DTF is great for detailed, full-colour prints and smaller runs. Screen printing is best for bulk screen printing and consistent colours. Vinyl works well for names/numbers and simple one-colour logos.',
              },
              {
                q: 'Can you do school t-shirts, matric jerseys, and sports tees?',
                a: 'Yes. We do school shirts, sports t-shirts, matric jerseys, and team kit. Share your artwork, colours, sizes, and deadline and we’ll quote and confirm the print method.',
              },
              {
                q: 'Do you do corporate wear, staff uniforms, and golf shirts printing?',
                a: 'Yes. We handle corporate branding for staff uniforms, polos, golf shirts, event apparel, and promotional t-shirts. We can also add caps and branded mugs/cups for full merch packs.',
              },
              {
                q: 'Where do you operate? (t-shirt printing near me)',
                a: 'We’re based in Centurion, Gauteng and serve Pretoria and Johannesburg. We also deliver across South Africa (including Cape Town and Durban) via courier.',
              },
              {
                q: 'Do you offer fast / overnight printing?',
                a: 'Fast turnarounds are possible depending on stock, artwork readiness, and quantity. If your job is urgent, include your needed-by date and we’ll confirm the quickest option.',
              },
            ].map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-2xl border border-[#211527]/10 bg-[#f3eff5] px-5 py-4 transition open:border-[#6b4a7a]/40 open:bg-white hover:bg-white"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-neutral-900 outline-none">
                  <div className="flex items-center justify-between gap-4">
                    <span className="leading-snug">{q}</span>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#211527] text-white transition group-open:rotate-45 group-open:bg-[#6b4a7a]" aria-hidden>
                      +
                    </span>
                  </div>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{a}</p>
              </details>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid gap-8 rounded-[2rem] border border-[#211527]/10 bg-white p-6 shadow-lg shadow-neutral-200/50 md:p-10 lg:grid-cols-[18rem_1fr] lg:gap-12"
        >
          <div className="rounded-[1.5rem] bg-[#211527] p-6 text-white lg:self-start">
            <h2 className="text-3xl font-black tracking-tight">Request a quote</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Add one row per product style. Use &quot;Mixed sizes&quot; or notes for complex orders.
            </p>
            <ol className="mt-6 space-y-4 text-sm">
              {['Tell us what you need', 'We reply with a quote', 'Approve artwork and we print'].map((t, i) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f2ceff] text-sm font-bold text-[#211527]">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ol>
          </div>

          <form id="quote-form" onSubmit={handleSubmit} className="scroll-mt-28 space-y-10">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-neutral-800">Your name *</label>
                <input
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-neutral-900 outline-none transition focus:border-[#211527] focus:ring-2 focus:ring-[#6b4a7a]/25"
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-neutral-800">Email *</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-neutral-900 outline-none focus:border-[#211527] focus:ring-2 focus:ring-[#6b4a7a]/25"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-neutral-800">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-neutral-900 outline-none focus:border-[#211527] focus:ring-2 focus:ring-[#6b4a7a]/25"
                  autoComplete="tel"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-neutral-800">School or business name</label>
                <input
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-neutral-900 outline-none focus:border-[#211527] focus:ring-2 focus:ring-[#6b4a7a]/25"
                  placeholder="e.g. Riverside High / Acme Pty Ltd"
                />
              </div>
            </div>

            <div>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-bold text-neutral-900">Line items</h3>
                <button
                  type="button"
                  onClick={addLine}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#211527] px-5 py-2 text-sm font-semibold text-[#211527] transition hover:bg-[#211527] hover:text-white"
                >
                  <Plus className="h-4 w-4" aria-hidden />
                  Add another product
                </button>
              </div>

              <div className="space-y-6">
                {lines.map((line, index) => (
                  <div
                    key={line.id}
                    className="rounded-2xl border border-[#211527]/10 bg-[#f3eff5] p-4 md:p-5"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                        Item {index + 1}
                      </span>
                      {lines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLine(line.id)}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden />
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div className="md:col-span-2 lg:col-span-1">
                        <label id={`pt-${line.id}`} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                          Product type
                        </label>
                        <SelectMenu
                          labelledBy={`pt-${line.id}`}
                          value={line.productType}
                          onChange={(v) => updateLine(line.id, 'productType', v)}
                          options={PRODUCT_TYPES.map((p) => ({ value: p.id, label: p.label }))}
                        />
                      </div>
                      <div>
                        <label id={`sz-${line.id}`} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                          Size
                        </label>
                        <SelectMenu
                          labelledBy={`sz-${line.id}`}
                          value={line.size}
                          onChange={(v) => updateLine(line.id, 'size', v)}
                          options={SIZES.map((x) => ({ value: x, label: x }))}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                          <Palette className="h-3.5 w-3.5" aria-hidden />
                          Colour / finish
                        </label>
                        <input
                          value={line.color}
                          onChange={(e) => updateLine(line.id, 'color', e.target.value)}
                          placeholder="e.g. Navy, Heather grey, Matte black mug"
                          className="w-full rounded-full border border-[#211527]/20 bg-white px-5 py-3 text-sm outline-none focus:border-[#211527] focus:ring-2 focus:ring-[#f2ceff]"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                          <Hash className="h-3.5 w-3.5" aria-hidden />
                          Quantity
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={line.quantity}
                          onChange={(e) =>
                            updateLine(line.id, 'quantity', Math.max(1, Number(e.target.value) || 1))
                          }
                          className="w-full rounded-full border border-[#211527]/20 bg-white px-5 py-3 text-sm tabular-nums outline-none focus:border-[#211527] focus:ring-2 focus:ring-[#f2ceff]"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                          <Calendar className="h-3.5 w-3.5" aria-hidden />
                          Needed by *
                        </label>
                        <input
                          type="date"
                          style={{ colorScheme: 'light' }}
                          min={minDate}
                          value={line.neededBy}
                          onChange={(e) => updateLine(line.id, 'neededBy', e.target.value)}
                          className="w-full rounded-full border border-[#211527]/20 bg-white px-5 py-3 text-sm outline-none focus:border-[#211527] focus:ring-2 focus:ring-[#f2ceff]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-neutral-800">
                Logo, artwork & extra detail
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-[#211527] focus:ring-2 focus:ring-[#6b4a7a]/25"
                placeholder="Upload links (Dropbox/Drive), Pantone codes, placement notes, student year groups, delivery address, etc."
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-neutral-500">
                We email you a confirmation and reply with a quote. Prefer WhatsApp? Put your number above and mention it in the notes.
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#211527] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-14px_rgba(33,21,39,0.7)] transition hover:bg-[#33203f]"
              >
                <Send className="h-4 w-4" aria-hidden />
                Send request
              </button>
            </div>
          </form>
        </motion.section>
      </div>
    </div>
  );
};

export default BrandingServicesPage;
