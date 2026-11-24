import { motion, useReducedMotion } from 'framer-motion';
import AnimatedHeading from '../components/ui/AnimatedHeading';
import { ArrowRight, BookOpen, Filter, Palette, Search, X } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FilterResultsFillerBanner from '../components/ui/FilterResultsFillerBanner';
import Skeleton from '../components/ui/LoadingSkeleton';
import { useHeader } from '../context/HeaderContext';
import { useProductData } from '../context/ProductDataContext';
import { getFeaturedProducts } from '../data/products';
import { Product } from '../types';

const PRODUCTS_PER_PAGE = 12;

interface ProductCardProps {
  product: Product;
  onClick: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [cover, alternate] = product.images ?? [];

  return (
    <article className="group relative flex h-full min-w-0 flex-col rounded-2xl border border-[#e9e2e3] bg-white p-2 hover:border-[#bfaeb8] focus-within:border-[#bfaeb8] sm:p-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#f0eeed]">
        {cover ? (
          <img src={cover} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <span className="grid h-full place-items-center p-2 text-center text-sm text-neutral-600">Photo unavailable</span>
        )}
        {alternate && (
          <img src={alternate} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 motion-safe:transition-opacity [@media(hover:hover)]:group-hover:opacity-100" />
        )}
      </div>
      <div className="flex flex-1 flex-col px-1 pb-1 pt-3 sm:px-2">
        <h3 className="text-base font-semibold leading-snug text-[#241d21]">{product.name}</h3>
        <p className="mt-1 text-sm tabular-nums text-[#5b5256]">R{(product.price / 100).toFixed(2)}</p>
        <div className="mt-auto pt-3">
          <button
            type="button"
            aria-label={'View ' + product.name}
            onClick={() => onClick(product.id)}
            className="min-h-11 w-full rounded-full border border-[#dbcdd5] px-2 py-2 text-sm font-semibold text-[#382634] transition-colors after:absolute after:inset-0 after:rounded-2xl hover:border-[#382634] hover:bg-[#382634] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            View product
          </button>
        </div>
      </div>
    </article>
  );
};

const NewArrivalsPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, loading: productsLoading } = useProductData();
  const { setIsHeaderDark } = useHeader();
  const reduceMotion = useReducedMotion();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const maxProducts = 200;

  useEffect(() => {
    setIsHeaderDark(true);
    return () => {
      setIsHeaderDark(false);
    };
  }, [setIsHeaderDark]);

  useEffect(() => {
    const loadAllProducts = async () => {
      setIsInitialLoading(true);

      let allProducts: Product[] = [];

      if (products && products.length > 0) {
        allProducts = products.slice(0, maxProducts);
      } else {
        allProducts = getFeaturedProducts().slice(0, maxProducts);
      }

      setDisplayedProducts(allProducts);
      setIsInitialLoading(false);
    };

    if (!productsLoading) {
      loadAllProducts();
    }
  }, [products, productsLoading]);

  const categories = [...new Set(displayedProducts.map((product) => product.category))];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowFilters(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredProducts = displayedProducts.filter((product) => {
    const matchesSearch =
      searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const totalFilteredPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));

  useEffect(() => {
    if (filteredProducts.length === 0) {
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
      return;
    }

    if (currentPage > totalFilteredPages) {
      setCurrentPage(totalFilteredPages);
    } else if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [currentPage, filteredProducts.length, totalFilteredPages]);

  const startIndex = useMemo(() => (currentPage - 1) * PRODUCTS_PER_PAGE, [currentPage]);
  const paginatedProducts = useMemo(
    () => filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE),
    [filteredProducts, startIndex]
  );
  const showingStart = filteredProducts.length === 0 ? 0 : startIndex + 1;
  const showingEnd = Math.min(startIndex + PRODUCTS_PER_PAGE, filteredProducts.length);


  const isFilterActive = useMemo(
    () =>
      selectedCategory !== null ||
      searchQuery.trim().length > 0 ||
      priceRange[0] > 0 ||
      priceRange[1] < 50000,
    [selectedCategory, searchQuery, priceRange]
  );

  const hasNoResults = !isInitialLoading && filteredProducts.length === 0;

  const paginationResetKey = useMemo(
    () => [searchQuery, selectedCategory, priceRange[0], priceRange[1]].join('|'),
    [searchQuery, selectedCategory, priceRange]
  );

  const searchQueryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchQueryTimeoutRef.current) {
      clearTimeout(searchQueryTimeoutRef.current);
    }

    // Search query logging removed during Supabase migration.
    const timeoutId = searchQueryTimeoutRef.current;

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [searchQuery, filteredProducts.length]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const toggleFilters = () => setShowFilters(!showFilters);

  const clearFilters = () => {
    setSelectedCategory(null);
    setPriceRange([0, 50000]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    const clampedPage = Math.min(Math.max(pageNumber, 1), totalFilteredPages);
    if (clampedPage === currentPage) return;

    setCurrentPage(clampedPage);

    requestAnimationFrame(() => {
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [paginationResetKey]);

  const Pagination = () => {
    if (filteredProducts.length === 0) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;

      if (totalFilteredPages <= maxVisiblePages) {
        for (let i = 1; i <= totalFilteredPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) pages.push(i);
          pages.push('...');
          pages.push(totalFilteredPages);
        } else if (currentPage >= totalFilteredPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalFilteredPages - 3; i <= totalFilteredPages; i++) pages.push(i);
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
          pages.push('...');
          pages.push(totalFilteredPages);
        }
      }

      return pages;
    };

    return (
      <div className="mb-8 mt-12 flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          {getPageNumbers().map((page, index) => (
            <button
              key={typeof page === 'number' ? `page-${page}` : `nav-${index}-${String(page)}`}
              type="button"
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              disabled={page === '...'}
              className={`min-w-[2.5rem] rounded-full px-3 py-2 text-sm font-semibold transition ${
                page === currentPage
                  ? 'bg-[#382634] text-white'
                  : page === '...'
                    ? 'cursor-default border border-transparent text-neutral-400'
                    : 'border border-neutral-200 bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalFilteredPages}
            className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
        .na-hero{font-family:'Poppins','Inter',system-ui,sans-serif}
        @keyframes na-drift{0%,100%{transform:translateX(-50%) rotate(-2deg)}50%{transform:translateX(-50%) rotate(2deg)}}
        .na-ring{animation:na-drift 14s ease-in-out infinite}
        @media (prefers-reduced-motion:reduce){.na-ring{animation:none}}
      `}</style>
      <section
        aria-labelledby="new-arrivals-hero-title"
        className="na-hero relative isolate flex flex-col items-center justify-center overflow-hidden bg-[#05030f] px-4 pb-10 pt-28 text-white sm:px-6 md:min-h-[min(100svh,56rem)] md:pb-12 md:pt-28"
      >
        {/* glowing orbit rings */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="na-ring absolute left-1/2 top-[-22%] h-[78%] w-[118%] rounded-[50%] border border-[#b9a8ff]/50"
            style={{
              background: 'radial-gradient(closest-side, #05030f 62%, rgba(70,48,200,0.35) 100%)',
              boxShadow: '0 0 90px 18px rgba(104,74,255,0.55), inset 0 0 110px 16px rgba(122,96,255,0.55)',
            }}
          />
          <div
            className="na-ring absolute left-1/2 top-[-34%] h-[96%] w-[150%] rounded-[50%] border border-[#7a63ff]/25"
            style={{ boxShadow: '0 0 120px 10px rgba(70,50,210,0.35)', animationDelay: '-6s' }}
          />
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                'radial-gradient(1px 1px at 12% 22%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 28% 8%, #cfc6ff 50%, transparent 51%), radial-gradient(1.5px 1.5px at 8% 48%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 20% 64%, #cfc6ff 50%, transparent 51%), radial-gradient(1px 1px at 88% 30%, #fff 50%, transparent 51%), radial-gradient(1.5px 1.5px at 94% 58%, #cfc6ff 50%, transparent 51%), radial-gradient(1px 1px at 76% 12%, #fff 50%, transparent 51%)',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#05030f] to-transparent" />
        </div>

        <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <AnimatedHeading
            id="new-arrivals-hero-title"
            variant="drop"
            className="text-[clamp(3rem,9.5vw,8rem)] leading-[0.98] tracking-[-0.045em]"
            lines={[
              { text: 'New arrivals,', className: 'font-semibold' },
              {
                text: 'shop the latest drops',
                className: 'font-light',
                wordClassName: 'bg-gradient-to-r from-[#c9bcff] via-[#f2ceff] to-[#ffd4c4] bg-clip-text text-transparent',
              },
            ]}
          />
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-[32rem] text-pretty text-base leading-[1.6] text-white/70 sm:text-lg"
          >
            New Skipaman tees, hoodies and long sleeves, added this season. Choose your size and colour, order online, and have it delivered to your door.
          </motion.p>
        </div>
      </section>

      <section
        id="products-section"
        aria-labelledby="latest-collection-heading"
        className="min-h-screen scroll-mt-24 bg-[#fbfaf7] text-[#241d21]"
      >
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-4 sm:px-6 md:pb-16 md:pt-6 lg:px-8">
          <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-t border-[#e9e2e3] pt-7 md:mb-8 md:pt-9">
            <div>
              <h2 id="latest-collection-heading" className="font-serif text-[clamp(2.5rem,5.2vw,4.5rem)] leading-none tracking-[-0.045em]">
                Latest collection
              </h2>
              <p role="status" className="mt-2 text-sm tabular-nums text-[#5b5256]">
                Showing {showingStart}–{showingEnd} of {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>
            <div className="flex w-full min-w-0 flex-wrap items-center gap-2 md:w-auto">
              <label className="flex min-h-11 min-w-0 flex-[1_1_12rem] items-center gap-2 rounded-full border border-[#e0d5dc] bg-white px-4 focus-within:ring-2 focus-within:ring-[#76576d] md:w-72">
                <Search size={17} aria-hidden className="shrink-0 text-[#675560]" />
                <span className="sr-only">Search the latest collection</span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => handleSearch(event.target.value)}
                  placeholder="Search products"
                  className="w-full min-w-0 bg-transparent text-base outline-none"
                />
              </label>
              <button type="button" aria-expanded={showFilters} onClick={toggleFilters}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#dbcdd5] px-4 text-sm font-semibold text-[#382634] hover:bg-[#f4edf1] md:hidden"
              >
                {showFilters ? <X size={16} aria-hidden /> : <Filter size={16} aria-hidden />}
                {showFilters ? 'Hide filters' : 'Filters'}
              </button>
            </div>
          </header>

          {/*
            KEY CHANGE: When there are no results, switch to a single-column stacked layout
            so the sidebar doesn't create a huge gap next to the empty state card.
            When results exist, keep the original side-by-side layout.
          */}
          <div
            className={`flex gap-5 lg:gap-8 ${hasNoResults ? 'flex-col' : 'flex-col md:flex-row md:items-stretch'}`}
          >
            {/* Sidebar filters */}
            {(!isMobile || showFilters) && (
              <aside
                className={`flex flex-col rounded-2xl border border-neutral-200 bg-white p-5
                  ${
                    hasNoResults
                      ? // No results: full width, no self-stretch, no fixed md width
                        'w-full self-auto'
                      : // Normal: order-2 on mobile, fixed width column on desktop
                        'self-start md:w-56 md:shrink-0 md:self-stretch lg:w-64'
                  }
                `}
              >
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-900">
                    Filters
                  </h3>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-semibold text-neutral-500 transition hover:text-neutral-900"
                  >
                    Clear
                  </button>
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Category
                </p>

                {/* When no results, show filters inline/horizontal to keep it compact */}
                <div className={`mt-2 flex flex-wrap gap-2`}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(null);
                      setCurrentPage(1);
                    }}
                    className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                      selectedCategory === null
                        ? 'bg-[#382634] text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      aria-pressed={selectedCategory === category}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(selectedCategory === category ? null : category);
                        setCurrentPage(1);
                      }}
                      className={`rounded-full px-3 py-2 text-sm font-semibold capitalize transition ${
                        selectedCategory === category
                          ? 'bg-[#382634] text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className={`mt-6 ${hasNoResults ? 'max-w-sm' : ''}`}>
                  <label htmlFor="new-arrivals-price-cap" className="text-sm font-semibold text-[#382634]">Price cap</label>
                  <div className="mt-2 flex justify-between text-xs text-neutral-600">
                    <span>R{(priceRange[0] / 100).toFixed(0)}</span>
                    <span>R{(priceRange[1] / 100).toFixed(0)}</span>
                  </div>
                  <input
                    id="new-arrivals-price-cap"
                    type="range"
                    min={0}
                    max={50000}
                    value={priceRange[1]}
                    onChange={(e) => {
                      setPriceRange([priceRange[0], Number(e.target.value)]);
                      setCurrentPage(1);
                    }}
                    className="mt-3 w-full cursor-pointer accent-neutral-900"
                  />
                </div>

                {/* Only show the explore nav + video when we have results (saves space in empty state) */}
                {!hasNoResults && (
                  <div className="mt-8 flex min-h-0 flex-1 flex-col border-t border-neutral-100 pt-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Explore
                    </p>
                    <nav className="mt-3 flex flex-col gap-2" aria-label="Quick links">
                      <Link
                        to="/shop"
                        className="flex items-center justify-between gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm font-semibold text-neutral-900 transition hover:border-neutral-300 hover:bg-white"
                      >
                        Full shop
                        <ArrowRight className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden />
                      </Link>
                      <Link
                        to="/lookbook"
                        className="flex items-center justify-between gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm font-semibold text-neutral-900 transition hover:border-neutral-300 hover:bg-white"
                      >
                        <span className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-neutral-500" aria-hidden />
                          Lookbook
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden />
                      </Link>
                      <Link
                        to="/virtual-stylist"
                        className="flex items-center justify-between gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm font-semibold text-neutral-900 transition hover:border-neutral-300 hover:bg-white"
                      >
                        <span className="flex items-center gap-2">
                          <Palette className="h-4 w-4 text-neutral-500" aria-hidden />
                          Branding
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden />
                      </Link>
                    </nav>

                    {/* Fills the empty space under the filters */}
                    <div className="relative mt-5 hidden min-h-[12rem] flex-1 overflow-hidden rounded-xl bg-neutral-900 md:block">
                      <video
                        autoPlay={!window.matchMedia('(prefers-reduced-motion: reduce)').matches}
                        muted
                        loop
                        playsInline
                        aria-hidden
                        tabIndex={-1}
                        poster="/images/background1.jpg"
                        className="absolute inset-0 h-full w-full object-cover"
                      >
                        <source src="/images/background.mp4" type="video/mp4" />
                      </video>
                      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>
                  </div>
                )}
              </aside>
            )}

            {/* Products Grid */}
            <section
              className={`flex min-h-0 min-w-0 flex-1 flex-col ${hasNoResults ? '' : 'order-1 md:order-2'}`}
            >
              {isInitialLoading ? (
                <Skeleton type="product" count={8} />
              ) : filteredProducts.length > 0 ? (
                <div className="flex min-h-0 flex-1 flex-col">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid shrink-0 gap-3 min-[360px]:grid-cols-2 md:gap-4 xl:grid-cols-3 xl:gap-6"
                  >
                    {paginatedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onClick={handleProductClick}
                      />
                    ))}
                  </motion.div>

                  <div className="shrink-0">
                    <Pagination />
                  </div>

                  {filteredProducts.length >= maxProducts && (
                    <div className="mt-8 flex shrink-0 justify-center">
                      <div className="space-y-2 text-center">
                        <div className="text-sm text-gray-500">
                          You've reached our limit of {maxProducts} products
                        </div>
                        <div className="text-xs text-gray-400">
                          Browse our complete collection in the main shop
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate('/shop')}
                          className="mt-3 inline-flex items-center justify-center rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
                        >
                          View all products
                        </button>
                      </div>
                    </div>
                  )}

                  {isFilterActive && (
                    <FilterResultsFillerBanner
                      key={`${filteredProducts.length}-${priceRange[1]}-${selectedCategory ?? ''}-${searchQuery}`}
                      resultCount={filteredProducts.length}
                      onClearFilters={clearFilters}
                      secondaryCta={{ label: 'Browse full shop', onClick: () => navigate('/shop') }}
                      className="mt-8 flex-1 basis-0 min-h-[12rem]"
                    />
                  )}
                </div>
              ) : (
                /* Empty state — now sits full-width below the compact filter bar */
                <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white py-20">
                  <div className="max-w-md space-y-4 px-6 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                      <Search className="h-7 w-7 text-neutral-400" aria-hidden />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900">No products found</h3>
                    <p className="text-sm text-neutral-600">
                      {searchQuery
                        ? `No products match "${searchQuery}". Try a different search or reset filters.`
                        : 'Nothing matches these filters yet. Try clearing filters or pick another category.'}
                    </p>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
                    >
                      Clear filters
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewArrivalsPage;
