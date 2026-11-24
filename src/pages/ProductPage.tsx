import React, { useEffect, useState, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductData } from '../context/ProductDataContext';
import { reviewService, computeReviewStats } from '../services/reviewService';
import { supabase } from '../lib/supabase';
import ProductDetail from '../components/product/ProductDetail';
import ReviewsSection from '../components/product/ReviewsSection';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { absolutizeUrl, getPublicSiteUrl } from '../seo/publicSiteUrl';
import { buildProductJsonLd, truncateMetaDescription } from '../utils/productJsonLd';
import { Product, Review, ReviewStats } from '../types';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById, loading: catalogLoading } = useProductData();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  
  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      if (!id) return;

      const foundProduct = getProductById(id);
      // Still fetching the catalogue and the product is not in hand yet: keep showing the skeleton
      if (!foundProduct && catalogLoading) return;

      setIsLoading(true);

      try {
        setProduct(foundProduct ?? null);
        if (foundProduct && isMounted) {

          if (supabase) {
            const productReviews = await reviewService.getProductReviews(id);
            if (isMounted) {
              setReviews(productReviews);
              setReviewStats(computeReviewStats(productReviews));
            }
          } else if (isMounted) {
            setReviews([]);
            setReviewStats(computeReviewStats([]));
          }
        }
      } catch (error) {
        console.error('Error loading product:', error);
        if (isMounted) {
          setReviews([]);
          setReviewStats(computeReviewStats([]));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id, getProductById, catalogLoading]);

  // Scroll to top instantly when component mounts or product ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  const handleGoBack = () => {
    navigate('/shop');
  };
  
  if (isLoading || (!product && catalogLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
        <div className="container mx-auto px-4 py-8">
          <LoadingSkeleton type="checkout" theme="light" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">Sorry, the product you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={handleGoBack}
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const siteUrl = getPublicSiteUrl();
  const canonicalUrl = `${siteUrl}/product/${product.id}`;
  const primaryImagePath = product.images?.[0] ?? '/images/og-image.jpg';
  const ogImageUrl = absolutizeUrl(primaryImagePath, siteUrl);
  const pageTitle = `${product.name} | Skipaman Store`;
  const metaDescription = truncateMetaDescription(product.description);
  const productJsonLd = buildProductJsonLd(product, reviewStats, canonicalUrl, siteUrl);

  return (
    <div className="pt-16 bg-white min-h-screen">
      <Helmet prioritizeSeoTags>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
        <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
      </Helmet>
      <Suspense fallback={<LoadingSkeleton />}>
        <ProductDetail product={product} onGoBack={handleGoBack} />
        
        {/* Reviews Section */}
        {product && reviewStats && (
          <div className="bg-white">
            <div className="container mx-auto px-4 py-16">
              <ReviewsSection
                productId={product.id}
                reviews={reviews}
                stats={reviewStats}
                productName={product.name}
                onReviewSubmitted={(newReview) => {
                  setReviews((prev) => {
                    const next = [newReview, ...prev];
                    setReviewStats(computeReviewStats(next));
                    return next;
                  });
                }}
              />
            </div>
          </div>
        )}
      </Suspense>
    </div>
  );
};

export default ProductPage;