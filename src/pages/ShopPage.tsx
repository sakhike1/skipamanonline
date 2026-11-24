import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import { useProductData } from '../context/ProductDataContext';
import ShopNewArrivalsSection from '../components/shop/ShopNewArrivalsSection';
import ShopProductGrid from '../components/shop/ShopProductGrid';
import ShopFilterSidebar from '../components/shop/ShopFilterSidebar';
import ShopPagination from '../components/shop/ShopPagination';
import FilterResultsFillerBanner from '../components/ui/FilterResultsFillerBanner';
import { RetailEmptyState } from '../components/ui/RetailEmptyState';
const ShopPage: React.FC = () => {
  const {
    products: contextProducts,
    featuredProducts: contextFeaturedProducts,
  } = useProductData();

  const products = contextProducts;
  const heroFeaturedProducts = React.useMemo(() => {
    const featured = contextFeaturedProducts.length > 0
      ? contextFeaturedProducts
      : products.filter(product => product.featured);
    if (featured.length >= 3) {
      return featured.slice(0, 3);
    }
    return products.slice(0, 3);
  }, [contextFeaturedProducts, products]);
  const featuredProducts = heroFeaturedProducts;

  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const categories = [...new Set(products.map(product => product.category))];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      if (!mobile) {
        setShowFilters(true);
      }
    };

    if (window.innerWidth >= 768) {
      setShowFilters(true);
    } else {
      setShowFilters(false);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredProducts = products.filter(product => {
    if (selectedCategory && product.category !== selectedCategory) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const isFilterActive = React.useMemo(
    () => selectedCategory !== null || priceRange[0] > 0 || priceRange[1] < 50000,
    [selectedCategory, priceRange]
  );

  // When filters are active and produce no results, collapse the layout
  const hasNoResults = isFilterActive && filteredProducts.length === 0;

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setPriceRange([0, 50000]);
    setCurrentPage(1);
    setTimeout(() => {
      const shopCollectionSection = document.getElementById('shop-collection');
      if (shopCollectionSection) {
        shopCollectionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const shopCollectionSection = document.getElementById('shop-collection');
    if (shopCollectionSection) {
      shopCollectionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-black">
      <ShopNewArrivalsSection
        onProductClick={handleProductClick}
        featuredProducts={featuredProducts}
      />

      <section aria-labelledby="shop-collection-heading" className="w-full bg-white text-[#211527]">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 md:pb-20 md:pt-12 lg:px-8">
          <header id="shop-collection" className="mb-8 scroll-mt-24 md:mb-12">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
              <div>
                <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6b4a7a]">
                  <span aria-hidden className="h-px w-8 bg-[#6b4a7a]" />
                  The collection
                </p>
                <h2
                  id="shop-collection-heading"
                  className="mt-3 text-[clamp(2.5rem,5.4vw,4.75rem)] font-black leading-[0.95] tracking-[-0.05em] text-[#211527]"
                >
                  Shop Collection
                </h2>
              </div>
              <div className="flex w-full flex-wrap items-center justify-between gap-3 md:w-auto md:justify-end md:gap-6">
                <p role="status" className="text-sm font-medium tabular-nums text-[#513a5c]">
                  <span className="mr-1.5 text-2xl font-bold tracking-tight text-[#211527]">{filteredProducts.length}</span>
                  {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
                <button
                  type="button"
                  aria-expanded={showFilters}
                  onClick={toggleFilters}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#211527] px-5 py-2 text-sm font-semibold text-[#211527] transition-colors hover:bg-[#211527] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211527] md:hidden"
                >
                  {showFilters ? <X size={16} aria-hidden /> : <Filter size={16} aria-hidden />}
                  {showFilters ? 'Hide filters' : 'Filters'}
                </button>
              </div>
            </div>
            <div aria-hidden className="mt-6 h-px w-full bg-gradient-to-r from-[#211527] via-[#d9cce1] to-transparent" />
          </header>

          {/*
            KEY CHANGE: when no results, switch to stacked (flex-col) so the sidebar
            doesn't stretch tall next to a small empty-state card.
            When results exist, keep the original side-by-side layout.
          */}
          <div className={`flex gap-8 ${hasNoResults ? 'flex-col' : 'flex-col md:flex-row md:items-stretch'}`}>

            {/* Filters sidebar */}
            {showFilters && (
              /*
                In no-results mode: full width, auto height (not self-stretch).
                ShopFilterSidebar handles its own internal layout, we just override
                the wrapper width/alignment via a wrapping div.
              */
              <div className={hasNoResults ? 'w-full' : 'contents'}>
                <ShopFilterSidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  priceRange={priceRange}
                  onCategoryChange={(category) => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  onPriceRangeChange={(range) => {
                    setPriceRange(range);
                    setCurrentPage(1);
                  }}
                  onClearFilters={clearFilters}
                  onProductClick={handleProductClick}
                  // Pass a compact prop if ShopFilterSidebar supports it,
                  // so it can hide its video/extra sections in empty state
                  compact={hasNoResults}
                />
              </div>
            )}

            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              {currentProducts.length > 0 ? (
                <>
                  <div className="shrink-0">
                    <ShopProductGrid products={currentProducts} onProductClick={handleProductClick} />
                  </div>

                  <div className="shrink-0">
                    <ShopPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>

                  {isFilterActive && (
                    <FilterResultsFillerBanner
                      key={`${filteredProducts.length}-${priceRange[1]}-${selectedCategory ?? ''}`}
                      resultCount={filteredProducts.length}
                      onClearFilters={clearFilters}
                      secondaryCta={{ label: 'Browse new arrivals', onClick: () => navigate('/new-arrivals') }}
                      className="mt-8 flex-1 basis-0 min-h-[12rem]"
                    />
                  )}

                  <div className="mb-16 shrink-0" />
                </>
              ) : (
                <RetailEmptyState
                  icon={Filter}
                  title="No products match your filters"
                  description="Try clearing filters or browse new arrivals to find something you love."
                  primaryAction={{ label: 'Clear filters', onClick: clearFilters }}
                  secondaryAction={{ label: 'New arrivals', to: '/new-arrivals' }}
                  surface="light"
                  className="max-w-xl"
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;