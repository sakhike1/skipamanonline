import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BookOpen, Eye, Filter, Palette, Search, ShoppingBag, X } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FilterResultsFillerBanner from '../components/ui/FilterResultsFillerBanner';
import HeroAmbientEffects from '../components/ui/HeroAmbientEffects';
import Skeleton from '../components/ui/LoadingSkeleton';
import SearchBar from '../components/ui/SearchBar';
import { useHeader } from '../context/HeaderContext';
import { useProductData } from '../context/ProductDataContext';
import { getFeaturedProducts } from '../data/products';
import { Product } from '../types';

const PRODUCTS_PER_PAGE = 12;

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
    tags?: string[];
  };
  onClick: (id: string) => void;
}

/** Product tile aligned with Lookbook: rounded-2xl white card, neutral-900 CTA (rounded-md). */
const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered || product.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [isHovered, product.images.length]);

  useEffect(() => {
    if (!isHovered || product.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }, 2500);
    return () => clearInterval(interval);
  }, [isHovered, product.images.length]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }
  }, [product.images.length]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const goProduct = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      onClick(product.id);
    },
    [onClick, product.id]
  );

  const tagLine =
    product.tags && product.tags.length > 0
      ? product.tags
          .slice(0, 3)
          .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
          .join(' · ')
      : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex h-full cursor-pointer flex-col"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(product.id)}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
          {product.images.map((imageSrc, index) => (
            <img
              key={`${product.id}-view-${index}-${imageSrc.slice(-32)}`}
              src={imageSrc}
              alt={product.name}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-300 ease-out ${
                index === currentImageIndex ? 'z-10 opacity-100' : 'z-0 opacity-0'
              }`}
            />
          ))}
          {product.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1">
              {product.images.map((_, imgIndex) => (
                <span
                  key={`${product.id}-dot-${imgIndex}`}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    imgIndex === currentImageIndex
                      ? 'bg-neutral-900'
                      : 'bg-white/70 ring-1 ring-neutral-900/20'
                  }`}
                />
              ))}
            </div>
          )}
          <AnimatePresence>
            {isHovered && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                onClick={goProduct}
                className="absolute bottom-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-900 shadow-sm transition hover:bg-neutral-50"
                aria-label={`View ${product.name}`}
              >
                <Eye size={18} aria-hidden />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-1 flex-col border-t border-neutral-100 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            {product.category}
          </p>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-2">
            <h3 className="min-w-0 flex-1 text-lg font-bold leading-snug tracking-tight text-neutral-950">
              {product.name}
            </h3>
            <span className="shrink-0 text-base font-bold text-red-600 tabular-nums">
              R{(product.price / 100).toFixed(2)}
            </span>
          </div>
          {tagLine && <p className="mt-2 line-clamp-2 text-xs text-neutral-600">{tagLine}</p>}
          <button
            type="button"
            onClick={goProduct}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            <ShoppingBag size={16} aria-hidden />
            View product
            <ArrowRight size={16} className="opacity-80" aria-hidden />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

const NewArrivalsPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, loading: productsLoading } = useProductData();
  const { setIsHeaderDark } = useHeader();
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

  const heroImageSrc = useMemo(
    () => displayedProducts[0]?.images?.[0] ?? '/images/4.jpg',
    [displayedProducts]
  );

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
              className={`min-w-[2.5rem] rounded-md px-3 py-2 text-sm font-semibold transition ${
                page === currentPage
                  ? 'bg-neutral-900 text-white shadow-md'
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
      {/* Hero */}
      <div className="relative overflow-hidden bg-black pb-20 pt-28 text-white md:pb-24 md:pt-32 lg:pb-28 lg:pt-36">
        <HeroAmbientEffects />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-white/10"
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] md:gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="order-2 md:order-1"
            >
              <div className="inline-flex items-center gap-2.5">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.65)] animate-pulse"
                  aria-hidden
                />
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
                  New this season
                </p>
              </div>
              <h1 className="mt-3 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
                New arrivals
              </h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-neutral-400 md:text-lg">
                Fresh Skipaman drops—tees, graphics, and layers added to the store. Scroll to shop
                the full list or jump to the main store.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <button
                  type="button"
                  onClick={() => navigate('/shop')}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-100"
                >
                  <ShoppingBag size={18} aria-hidden />
                  Shop store
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('products-section');
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/5"
                >
                  View this page
                  <ArrowRight size={18} aria-hidden />
                </button>
              </div>
              <p className="mt-6 text-xs text-neutral-500">
                {filteredProducts.length > 0
                  ? `${filteredProducts.length} piece${filteredProducts.length === 1 ? '' : 's'} in this list`
                  : 'Loading the latest…'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="order-1 md:order-2"
            >
              <div className="aspect-[3/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-none md:aspect-auto md:h-[min(76vh,44rem)]">
                <img
                  src={heroImageSrc}
                  alt="Latest Skipaman arrival"
                  className="h-full w-full object-cover object-center"
                  loading="eager"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div
        id="products-section"
        className="min-h-screen scroll-mt-24 border-t border-neutral-200 bg-neutral-50 text-neutral-900"
      >
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-12 lg:px-8">
          <div className="mb-8 flex flex-col gap-6 border-b border-neutral-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
                Browse
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-neutral-950 md:text-4xl">
                Latest collection
              </h2>
              <p className="mt-2 text-sm text-neutral-600 md:text-base">
                Showing {showingStart}–{showingEnd} of {filteredProducts.length} product
                {filteredProducts.length !== 1 ? 's' : ''}
                {totalFilteredPages > 1 ? ` · Page ${currentPage} of ${totalFilteredPages}` : ''}
              </p>
              {searchQuery && (
                <p className="mt-2 text-sm text-neutral-600">Results for "{searchQuery}"</p>
              )}
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:max-w-xl">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search products or categories…"
                className="w-full sm:min-w-[280px]"
              />
              <div className="sm:hidden">
                <button
                  type="button"
                  onClick={toggleFilters}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
                >
                  {showFilters ? (
                    <>
                      <X size={16} aria-hidden />
                      Close filters
                    </>
                  ) : (
                    <>
                      <Filter size={16} aria-hidden />
                      Filters
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/*
            KEY CHANGE: When there are no results, switch to a single-column stacked layout
            so the sidebar doesn't create a huge gap next to the empty state card.
            When results exist, keep the original side-by-side layout.
          */}
          <div
            className={`flex gap-10 ${hasNoResults ? 'flex-col' : 'flex-col md:flex-row md:items-stretch'}`}
          >
            {/* Sidebar filters */}
            {(!isMobile || showFilters) && (
              <aside
                className={`flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm
                  ${
                    hasNoResults
                      ? // No results: full width, no self-stretch, no fixed md width
                        'w-full self-auto'
                      : // Normal: order-2 on mobile, fixed width column on desktop
                        'order-2 self-stretch md:order-1 md:mb-0 md:w-72 md:shrink-0'
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
                    className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                      selectedCategory === null
                        ? 'bg-neutral-900 text-white shadow-md'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(selectedCategory === category ? null : category);
                        setCurrentPage(1);
                      }}
                      className={`rounded-md px-3 py-2 text-sm font-semibold capitalize transition ${
                        selectedCategory === category
                          ? 'bg-neutral-900 text-white shadow-md'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className={`mt-6 ${hasNoResults ? 'max-w-sm' : ''}`}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Price cap
                  </p>
                  <div className="mt-2 flex justify-between text-xs text-neutral-600">
                    <span>R{(priceRange[0] / 100).toFixed(0)}</span>
                    <span>R{(priceRange[1] / 100).toFixed(0)}</span>
                  </div>
                  <input
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

                    <p className="mt-5 text-[11px] leading-relaxed text-neutral-500">
                      Combine search with a category to narrow results. New pieces appear here as
                      soon as they&apos;re live in the store.
                    </p>

                    <div className="relative mt-5 min-h-[11rem] flex-1 basis-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-950 md:min-h-[13rem]">
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        poster="/images/background1.jpg"
                        className="absolute inset-0 h-full w-full object-cover"
                        aria-label="Skipaman collection preview"
                        onLoadedData={(e) => {
                          void e.currentTarget.play().catch(() => {});
                        }}
                      >
                        <source src="/images/background.mp4" type="video/mp4" />
                      </video>
                    </div>

                    <div className="mt-4 flex shrink-0 flex-col gap-2">
                      <div className="rounded-md border border-neutral-100 bg-neutral-50 px-3 py-2.5 text-[11px] leading-snug text-neutral-600">
                        <p className="font-semibold text-neutral-800">Checkout</p>
                        <p className="mt-0.5">Secure payment · Standard delivery nationwide</p>
                      </div>
                      <div className="rounded-md border border-neutral-100 bg-neutral-50 px-3 py-2.5 text-[11px] leading-snug text-neutral-600">
                        <p className="font-semibold text-neutral-800">Returns</p>
                        <p className="mt-0.5">
                          Unworn items in original packaging—see our policy on the product page.
                        </p>
                      </div>
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
                    className="grid shrink-0 grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-10"
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
      </div>
    </div>
  );
};

export default NewArrivalsPage;
