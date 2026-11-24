import React, { useCallback, memo } from 'react';
import './home-refresh.css';
import Hero from '../components/home/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import NewArrivals from '../components/home/NewArrivals';
import { HomeSectionReveal } from '../components/home/HomeSectionReveal';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { HomeWorkflowSection } from '../components/home/HomeWorkflowSection';
import { CustomerAssuranceSection } from '../components/home/CustomerAssuranceSection';
import CustomerReviewSection from '../components/home/CustomerReviewSection';
import { Toast } from '../components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { usePerformance } from '../hooks/usePerformance';
// Note: avoid preloading hard-coded local hero images.
// Hero media is served from `/public/images`, so preloading /images/*.jpg can produce "preloaded but not used" warnings.
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();
  usePerformance(); // Monitor performance

  const handleProductClick = useCallback((productId: string) => {
    navigate(`/product/${productId}`);
    // Scroll to top after navigation
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }, [navigate]);

  const handleSubscribeSuccess = useCallback(() => {
    showToast('Successfully subscribed to our newsletter!', 'success');
  }, [showToast]);

  const handleSubscribeError = useCallback((error: string) => {
    showToast(error, 'error');
  }, [showToast]);

  return (
    <div className="bg-gradient-to-b from-gray-50 via-white to-gray-50 min-h-screen">
      <Hero />
      <div className="skipaman-home">
        <HomeSectionReveal className="skipaman-drops"><NewArrivals /></HomeSectionReveal>
        <HomeSectionReveal className="skipaman-featured">
          <FeaturedProducts onProductClick={handleProductClick} />
        </HomeSectionReveal>
        <HomeSectionReveal className="skipaman-workflow"><HomeWorkflowSection /></HomeSectionReveal>
        <HomeSectionReveal variant="dark"><CustomerAssuranceSection /></HomeSectionReveal>
        <HomeSectionReveal className="skipaman-reviews"><CustomerReviewSection /></HomeSectionReveal>
        <HomeSectionReveal variant="dark" className="skipaman-newsletter">
          <NewsletterSection
            onSubscribeSuccess={handleSubscribeSuccess}
            onSubscribeError={handleSubscribeError}
          />
        </HomeSectionReveal>
      </div>
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
};

export default memo(HomePage);
