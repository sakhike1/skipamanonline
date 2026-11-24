import React, { useEffect, useMemo, useState } from 'react';
import AnimatedHeading from '../components/ui/AnimatedHeading';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Eye,
  Grid,
  List,
  ArrowRight,
  ArrowLeft,
  Star,
  Tag,
  X,
  Building2,
  Shirt,
  Pause,
  Play,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
export type LookbookFilter = 'All' | 'Retail collection' | 'Custom branding';

interface LookbookItem {
  id: string;
  title: string;
  description: string;
  /** One-line editorial hook (drop theme) */
  theme: string;
  /** Materials / weight / hand-feel */
  fabrics: string;
  /** Fit intent: silhouette, who it flatters, how to size */
  fitNotes: string;
  /** “Styled with” — cross-sell product ids */
  styledWith: { id: string; name: string }[];
  category: LookbookFilter;
  season: string;
  featured: boolean;
  images: string[];
  products: string[];
  tags: string[];
  createdAt: string;
}

interface StorySeed {
  id: string;
  title: string;
  description: string;
  theme: string;
  fabrics: string;
  fitNotes: string;
  /** Product ids for “styled with” editorial picks */
  styledWithProductIds: string[];
  category: Exclude<LookbookFilter, 'All'>;
  season: string;
  featured: boolean;
  productIds: string[];
  tags: string[];
}

const LOOKBOOK_SEEDS: StorySeed[] = [
  {
    id: 'retail-signature',
    title: 'Skipaman signature',
    description:
      'Our house tees and everyday fits, consistent trims, premium cotton, and the Skipaman mark. This is the retail line you can order online today.',
    theme: 'Quiet confidence: everyday uniform for city heat and campus halls.',
    fabrics:
      'Mid-weight combed cotton with a soft hand; rib collars that recover instead of baconing after washes. Dark bases read cleaner under SA sun.',
    fitNotes:
      'True-to-size relaxed block: slightly dropped shoulder for a modern line without swimming in fabric. Size up if you layer heavy hoodies underneath.',
    styledWithProductIds: ['2', '7'],
    category: 'Retail collection',
    season: 'Core drop',
    featured: true,
    productIds: ['1', '3', '6'],
    tags: ['Retail', 'Basics', 'Organic cotton'],
  },
  {
    id: 'retail-graphic',
    title: 'Graphics & street',
    description:
      'Bold prints, colour, and attitude, designed to stand out on the street while staying comfortable wash after wash.',
    theme: 'Statement graphics: one hero tee carries the whole fit.',
    fabrics:
      'Screen-friendly ringspun bases; inks specified for stretch so chest prints don’t crack when you move. Colour runs chosen to stay vivid on black and garment-dye.',
    fitNotes:
      'Regular fit through body; graphic sits high on chest for visibility under open shirts. Prefer a boxier street shape? Take one size up and tuck or crop.',
    styledWithProductIds: ['1', '10'],
    category: 'Retail collection',
    season: 'Seasonal',
    featured: true,
    productIds: ['2', '4', '9', '11'],
    tags: ['Graphic', 'Street', 'Statement'],
  },
  {
    id: 'retail-layers',
    title: 'Layers & motion',
    description:
      'Long sleeves, athletic cuts, and pieces that move with you, from campus to weekend runs.',
    theme: 'Movement first: layers that breathe when you pick up pace.',
    fabrics:
      'Performance blends and lighter fleece where we need warmth without bulk; panels aligned so seams don’t ride on runs.',
    fitNotes:
      'Athletic taper: closer in sleeve and hem than our casual tees. If you’re between sizes and wear street sneakers not trainers, take your larger size.',
    styledWithProductIds: ['4', '6'],
    category: 'Retail collection',
    season: 'Athletic',
    featured: false,
    productIds: ['7', '10', '12'],
    tags: ['Layering', 'Sport', 'Comfort'],
  },
  {
    id: 'branding-schools',
    title: 'Schools & teams',
    description:
      'House shirts, jerseys, and kit in your colours. We quote on size runs, delivery dates, and artwork, ideal for terms, tours, and sports seasons.',
    theme: 'Pride of place: kit that reads sharp in photos and lasts the season.',
    fabrics:
      'Bulk-friendly jersey and interlock options; we match fabric weight to sport (breathable for court, hard-wearing for contact training).',
    fitNotes:
      'Unisex blocks with youth and adult grading; name/number placement follows league-safe zones so prints survive tackles and washes.',
    styledWithProductIds: ['5', '8'],
    category: 'Custom branding',
    season: 'Bulk & uniform',
    featured: true,
    productIds: ['2', '5', '8'],
    tags: ['Schools', 'Teams', 'Jerseys'],
  },
  {
    id: 'branding-business',
    title: 'Business & events',
    description:
      'Staff tees, polos, caps, and drinkware with your logo. Tell us quantities, colours, and deadlines, we handle the rest on our branding desk.',
    theme: 'On-brand presence: from launch day to festival stalls.',
    fabrics:
      'Polos and tees chosen for embroidery stability and print opacity on corporate neutrals; we swatch before full runs.',
    fitNotes:
      'Business cuts: true shoulders and hem length that works tucked or untucked. Event tees stay retail-soft so staff actually wear them after day one.',
    styledWithProductIds: ['6', '14'],
    category: 'Custom branding',
    season: 'Corporate',
    featured: false,
    productIds: ['1', '6', '3'],
    tags: ['Workwear', 'Events', 'Logo'],
  },
  {
    id: 'branding-polos-uniform',
    title: 'Polos & uniform tops',
    description:
      'Business polos, layered flannels, and athletic tops for crews on the move, ready for embroidery, screen print, or heat transfer in your palette.',
    theme: 'Crew-ready layers: looks sharp under high-vis or on its own.',
    fabrics:
      'Pique and jersey polos with collar resilience; flannel and overshirt weights balanced for SA winters without stiff cardboard feel.',
    fitNotes:
      'Workplace polos: measured placket length for logo clearance. Layer pieces sized to sit over thermals without pulling at the buttons.',
    styledWithProductIds: ['13', '15'],
    category: 'Custom branding',
    season: 'Workplace',
    featured: false,
    productIds: ['15', '14', '13'],
    tags: ['Polos', 'Layers', 'Crew kit'],
  },
];

