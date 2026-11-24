import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductData } from '../../context/ProductDataContext';
import { getHoodPayPalPaymentUrl } from '../../utils/hoodPayPalLink';

const hoodPayPalUrl = getHoodPayPalPaymentUrl();

const SportCollection: React.FC = () => {
  const { products } = useProductData();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get hoody products for the display
  const hoodyProducts = products.filter(product => product.category === 'hoodies');
  
  // Get all hoodie images
  const hoodyImages = hoodyProducts.flatMap(product => 
    product.images.map((image) => ({
      src: image,
      title: product.name,
      id: product.id,
      price: product.price
    }))
  );

  // Auto-rotate images
  useEffect(() => {
    if (hoodyImages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % hoodyImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [hoodyImages.length]);

  if (hoodyImages.length === 0) return null;

  return (
    <section className="bg-[#f5f5f0] py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#e8e4dc] rounded-2xl sm:rounded-3xl overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center">
            
            {/* Left Content */}
            <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 leading-tight tracking-tight">
                SAVE UP TO 50% ON YOUR FAVORITE HOODIES
              </h2>
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
                <Link to="/shop?category=hoodies">
                  <button
                    type="button"
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-black text-white text-sm font-semibold rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Shop hoodies
                  </button>
                </Link>
                {hoodPayPalUrl && (
                  <button
                    type="button"
                    onClick={() => window.open(hoodPayPalUrl, '_blank', 'noopener,noreferrer')}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-[#FFD140] text-black text-sm font-semibold rounded-md border-2 border-black/10 hover:bg-[#f7c632] transition-colors"
                  >
                    Pay with PayPal (USD)
                  </button>
                )}
              </div>
            </div>

            {/* Right Image */}
            <div className="w-full lg:w-1/2 relative">
              <div className="aspect-[4/3] lg:aspect-auto lg:h-[400px] xl:h-[450px] relative overflow-hidden">
                <img
                  src={hoodyImages[currentImageIndex]?.src}
                  alt={hoodyImages[currentImageIndex]?.title || 'Hoodie'}
                  className="w-full h-full object-cover object-center transition-opacity duration-500"
                />
                
                {/* Price tag */}
                <Link 
                  to={`/product/${hoodyImages[currentImageIndex]?.id}`}
                  className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-md text-sm font-bold text-gray-900 hover:bg-gray-100 transition-colors shadow-lg"
                >
                  R{((hoodyImages[currentImageIndex]?.price || 0) / 100).toFixed(0)}
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default SportCollection;
