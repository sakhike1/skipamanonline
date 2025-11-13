import React from 'react';
import Hero from '../components/home/Hero';
import SportCollection from '../components/home/SportCollection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import NewArrivals from '../components/home/NewArrivals';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { CustomerAssuranceSection } from '../components/home/CustomerAssuranceSection';
import CustomerReviewSection from '../components/home/CustomerReviewSection';
import { Toast } from '../components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  const handleSubscribeSuccess = () => {
    showToast('Successfully subscribed to our newsletter!', 'success');
  };

  const handleSubscribeError = (error: string) => {
    showToast(error, 'error');
  };

  return (
    <div>
      <Hero />
      <SportCollection />
      <NewArrivals />
      <FeaturedProducts onProductClick={handleProductClick} />
      
      <NewsletterSection 
        onSubscribeSuccess={handleSubscribeSuccess}
        onSubscribeError={handleSubscribeError}
      />

      <CustomerAssuranceSection />

      <Toast 
        show={toast.show}
        message={toast.message}
        type={toast.type}
      />
      
      <CustomerReviewSection />
    </div>
  );
};

export default HomePage;