function buildLookbookItem(seed: StorySeed): LookbookItem {
  const images: string[] = [];
  const productIds: string[] = [];
  for (const pid of seed.productIds) {
    const p = products.find((x) => x.id === pid);
    if (p) {
      productIds.push(pid);
      for (const src of p.images.slice(0, 2)) {
        if (images.length < 6 && !images.includes(src)) images.push(src);
      }
    }
  }
  const fallback = products[0]?.images[0];
  if (images.length === 0 && fallback) images.push(fallback);

  const styledWith = seed.styledWithProductIds
    .map((id) => {
      const p = products.find((x) => x.id === id);
      return p ? { id: p.id, name: p.name } : null;
    })
    .filter((x): x is { id: string; name: string } => x !== null);

  return {
    id: seed.id,
    title: seed.title,
    description: seed.description,
    theme: seed.theme,
    fabrics: seed.fabrics,
    fitNotes: seed.fitNotes,
    styledWith,
    category: seed.category,
    season: seed.season,
    featured: seed.featured,
    images,
    products: productIds,
    tags: seed.tags,
    createdAt: '2025-05-01',
  };
}

const lookbookSlides = [
  { src: '/images/blue1.png', alt: 'Blue Skipaman tee', backdrop: '#413a36', imageStyle: '' },
  { src: '/images/orange1.png', alt: 'Orange Skipaman top', backdrop: '#f5ceeb', imageStyle: 'scale-[1.13] mix-blend-multiply' },
  { src: '/images/white1.png', alt: 'White Skipaman tee', backdrop: '#eeeeee', imageStyle: '' },
] as const;

