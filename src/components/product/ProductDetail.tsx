import React, { useState, useEffect, useCallback } from 'react';
import { Product, Size, Color } from '../../types';
import { ChevronLeft, ChevronRight, Expand, ShoppingBag, X, ChevronDown, Sparkles, Ruler, Palette, CheckCircle, Truck, RotateCcw, LifeBuoy } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useHeader } from '../../context/HeaderContext';
import { motion } from 'framer-motion';
import SizeGuide from './SizeGuide';
import WishlistButton from './WishlistButton';

interface ProductDetailProps {
  product: Product;
  onGoBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onGoBack }) => {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(product.colors[0] || null);
  const [, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  
  const { addToCart, isInCart, cart } = useCart();
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
  
  // Reset states when product changes
  useEffect(() => {
    setSelectedSize(null);
    setSelectedColor(product.colors[0] || null);
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
    if (!selectedSize || !selectedColor || showAddedToCart) {
      return;
    }
    
    // Always use quantity 1 for this component since there's no quantity selector
    const quantityToAdd = 1;
    
    // Check if item is already in cart
    const isAlreadyInCart = isInCart(product.id, selectedSize, selectedColor);
    
    if (isAlreadyInCart) {
      // Item already exists, just show feedback
      setShowAddedToCart(true);
      setTimeout(() => setShowAddedToCart(false), 2000);
      return;
    }
    
    // Add new item to cart
    addToCart(product.id, selectedSize, selectedColor, quantityToAdd);
    setShowAddedToCart(true); // Show feedback
    setTimeout(() => setShowAddedToCart(false), 2000); // Hide after 2 seconds
  }, [addToCart, product.id, selectedSize, selectedColor, showAddedToCart, isInCart]);
  
  // Check if the current selection is already in the cart
  const isCurrentSelectionInCart = selectedSize && selectedColor
    ? isInCart(product.id, selectedSize, selectedColor)
    : false;
    
  
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Enhanced promo bar with modern design */}
      <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white text-xs py-4 px-4 overflow-hidden whitespace-nowrap backdrop-blur-sm border-b border-white/20 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
        <div className="relative z-10 inline-block animate-marquee-smooth">
          <span className="mx-4 font-semibold tracking-wide">✨ FREE DELIVERY OVER €50 ✨</span>
          <span className="text-white/80 font-bold">•</span>
          <span className="mx-4 font-semibold tracking-wide">🔄 FREE RETURNS POLICY 🔄</span>
          <span className="text-white/80 font-bold">•</span>
          <span className="mx-4 font-semibold tracking-wide">🌍 WORLDWIDE DELIVERY 🌍</span>
          <span className="text-white/80 font-bold">•</span>
          <span className="mx-4 font-semibold tracking-wide">✨ FREE DELIVERY OVER €50 ✨</span>
          <span className="text-white/80 font-bold">•</span>
          <span className="mx-4 font-semibold tracking-wide">🔄 FREE RETURNS POLICY 🔄</span>
          <span className="text-white/80 font-bold">•</span>
          <span className="mx-4 font-semibold tracking-wide">🌍 WORLDWIDE DELIVERY 🌍</span>
        </div>
      </div>
      
      {/* Glassmorphism header */}
      <header className="relative backdrop-blur-md bg-white/80 border-b border-white/20 py-4 px-8 lg:px-12 flex items-center justify-between shadow-lg">
        <div className="flex items-center">
          <button 
            onClick={onGoBack} 
            className="group flex items-center text-gray-600 hover:text-black transition-all duration-300 mr-4 hover:scale-105"
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-black group-hover:text-white transition-all duration-300 flex items-center justify-center mr-2">
              <ChevronLeft size={16} />
            </div>
            <span className="font-medium">Back</span>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative group">
            <div className="bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl">
              <ShoppingBag size={18} />
            </div>
            {cart.items.length > 0 && (
              <span className={`absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center transition-all duration-300 shadow-lg ${
                showAddedToCart ? 'scale-125 animate-bounce' : 'scale-100'
              }`}>
                {cart.items.length}
              </span>
            )}
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 shadow-inner"></div>
        </div>
      </header>
      
      {/* Main content with glassmorphism */}
      <div className="flex flex-col lg:flex-row w-full relative z-10">
        {/* Left column - Product details with glassmorphism */}
        <div className="w-full lg:w-1/3 p-6 lg:p-8">
          <div className="backdrop-blur-md bg-white/70 rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500">
            <div className="text-xs flex text-gray-500 mb-6">
              <a href="/" className="text-black hover:text-gray-700 transition-colors font-medium">Home</a>
              <span className="mx-2 text-gray-500">/</span>
              <a href="/category" className="text-black hover:text-gray-700 transition-colors font-medium">Category</a>
              <span className="mx-2 text-gray-500">/</span>
              <span className="text-gray-900 font-semibold">Jackets</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                R{(product.price / 100).toFixed(2)}
              </span>
              <Sparkles className="ml-2 text-yellow-500 animate-pulse" size={20} />
            </p>
            
            {/* Enhanced product info accordion */}
            <div className="space-y-2 mb-6">
              <details className="group border border-gray-200/50 rounded-xl overflow-hidden backdrop-blur-sm bg-white/50">
                <summary className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-50/50 transition-colors">
                  <span className="text-sm font-semibold text-gray-900">Product Info</span>
                  <span className="transition-transform group-open:rotate-180">
                    <ChevronDown size={16} />
                  </span>
                </summary>
                <div className="p-4 text-sm text-gray-600 bg-white/30">
                  <p>Cropped quilted jacket in textured nylon with asymmetrical stitch detailing. Model is 180cm (5'11") and is wearing size M.</p>
                </div>
              </details>
              
              <details className="group border border-gray-200/50 rounded-xl overflow-hidden backdrop-blur-sm bg-white/50">
                <summary className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-50/50 transition-colors">
                  <span className="text-sm font-semibold text-gray-900">Details</span>
                  <span className="transition-transform group-open:rotate-180">
                    <ChevronDown size={16} />
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
                  <span className="transition-transform group-open:rotate-180">
                    <ChevronDown size={16} />
                  </span>
                </summary>
                <div className="p-6 bg-white/40 border-t border-gray-200/60">
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <div className="group/card relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-200 hover:shadow-[0_30px_90px_-40px_rgba(59,130,246,0.35)]">
                      <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -top-16 -right-10 h-32 w-32 rounded-full bg-blue-400/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent_70%)]" />
                      </div>
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30">
                            <Truck size={20} />
                          </span>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Shipping</p>
                            <p className="text-base font-semibold text-slate-900">Delivered in 2-5 business days.</p>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-600">
                          R90 nationwide courier. Complimentary shipping automatically applies on orders over R900.
                        </p>
                      </div>
                    </div>

                    <div className="group/card relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-200 hover:shadow-[0_30px_90px_-40px_rgba(236,72,153,0.3)]">
                      <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -bottom-16 -left-12 h-36 w-36 rounded-full bg-pink-400/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(255,255,255,0.4),_transparent_70%)]" />
                      </div>
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-pink-500/30">
                            <RotateCcw size={20} />
                          </span>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Returns</p>
                            <p className="text-base font-semibold text-slate-900">Return online orders in-store or online.</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <a
                            href="/faq"
                            className="inline-flex items-center rounded-full border border-purple-200/60 bg-purple-50/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-purple-600 transition-all duration-300 hover:border-purple-300 hover:text-purple-700"
                          >
                            FAQ&apos;s
                          </a>
                          <a
                            href="/returns"
                            className="inline-flex items-center rounded-full border border-purple-200/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-purple-600 transition-all duration-300 hover:border-purple-300 hover:text-purple-700"
                          >
                            Log a Return
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="group/card relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-200 hover:shadow-[0_30px_90px_-40px_rgba(34,197,94,0.32)]">
                      <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.4),_transparent_70%)]" />
                      </div>
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                            <LifeBuoy size={20} />
                          </span>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Support</p>
                            <p className="text-base font-semibold text-slate-900">We uphold the Consumer Goods & Services Code.</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <a
                            href="/faq"
                            className="inline-flex items-center rounded-full border border-emerald-200/60 bg-emerald-50/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600 transition-all duration-300 hover:border-emerald-300 hover:text-emerald-700"
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
                      <ChevronLeft size={20} />
                    </button>
                    
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 backdrop-blur-md bg-white/80 rounded-full p-3 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
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
            
            {/* Enhanced Color Selection */}
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Palette className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Choose Color</h2>
                </div>
                
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {product.colors.map((color, index) => (
                    <motion.button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`relative group w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none shadow-lg overflow-hidden ${
                        selectedColor?.name === color.name
                          ? 'border-purple-500 ring-4 ring-purple-500 ring-opacity-30 shadow-2xl scale-105'
                          : 'border-gray-200 hover:border-purple-300 hover:shadow-xl'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Shimmer Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                          x: ['-100%', '100%']
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3,
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Color Circle */}
                      <div className="relative z-10 w-8 h-8 rounded-full border-2 border-white/30 shadow-inner"></div>
                      
                      {/* Selection Indicator */}
                      {selectedColor?.name === color.name && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-4 h-4 text-purple-600" />
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Color Name Tooltip */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-20">
                        {color.name}
                      </div>
                    </motion.button>
                  ))}
                </div>
                
                {/* Selected Color Info */}
                {selectedColor && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                        style={{ backgroundColor: selectedColor.value }}
                      ></div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          Selected: <span className="text-purple-600">{selectedColor.name}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Perfect choice! This color will complement your style.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
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
                  disabled={!selectedSize || !selectedColor || showAddedToCart}
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
              
              
              {(!selectedSize || !selectedColor) && !showAddedToCart && (
                <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200/50 backdrop-blur-sm">
                  <p className="text-sm text-red-600 font-semibold text-center">
                    Please select {!selectedSize ? 'a size' : ''} 
                    {!selectedSize && !selectedColor ? ' and ' : ''} 
                    {!selectedColor ? 'a color' : ''} to add to cart.
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
            animation: marqueeSmooth 20s linear infinite;
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