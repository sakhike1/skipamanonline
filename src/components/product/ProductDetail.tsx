import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, Size, Color } from '../../types';
import { ChevronLeft, ChevronRight, Expand, X, ChevronDown, Sparkles, Ruler, Truck, RotateCcw, LifeBuoy, ExternalLink } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useHeader } from '../../context/HeaderContext';
import SizeGuide from './SizeGuide';
import WishlistButton from './WishlistButton';
import { ProductWorkflowStrip } from './ProductWorkflowStrip';
import { getHoodPayPalPaymentUrl, isHoodProduct } from '../../utils/hoodPayPalLink';

interface ProductDetailProps {
  product: Product;
  onGoBack: () => void;
}

const hoodPayPalUrl = getHoodPayPalPaymentUrl();
const hoodPayPalButtonLabel =
  (import.meta.env.VITE_PAYPAL_HOOD_BUTTON_LABEL as string | undefined)?.trim() ||
  'Pay with PayPal (USD)';
const hoodPayPalNote =
  (import.meta.env.VITE_PAYPAL_HOOD_CHECKOUT_NOTE as string | undefined)?.trim() ||
  "Opens PayPal's checkout for this hoody (USD). Shipping address is collected by PayPal.";

const DEFAULT_PRODUCT_COLOR: Color = { name: 'Standard', value: '#111111' };

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onGoBack }) => {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  
  const { addToCart, isInCart } = useCart();
  const { setIsHeaderDark } = useHeader();
  
  // Control header background when component mounts/unmounts
  useEffect(() => {
    // Set header to dark background when ProductDetail is displayed
    setIsHeaderDark(true);
    
    // Reset header background when component unmounts
    return () => {
      setIsHeaderDark(false);
    };
  }, [setIsHeaderDark]);

  /** Cart always uses the primary catalog color (first entry). List separate products per color if you sell multiple. */
  const resolvedColor = useMemo((): Color => {
    return product.colors[0] ?? DEFAULT_PRODUCT_COLOR;
  }, [product.colors]);

  // Reset states when product changes
  useEffect(() => {
    setSelectedSize(null);
    setQuantity(1);
    setCurrentImageIndex(0);
    setShowAddedToCart(false);
  }, [product.id]); // Only depend on product.id, not product.colors
  
  // Handle image navigation
  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  }, [product.images.length]);
  
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  }, [product.images.length]);
  
  // Handle add to cart
  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent multiple calls - more robust check
    if (!selectedSize || showAddedToCart) {
      return;
    }
    
    // Always use quantity 1 for this component since there's no quantity selector
    const quantityToAdd = 1;
    
    // Check if item is already in cart
    const isAlreadyInCart = isInCart(product.id, selectedSize, resolvedColor);
    
    if (isAlreadyInCart) {
      // Item already exists, just show feedback
      setShowAddedToCart(true);
      setTimeout(() => setShowAddedToCart(false), 2000);
      return;
    }
    
    // Add new item to cart
    addToCart(product.id, selectedSize, resolvedColor, quantityToAdd);
    setShowAddedToCart(true); // Show feedback
    setTimeout(() => setShowAddedToCart(false), 2000); // Hide after 2 seconds
  }, [addToCart, product.id, selectedSize, resolvedColor, showAddedToCart, isInCart]);
  
  // Check if the current selection is already in the cart
  const isCurrentSelectionInCart = selectedSize
    ? isInCart(product.id, selectedSize, resolvedColor)
    : false;

  const showHoodPayPalLink = Boolean(hoodPayPalUrl && isHoodProduct(product));

  const openHoodPayPalCheckout = () => {
    if (!hoodPayPalUrl) return;
    window.open(hoodPayPalUrl, '_blank', 'noopener,noreferrer');
  };

  
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Promo ticker — flush under global header; weight matches nav tone */}
      <div className="relative -mt-px bg-black text-white text-xs py-3 px-4 overflow-hidden whitespace-nowrap shadow-md border-0">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Bottom edge only — avoids a bright line between fixed header and bar */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 border-b border-white/10" aria-hidden />
        
        <div className="relative z-10 inline-block animate-marquee-smooth">
          <span className="mx-6 text-sm font-medium tracking-wide text-white/95">✨ Free delivery over R500 ✨</span>
          <span className="text-white/45 font-normal text-sm px-1">•</span>
          <span className="mx-6 text-sm font-medium tracking-wide text-white/95">🔄 Free returns policy 🔄</span>
          <span className="text-white/45 font-normal text-sm px-1">•</span>
          <span className="mx-6 text-sm font-medium tracking-wide text-white/95">Across South Africa</span>
          <span className="text-white/45 font-normal text-sm px-1">•</span>
          <span className="mx-6 text-sm font-medium tracking-wide text-white/95">✨ Free delivery over R500 ✨</span>
          <span className="text-white/45 font-normal text-sm px-1">•</span>
          <span className="mx-6 text-sm font-medium tracking-wide text-white/95">🔄 Free returns policy 🔄</span>
          <span className="text-white/45 font-normal text-sm px-1">•</span>
          <span className="mx-6 text-sm font-medium tracking-wide text-white/95">Across South Africa</span>
        </div>
      </div>
      
      {/* Glassmorphism header */}
      <header className="relative backdrop-blur-md bg-white/80 border-b border-white/20 py-4 px-8 lg:px-12 flex items-center shadow-lg">
        <div className="flex items-center">
          <button 
            type="button"
            onClick={onGoBack} 
            className="group flex items-center text-gray-600 hover:text-black transition-all duration-300 mr-4 hover:scale-105"
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-black group-hover:text-white transition-all duration-300 flex items-center justify-center mr-2">
              <ChevronLeft size={16} />
            </div>
            <span className="font-medium">Back</span>
          </button>
        </div>
      </header>
      
      {/* Main content with glassmorphism */}
      <div className="flex flex-col lg:flex-row w-full relative z-10">
        {/* Left column - Product details with glassmorphism */}
        <div className="w-full lg:w-1/3 p-6 lg:p-8">
          <div className="backdrop-blur-md bg-white/70 rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500">
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-600 font-semibold uppercase tracking-[0.2em] mb-5">
              <a href="/" className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 hover:bg-black hover:text-white transition-colors">Home</a>
              <span className="text-gray-400">/</span>
              <a href="/category" className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 hover:bg-black hover:text-white transition-colors">Category</a>
              <span className="text-gray-400">/</span>
              <span className="px-3 py-1 rounded-full bg-black text-white">Jackets</span>
            </div>

            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500 mb-2">Skipaman Blues</p>
                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {product.name}
                </h1>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-500 mb-1">Price</p>
                <p className="text-3xl font-black text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent flex items-center justify-end gap-2">
                  R{(product.price / 100).toFixed(2)}
                  <Sparkles className="text-yellow-500 animate-pulse" size={18} />
                </p>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />

            <ProductWorkflowStrip />
            
            {/* Enhanced product info accordion */}
            <div className="space-y-2 mb-6">
              <details className="group border border-gray-200/50 rounded-xl overflow-hidden backdrop-blur-sm bg-white/50">
                <summary className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-50/50 transition-colors">
                  <span className="text-sm font-semibold text-gray-900">Product Info</span>
                  <span className="transition-transform group-open:rotate-180 text-black">
                    <ChevronDown size={16} className="text-black" />
                  </span>
                </summary>
                <div className="p-4 text-sm text-gray-600 bg-white/30">
                  <p>Cropped quilted jacket in textured nylon with asymmetrical stitch detailing. Model is 180cm (5'11") and is wearing size M.</p>
                </div>
              </details>
              
              <details className="group border border-gray-200/50 rounded-xl overflow-hidden backdrop-blur-sm bg-white/50">
                <summary className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-50/50 transition-colors">
                  <span className="text-sm font-semibold text-gray-900">Details</span>
                  <span className="transition-transform group-open:rotate-180 text-black">
                    <ChevronDown size={16} className="text-black" />
                  </span>
                </summary>
                <div className="p-4 text-sm text-gray-600 bg-white/30 space-y-2">
                  <p>100% premium nylon for superior comfort</p>
                  <p>Pre-shrunk to minimize shrinkage</p>
                  <p>Reinforced stitching for durability</p>
                  <p>Machine washable, tumble dry low</p>
                </div>
              </details>
              
              <details className="group border border-gray-200/50 rounded-xl overflow-hidden backdrop-blur-sm bg-white/50">
                <summary className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-50/50 transition-colors">
                  <span className="text-sm font-semibold text-gray-900">Delivery, Returns & Support</span>
                  <span className="transition-transform group-open:rotate-180 text-black">
                    <ChevronDown size={16} className="text-black" />
                  </span>
                </summary>
                <div className="p-6 bg-white/40 border-t border-gray-200/60">
                  <div className="flex flex-col gap-6">
                    {/* Shipping Card */}
                    <div className="group/card relative rounded-2xl border border-slate-200/60 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-200 hover:shadow-[0_30px_90px_-40px_rgba(59,130,246,0.35)] min-h-[280px]">
                      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                        <div className="absolute -top-16 -right-10 h-32 w-32 rounded-full bg-blue-400/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent_70%)]" />
                      </div>
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-5">
                          <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 mb-4">
                            <Truck size={24} />
                          </span>
                          <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-900 mb-4">Shipping</h3>
                        </div>
                        <div className="flex-1 space-y-4">
                          <p className="text-base font-bold text-slate-900 leading-snug break-words">Delivered in 2-5 business days.</p>
                          <p className="text-sm leading-relaxed text-slate-700 break-words">
                            R90 nationwide courier. Complimentary shipping automatically applies on orders over R900.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Returns Card */}
                    <div className="group/card relative rounded-2xl border border-slate-200/60 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-200 hover:shadow-[0_30px_90px_-40px_rgba(236,72,153,0.3)] min-h-[280px]">
                      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                        <div className="absolute -bottom-16 -left-12 h-36 w-36 rounded-full bg-pink-400/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(255,255,255,0.4),_transparent_70%)]" />
                      </div>
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-5">
                          <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-pink-500/30 mb-4">
                            <RotateCcw size={24} />
                          </span>
                          <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-900 mb-4">Returns</h3>
                        </div>
                        <div className="flex-1 space-y-4 mb-5">
                          <p className="text-base font-bold text-slate-900 leading-snug break-words">Return online orders in-store or online.</p>
                        </div>
                        <div className="flex flex-col gap-2.5 mt-auto">
                          <a
                            href="/faq"
                            className="block w-full text-center rounded-lg border border-purple-200/60 bg-purple-50/80 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-purple-700 transition-all duration-300 hover:border-purple-300 hover:bg-purple-100 hover:text-purple-800 whitespace-nowrap"
                          >
                            FAQ&apos;s
                          </a>
                          <a
                            href="/returns"
                            className="block w-full text-center rounded-lg border border-purple-200/60 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-purple-700 transition-all duration-300 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-800 whitespace-nowrap"
                          >
                            Log a Return
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Support Card */}
                    <div className="group/card relative rounded-2xl border border-slate-200/60 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-200 hover:shadow-[0_30px_90px_-40px_rgba(34,197,94,0.32)] min-h-[280px]">
                      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                        <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.4),_transparent_70%)]" />
                      </div>
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-5">
                          <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 mb-4">
                            <LifeBuoy size={24} />
                          </span>
                          <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-900 mb-4">Support</h3>
                        </div>
                        <div className="flex-1 space-y-4 mb-5">
                          <p className="text-base font-bold text-slate-900 leading-snug break-words">We uphold the Consumer Goods & Services Code.</p>
                        </div>
                        <div className="flex flex-col gap-2.5 mt-auto">
                          <a
                            href="/faq"
                            className="block w-full text-center rounded-lg border border-emerald-200/60 bg-emerald-50/80 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700 transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-100 hover:text-emerald-800 whitespace-nowrap"
                          >
                            FAQ&apos;s
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
        
        {/* Center column - Enhanced product images with glassmorphism */}
        <div className="w-full lg:w-2/5 p-4 lg:p-6">
          <div className="relative">
            {/* Glassmorphism image container */}
            <div className="backdrop-blur-md bg-white/60 rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500">
              <div 
                className="h-[600px] lg:h-[700px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden group"
                onMouseEnter={() => setIsHoveringImage(true)}
                onMouseLeave={() => setIsHoveringImage(false)}
              >
                <img 
                  src={product.images[currentImageIndex]} 
                  alt={product.name}
                  className={`max-h-full max-w-full object-contain transition-all duration-500 ${
                    isHoveringImage ? 'scale-105' : 'scale-100'
                  }`}
                  style={{
                    display: 'block',
                    margin: '0 auto'
                  }}
                />
                
                {/* Enhanced image navigation buttons */}
                {product.images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 backdrop-blur-md bg-white/80 rounded-full p-3 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} className="text-black" />
                    </button>
                    
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 backdrop-blur-md bg-white/80 rounded-full p-3 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} className="text-black" />
                    </button>
                  </>
                )}
                
                {/* Enhanced zoom button */}
                <button 
                  onClick={() => setShowZoomModal(true)}
                  className="absolute bottom-4 right-4 backdrop-blur-md bg-white/80 rounded-full p-3 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
                  aria-label="Zoom image"
                >
                  <Expand size={20} />
                </button>
              </div>
              
              {/* Enhanced thumbnail navigation */}
              <div className="flex mt-6 space-x-3 justify-center">
                {product.images.slice(0, 3).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-24 h-28 border-2 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 ${
                      currentImageIndex === index 
                        ? 'border-black shadow-lg scale-105' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Enhanced purchase options with glassmorphism */}
        <div className="w-full lg:w-1/4 p-6 lg:p-8">
          <div className="backdrop-blur-md bg-white/70 rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500">
            {/* Enhanced size selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Choose Size</h2>
                <button 
                  className="flex items-center space-x-1 text-sm text-black hover:text-gray-700 transition-colors font-semibold hover:scale-105"
                  onClick={() => setShowSizeGuide(true)}
                  type="button"
                >
                  <Ruler size={16} />
                  <span>Size Guide</span>
                </button>
              </div>
              
              <div className="grid grid-cols-6 gap-3">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size as Size)}
                    className={`h-12 flex items-center justify-center border-2 text-sm font-semibold transition-all duration-300 focus:outline-none rounded-lg hover:scale-105 ${
                      selectedSize === size
                        ? 'bg-gradient-to-r from-black to-gray-800 text-white border-black shadow-lg'
                        : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              

            </div>
            
            {/* Enhanced disclaimer and checkout */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 mb-6 text-center">
                All contents of this website are the property of A-COLD-WALL*
              </p>
              
              <div className="flex gap-3 mb-6">
                <button
                  className={`flex-grow py-4 text-sm font-bold shadow-lg transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transform hover:scale-[1.02] active:scale-[0.98] ${
                    showAddedToCart 
                      ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white animate-gradient-success' 
                      : 'bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black'
                  }`}
                  disabled={!selectedSize || showAddedToCart}
                  onClick={handleAddToCart}
                  type="button"
                  aria-live="polite"
                >
                  {showAddedToCart 
                    ? '✓ ADDED TO CART!' 
                    : isCurrentSelectionInCart 
                      ? 'ALREADY IN CART' 
                      : 'ADD TO CART'
                  }
                </button>
                <WishlistButton 
                  product={product} 
                  size="lg" 
                  variant="button"
                  showText={false}
                  className="px-4 py-4 shadow-lg"
                />
              </div>

              {showHoodPayPalLink && (
                <div className="mb-6 rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/80 p-4 shadow-inner">
                  <p className="text-xs text-amber-950/80 mb-3 leading-relaxed">{hoodPayPalNote}</p>
                  <button
                    type="button"
                    onClick={openHoodPayPalCheckout}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm bg-[#FFD140] hover:bg-[#f7c632] text-black border-2 border-black/10 shadow-md transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <ExternalLink className="w-4 h-4 shrink-0" aria-hidden />
                    {hoodPayPalButtonLabel}
                  </button>
                </div>
              )}
              
              
              {!selectedSize && !showAddedToCart && (
                <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200/50 backdrop-blur-sm">
                  <p className="text-sm text-red-600 font-semibold text-center">
                    Please select a size to add to cart.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced zoom modal with glassmorphism */}
      {showZoomModal && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/80 flex items-center justify-center p-4">
          <div className="max-w-5xl max-h-full relative backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
            <button
              onClick={() => setShowZoomModal(false)}
              className="absolute top-4 right-4 text-white bg-black/50 backdrop-blur-md rounded-full p-3 hover:bg-black/70 transition-all duration-300 hover:scale-110"
              aria-label="Close zoom view"
            >
              <X size={24} />
            </button>
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            
            <div className="absolute left-6 right-6 bottom-6 flex justify-center space-x-3">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 hover:scale-125 ${
                    currentImageIndex === index ? 'bg-white shadow-lg' : 'bg-gray-500 hover:bg-gray-400'
                  }`}
                  aria-label={`View image ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuide 
        isOpen={showSizeGuide} 
        onClose={() => setShowSizeGuide(false)} 
      />

      <style>
        {`
          @keyframes marqueeSmooth {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
          .animate-marquee-smooth {
            display: inline-block;
            animation: marqueeSmooth 50s linear infinite;
            white-space: nowrap;
          }
          
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          
          .animate-shimmer {
            animation: shimmer 3s ease-in-out infinite;
          }
          
          @keyframes gradientSuccess {
            0% {
              background: linear-gradient(to right, #10b981, #059669, #047857);
            }
            50% {
              background: linear-gradient(to right, #059669, #047857, #065f46);
            }
            100% {
              background: linear-gradient(to right, #10b981, #059669, #047857);
            }
          }
          
          .animate-gradient-success {
            animation: gradientSuccess 2s ease-in-out;
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
              transform: translate3d(0,0,0);
            }
            40%, 43% {
              transform: translate3d(0, -30px, 0);
            }
            70% {
              transform: translate3d(0, -15px, 0);
            }
            90% {
              transform: translate3d(0,-4px,0);
            }
          }
          
          .animate-bounce {
            animation: bounce 1s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default ProductDetail;