const LookbookPage: React.FC = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const lookbookData = useMemo(() => LOOKBOOK_SEEDS.map(buildLookbookItem), []);

  const [selectedCategory, setSelectedCategory] = useState<LookbookFilter>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedLookbook, setSelectedLookbook] = useState<LookbookItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const reduceMotion = useReducedMotion();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const slide = lookbookSlides[activeSlide];

  useEffect(() => {
    if (reduceMotion || !isPlaying) return;
    const timer = window.setInterval(() => {
      setActiveSlide((index) => (index + 1) % lookbookSlides.length);
    }, 3800);
    return () => window.clearInterval(timer);
  }, [isPlaying, reduceMotion]);

  const categories: LookbookFilter[] = ['All', 'Retail collection', 'Custom branding'];

  const filteredLookbooks =
    selectedCategory === 'All'
      ? lookbookData
      : lookbookData.filter((item) => item.category === selectedCategory);

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      addToCart(productId, product.sizes[0], product.colors[0], 1);
    }
  };

  const openLookbookModal = (lookbook: LookbookItem) => {
    setSelectedLookbook(lookbook);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLookbook(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@400;500;600&display=swap');
        .lb-wide{font-family:'Syne','Outfit',system-ui,sans-serif;font-weight:800}
        .lb-sans{font-family:'Outfit','Inter',system-ui,sans-serif}
      `}</style>
      <section
        aria-labelledby="lookbook-hero-heading"
        className="lb-sans relative flex flex-col justify-center overflow-hidden bg-[#f1f3f5] px-3 pb-8 pt-24 text-[#111] sm:px-6 md:h-[100svh] md:min-h-[38rem] md:pb-8 md:pt-24"
      >
        <div className="relative mx-auto w-full max-w-7xl">
          {/* stacked sheet behind the card */}
          <div aria-hidden className="absolute inset-x-3 -top-3 bottom-3 hidden rotate-[1.2deg] rounded-[2.5rem] bg-white/60 md:block" />
          <div className="relative rounded-[1.75rem] bg-white px-5 pb-8 pt-8 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.35)] sm:px-10 md:-rotate-[1.2deg] md:rounded-[2.5rem] md:px-14 md:pb-8 md:pt-8">
            <div className="grid items-end gap-8 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)] md:gap-0">
              <div className="relative z-10 min-w-0 md:pb-4">
                <p className="text-sm font-medium text-[#111]/60">The Skipaman Lookbook</p>
                <AnimatedHeading
                  id="lookbook-hero-heading"
                  variant="rise"
                  className="lb-wide mt-3 text-[clamp(2.1rem,9.5vw,3.6rem)] leading-[1.02] tracking-[-0.03em] md:mt-[clamp(1.5rem,9svh,6rem)] md:text-[clamp(2.2rem,min(5.4vw,9.5svh),5.25rem)] md:-mr-24"
                  lines={[{ text: 'Streetwear' }, { text: 'in focus.' }]}
                />
                <p className="mt-6 max-w-md text-base leading-relaxed text-[#111]/70">
                  Everyday streetwear, styled by Skipaman. Explore our fits and see what we make for schools, teams, and
                  businesses.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a
                    href="#lookbook-stories"
                    className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#111] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111]"
                  >
                    Browse the stories
                    <ArrowRight size={16} aria-hidden />
                  </a>
                  <Link
                    to="/shop"
                    className="inline-flex min-h-12 items-center rounded-full border border-[#111]/25 px-6 py-3 text-sm font-semibold transition hover:border-[#111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111]"
                  >
                    Shop retail
                  </Link>
                  <Link
                    to="/virtual-stylist"
                    className="inline-flex min-h-12 items-center px-2 text-sm font-semibold underline underline-offset-4 transition hover:text-[#4b2c83]"
                  >
                    Branding &amp; quotes
                  </Link>
                </div>
              </div>

              <div className="relative min-w-0 md:rotate-[1.5deg]" role="group" aria-label="Lookbook photos">
                <div className="relative h-[clamp(22rem,52vw,38rem)] overflow-hidden md:h-[clamp(20rem,calc(100svh-13rem),40rem)] rounded-[1.5rem] bg-[#e4e7ea] md:rounded-[2rem]">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={slide.src}
                      initial={reduceMotion ? false : { x: '12%', opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={reduceMotion ? undefined : { x: '-12%', opacity: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                      style={{ backgroundColor: slide.backdrop }}
                      className="absolute inset-0"
                    >
                      <img src={slide.src} alt={slide.alt} className="h-full w-full object-cover" />
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                    {!reduceMotion && (
                      <button
                        type="button"
                        aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                        onClick={() => setIsPlaying((playing) => !playing)}
                        className="grid h-11 w-11 place-items-center rounded-xl bg-white shadow-md transition hover:bg-[#f1f3f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#111]"
                      >
                        {isPlaying ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
                      </button>
                    )}
                    <button
                      type="button"
                      aria-label="Previous look"
                      onClick={() => {
                        setIsPlaying(false);
                        setActiveSlide((i) => (i - 1 + lookbookSlides.length) % lookbookSlides.length);
                      }}
                      className="grid h-11 w-11 place-items-center rounded-xl bg-white shadow-md transition hover:bg-[#f1f3f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#111]"
                    >
                      <ArrowLeft size={18} aria-hidden />
                    </button>
                    <button
                      type="button"
                      aria-label="Next look"
                      onClick={() => {
                        setIsPlaying(false);
                        setActiveSlide((i) => (i + 1) % lookbookSlides.length);
                      }}
                      className="grid h-11 w-11 place-items-center rounded-xl bg-white shadow-md transition hover:bg-[#f1f3f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#111]"
                    >
                      <ArrowRight size={18} aria-hidden />
                    </button>
                  </div>
                </div>

                {/* floating glass card */}
                <div className="absolute -left-2 top-6 z-20 flex max-w-[16.5rem] items-center gap-3 rounded-2xl border border-white/80 bg-white/75 p-2.5 pr-4 shadow-xl backdrop-blur-md sm:-left-10 md:top-14 md:-rotate-[5deg]">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl" style={{ backgroundColor: slide.backdrop }}>
                    <img src={slide.src} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold leading-tight">{slide.alt}</p>
                    <p className="mt-0.5 text-xs text-[#111]/55">
                      Look {activeSlide + 1} of {lookbookSlides.length}
                    </p>
                    <Link
                      to="/shop"
                      className="mt-1.5 inline-flex min-h-8 items-center rounded-lg bg-[#111] px-3 text-xs font-semibold text-white transition hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111]"
                    >
                      Shop this look
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div
        id="lookbook-stories"
        className="sticky top-0 z-40 scroll-mt-24 border-b border-neutral-200 bg-white/95 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-stretch justify-between gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-neutral-900 text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 self-end rounded-lg border border-neutral-200 bg-neutral-50 p-1 sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`rounded-md p-2 transition ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-neutral-200'}`}
              aria-label="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`rounded-md p-2 transition ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-neutral-200'}`}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          layout
          className={`grid gap-10 ${
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
          }`}
        >
          <AnimatePresence>
            {filteredLookbooks.map((lookbook, index) => (
              <motion.article
                key={lookbook.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className={`group relative flex overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg ${
                  viewMode === 'list' ? 'flex-col md:flex-row md:items-stretch' : 'flex-col'
                }`}
              >
                <div
                  className={`relative overflow-hidden bg-neutral-900 ${
                    viewMode === 'list' ? 'md:w-[46%]' : 'aspect-[4/5]'
                  }`}
                >
                  <img
                    src={lookbook.images[0]}
                    alt={lookbook.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/75" />

                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-md border border-white/25 bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
                    {lookbook.category === 'Custom branding' ? (
                      <Building2 className="h-3.5 w-3.5 text-amber-300" aria-hidden />
                    ) : (
                      <Shirt className="h-3.5 w-3.5 text-red-300" aria-hidden />
                    )}
                    {lookbook.category}
                  </div>

                  <div className="absolute right-4 top-4 flex flex-col items-end gap-2">
                    {lookbook.featured && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/50 bg-amber-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        <Star size={12} className="fill-white" aria-hidden />
                        Featured
                      </span>
                    )}
                    <span className="rounded-md border border-white/20 bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-200">
                      {lookbook.season}
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-5 flex justify-center opacity-0 transition group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => openLookbookModal(lookbook)}
                      className="flex h-11 w-11 items-center justify-center rounded-md border border-white/30 bg-white/90 text-neutral-900 shadow-lg transition hover:scale-105"
                      aria-label={`Open ${lookbook.title}`}
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>

                <div
                  className={`relative flex flex-1 flex-col p-6 md:p-7 ${
                    viewMode === 'list' ? 'md:w-[54%] md:justify-center' : ''
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    Story {index + 1}
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-neutral-900 md:text-3xl">
                    {lookbook.title}
                  </h2>
                  <p className="mt-3 text-sm font-semibold leading-snug text-neutral-800">{lookbook.theme}</p>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-600">{lookbook.description}</p>
                  <div className="mt-4 space-y-2 border-l-2 border-neutral-200 pl-4">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">Fabrics</p>
                    <p className="line-clamp-2 text-sm text-neutral-600">{lookbook.fabrics}</p>
                    <p className="pt-1 text-[11px] font-bold uppercase tracking-widest text-neutral-500">Fit notes</p>
                    <p className="line-clamp-2 text-sm text-neutral-600">{lookbook.fitNotes}</p>
                  </div>
                  {lookbook.styledWith.length > 0 && (
                    <div className="mt-4">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">Styled with</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {lookbook.styledWith.map((sw) => (
                          <button
                            key={sw.id}
                            type="button"
                            onClick={() => {
                              navigate(`/product/${sw.id}`);
                            }}
                            className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50"
                          >
                            {sw.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {lookbook.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-700"
                      >
                        <Tag size={11} aria-hidden />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => openLookbookModal(lookbook)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
                    >
                      View story
                      <ArrowRight size={16} className="transition group-hover:translate-x-0.5" aria-hidden />
                    </button>
                    {lookbook.category === 'Custom branding' ? (
                      <Link
                        to="/virtual-stylist"
                        className="inline-flex flex-1 items-center justify-center rounded-md border border-neutral-300 bg-white px-4 py-3 text-center text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
                      >
                        Start a quote
                      </Link>
                    ) : (
                      <Link
                        to="/shop"
                        className="inline-flex flex-1 items-center justify-center rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
                      >
                        Shop this vibe
                      </Link>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedLookbook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            onClick={closeModal}
            role="presentation"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-neutral-100 bg-gradient-to-r from-neutral-900 to-neutral-800 p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black md:text-3xl">{selectedLookbook.title}</h2>
                    <p className="mt-3 max-w-2xl text-base font-semibold leading-snug text-white/95">
                      {selectedLookbook.theme}
                    </p>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-300 md:text-base">
                      {selectedLookbook.description}
                    </p>
                    <div className="mt-6 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-2">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">Fabrics</p>
                        <p className="mt-2 text-sm leading-relaxed text-neutral-200">{selectedLookbook.fabrics}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">Fit notes</p>
                        <p className="mt-2 text-sm leading-relaxed text-neutral-200">{selectedLookbook.fitNotes}</p>
                      </div>
                    </div>
                    {selectedLookbook.styledWith.length > 0 && (
                      <div className="mt-6">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">Styled with</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {selectedLookbook.styledWith.map((sw) => (
                            <button
                              key={sw.id}
                              type="button"
                              onClick={() => {
                                closeModal();
                                navigate(`/product/${sw.id}`);
                              }}
                              className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
                            >
                              {sw.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-md bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                        {selectedLookbook.category}
                      </span>
                      <span className="rounded-md bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                        {selectedLookbook.season}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="shrink-0 rounded-md bg-white/10 p-2 transition hover:bg-white/20"
                    aria-label="Close"
                  >
                    <X size={22} />
                  </button>
                </div>
              </div>

              <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-6">
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {selectedLookbook.images.map((image, idx) => (
                    <motion.div
                      key={`${selectedLookbook.id}-img-${idx}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100"
                    >
                      <img
                        src={image}
                        alt={`${selectedLookbook.title} ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>

                <div className="border-t border-neutral-200 pt-8">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-xl font-bold text-neutral-900">Pieces in this story</h3>
                    {selectedLookbook.category === 'Custom branding' && (
                      <Link
                        to="/virtual-stylist"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:text-red-800"
                        onClick={closeModal}
                      >
                        Request this type of job
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {selectedLookbook.products.map((productId) => {
                      const product = products.find((p) => p.id === productId);
                      if (!product) return null;
                      return (
                        <div
                          key={productId}
                          className="group overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 transition hover:shadow-md"
                        >
                          <button
                            type="button"
                            className="relative block aspect-square w-full overflow-hidden text-left"
                            onClick={() => {
                              closeModal();
                              navigate(`/product/${productId}`);
                            }}
                          >
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          </button>
                          <div className="p-4">
                            <h4 className="font-semibold text-neutral-900">{product.name}</h4>
                            <p className="mt-1 text-sm font-bold text-red-600">
                              R{(product.price / 100).toFixed(2)}
                            </p>
                            <div className="mt-3 flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleAddToCart(productId)}
                                className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-neutral-900 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800"
                              >
                                <ShoppingBag size={14} aria-hidden />
                                Add
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  closeModal();
                                  navigate(`/product/${productId}`);
                                }}
                                className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-neutral-300 bg-white py-2 text-xs font-semibold text-neutral-800 transition hover:bg-neutral-50"
                              >
                                <Heart size={14} aria-hidden />
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LookbookPage;
