import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
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
  const [notes, setNotes] = useState('');
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
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-100 text-neutral-900 pt-24 pb-20 md:pt-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.header
          className="mb-12 text-center md:mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-neutral-600 shadow-sm">
            <Building2 className="h-4 w-4" aria-hidden />
            Printing & branding (Centurion)
          </div>
          <h1 className="text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
            T-shirt printing, uniforms &{' '}
            <span className="bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
              corporate branding
            </span>{' '}
            in Centurion
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-neutral-600">
            Need <strong>bulk t-shirt printing</strong>, <strong>uniform printing</strong>, or <strong>cheap branded t-shirts</strong> for schools,
            teams, and businesses? We handle <strong>DTF</strong>, <strong>screen printing</strong>, and <strong>vinyl printing</strong>, plus caps and
            branded mugs/cups—served from <strong>Centurion, Gauteng</strong> with delivery across South Africa.
            Tell us what you need below: <strong>sizes</strong>, <strong>colours</strong>, <strong>quantity</strong>, and <strong>deadline</strong>.
            We&apos;ll reply with a quote and artwork checklist.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-neutral-500">
            <Link to="/printing" className="font-medium text-neutral-700 underline-offset-4 hover:underline">
              City &amp; service guides
            </Link>
            <span className="text-neutral-400"> — </span>
            minimums, lead times, and FAQs for Centurion, Pretoria, Johannesburg, and each print method.
          </p>
        </motion.header>

        {/* Service tiles */}
        <div className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: GraduationCap, title: 'Schools & matric', text: 'School t-shirts, sports tees, matric jerseys, house colours.' },
            { icon: Shirt, title: 'Business & uniforms', text: 'Staff uniforms, golf shirts printing, corporate wear, event tees.' },
            { icon: Coffee, title: 'Cups & mugs', text: 'Branded mugs, travel cups, corporate gifts (small or bulk runs).' },
            { icon: CircleDot, title: 'Caps & headwear', text: 'Branded caps, beanies, team lids—embroidery or print.' },
            { icon: Palette, title: 'DTF / screen / vinyl', text: 'DTF printing, screen printing South Africa, vinyl finishes.' },
            { icon: Calendar, title: 'Fast turnarounds', text: 'T-shirt printing near you in Centurion—share your date, we plan backwards.' },
          ].map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-neutral-200/80 bg-white/90 p-5 shadow-sm"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-neutral-900 text-white">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h2 className="text-base font-bold text-neutral-900">{title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">{text}</p>
            </motion.div>
          ))}
        </div>

        {/* FAQ — helps SEO + answers high-intent questions */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
          className="mb-14 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-10"
          aria-labelledby="branding-faq-heading"
        >
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">FAQ</p>
            <h2 id="branding-faq-heading" className="mt-2 text-2xl font-black tracking-tight text-neutral-900 md:text-3xl">
              Custom t-shirt printing & uniforms in Centurion
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              Quick answers for schools and businesses looking for bulk t-shirt printing, uniform printing, caps, cups, and corporate branding.
            </p>
          </div>

          <div className="mt-8 grid gap-3">
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
                className="group rounded-xl border border-neutral-200 bg-neutral-50/60 px-5 py-4 transition hover:bg-neutral-50"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-neutral-900 outline-none">
                  <div className="flex items-center justify-between gap-4">
                    <span className="leading-snug">{q}</span>
                    <span className="text-neutral-500 transition group-open:rotate-45" aria-hidden>
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
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg shadow-neutral-200/50 md:p-10"
        >
          <h2 className="text-2xl font-black text-neutral-900">Request a quote</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Add one row per product style. Use &quot;Mixed sizes&quot; or notes for complex orders.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-10">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-neutral-800">Your name *</label>
                <input
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full rounded-md border border-neutral-300 px-4 py-3 text-neutral-900 outline-none ring-neutral-900/0 transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/15"
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
                  className="w-full rounded-md border border-neutral-300 px-4 py-3 text-neutral-900 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/15"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-neutral-800">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-md border border-neutral-300 px-4 py-3 text-neutral-900 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/15"
                  autoComplete="tel"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-neutral-800">School or business name</label>
                <input
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full rounded-md border border-neutral-300 px-4 py-3 text-neutral-900 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/15"
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
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-neutral-300 bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
                >
                  <Plus className="h-4 w-4" aria-hidden />
                  Add another product
                </button>
              </div>

              <div className="space-y-6">
                {lines.map((line, index) => (
                  <div
                    key={line.id}
                    className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-4 md:p-5"
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
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                          Product type
                        </label>
                        <select
                          value={line.productType}
                          onChange={(e) => updateLine(line.id, 'productType', e.target.value)}
                          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/15"
                        >
                          {PRODUCT_TYPES.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                          Size
                        </label>
                        <select
                          value={line.size}
                          onChange={(e) => updateLine(line.id, 'size', e.target.value)}
                          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/15"
                        >
                          {SIZES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                          <Palette className="h-3.5 w-3.5" aria-hidden />
                          Colour / finish
                        </label>
                        <input
                          value={line.color}
                          onChange={(e) => updateLine(line.id, 'color', e.target.value)}
                          placeholder="e.g. Navy, Heather grey, Matte black mug"
                          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/15"
                        />
                      </div>
                      <div>
                        <label className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-neutral-600">
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
                          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm tabular-nums outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/15"
                        />
                      </div>
                      <div>
                        <label className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                          <Calendar className="h-3.5 w-3.5" aria-hidden />
                          Needed by *
                        </label>
                        <input
                          type="date"
                          min={minDate}
                          value={line.neededBy}
                          onChange={(e) => updateLine(line.id, 'neededBy', e.target.value)}
                          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/15"
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
                className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/15"
                placeholder="Upload links (Dropbox/Drive), Pantone codes, placement notes, student year groups, delivery address, etc."
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-neutral-500">
                Submit opens your email with everything filled in. Prefer WhatsApp? Put your number above and mention it in the notes.
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-neutral-900 px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-neutral-800"
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
