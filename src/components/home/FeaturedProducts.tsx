import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProductData } from '../../context/ProductDataContext';
import FeaturedProductCard from './FeaturedProductCard';

interface FeaturedProductsProps {
  onProductClick: (productId: string) => void;
}

const featuredGridContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const featuredGridItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ onProductClick }) => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const { featuredProducts, loading, error } = useProductData();
  
  const productsPerPage = 8;

  const totalPages = useMemo(
    () => Math.ceil(featuredProducts.length / productsPerPage),
    [featuredProducts.length, productsPerPage]
  );
  const startIndex = useMemo(() => currentPage * productsPerPage, [currentPage, productsPerPage]);
  const endIndex = useMemo(() => startIndex + productsPerPage, [startIndex, productsPerPage]);
  const displayProducts = useMemo(
    () => featuredProducts.slice(startIndex, endIndex),
    [featuredProducts, startIndex, endIndex]
  );

  // When featured list length drops (e.g. fallback → API with fewer items), keep page index valid
  // or the grid slices past the end and renders blank.
  useEffect(() => {
    const safeMax = Math.max(0, totalPages - 1);
    setCurrentPage((prev) => (prev > safeMax ? safeMax : prev));
  }, [totalPages]);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(Math.max(0, totalPages - 1), prev + 1));
  }, [totalPages]);

  const handlePageClick = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const scrollFeaturedGridIntoView = useCallback(() => {
    requestAnimationFrame(() => {
      document.getElementById('featured-products-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const handleProductCardClick = useCallback(
    (productId: string) => {
      onProductClick(productId);
    },
    [onProductClick]
  );

  // Context already falls back to local `data/products` while Supabase loads — don't block the grid.
  // Only show a spinner when we truly have nothing to render yet.
  if (loading && featuredProducts.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-black border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.warn('FeaturedProducts - Error loading products:', error);
  }

  if (featuredProducts.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-gray-600">No featured products available</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-sm font-medium text-gray-500 tracking-widest uppercase mb-4">
            Curated Selection
          </p>
          <h2 className="mb-4 text-3xl font-black tracking-tight text-gray-900 sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
            Featured Products
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Discover our handpicked collection of premium pieces, each crafted with exceptional quality and timeless design.
          </p>
        </motion.div>

        {/* Products Grid — key remounts each page so stagger runs again; animate="visible" avoids whileInView leaving paginated rows invisible */}
        <motion.div
          key={currentPage}
          id="featured-products-grid"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8"
          variants={featuredGridContainer}
          initial="hidden"
          animate="visible"
        >
          {displayProducts.map((product) => (
            <motion.div key={product.id} variants={featuredGridItem}>
              <FeaturedProductCard product={product} onClick={handleProductCardClick} />
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <>
            <div className="mt-10 hidden items-center justify-center gap-2 sm:gap-3 md:mt-12 md:flex">
              <button
                type="button"
                onClick={() => {
                  handlePreviousPage();
                  setTimeout(scrollFeaturedGridIntoView, 100);
                }}
                disabled={currentPage === 0}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex max-w-[min(100%,20rem)] flex-wrap justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      handlePageClick(i);
                      setTimeout(scrollFeaturedGridIntoView, 100);
                    }}
                    className={`h-10 min-w-[2.5rem] shrink-0 rounded-md px-2 text-sm font-medium transition-colors ${
                      currentPage === i
                        ? 'bg-black text-white'
                        : 'border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900'
                    }`}
                    aria-label={`Go to page ${i + 1}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  handleNextPage();
                  setTimeout(scrollFeaturedGridIntoView, 100);
                }}
                disabled={currentPage === totalPages - 1}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="mt-10 flex items-center justify-center gap-4 md:hidden">
              <button
                type="button"
                onClick={() => {
                  handlePreviousPage();
                  setTimeout(scrollFeaturedGridIntoView, 100);
                }}
                disabled={currentPage === 0}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm transition-colors hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Previous page"
              >
                <ChevronLeft size={20} />
              </button>
              <p className="min-w-0 text-center text-sm font-semibold tabular-nums text-gray-700">
                Page <span className="text-gray-900">{currentPage + 1}</span>
                <span className="mx-1 text-gray-400">/</span>
                {totalPages}
              </p>
              <button
                type="button"
                onClick={() => {
                  handleNextPage();
                  setTimeout(scrollFeaturedGridIntoView, 100);
                }}
                disabled={currentPage === totalPages - 1}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm transition-colors hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Next page"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </>
        )}

      </div>
    </section>
  );
};

export default FeaturedProducts;