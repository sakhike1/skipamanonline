import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Share2, Download, Filter, Grid, List, ArrowRight, Star, Tag, X, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

interface LookbookItem {
  id: string;
  title: string;
  description: string;
  category: string;
  season: string;
  featured: boolean;
  images: string[];
  products: string[];
  tags: string[];
  createdAt: string;
}

// Mock lookbook data
const lookbookData: LookbookItem[] = [
  {
    id: '1',
    title: 'Urban Street Style',
    description: 'Discover the perfect blend of comfort and style with our urban streetwear collection. From oversized hoodies to statement tees, this lookbook showcases how to rock casual chic.',
    category: 'Streetwear',
    season: 'Fall 2024',
    featured: true,
    images: [
      '/images/1.png',
      '/images/2.png',
      '/images/3.png',
      '/images/4.jpg'
    ],
    products: ['1', '2', '3', '4'],
    tags: ['Urban', 'Casual', 'Comfort', 'Style'],
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Minimalist Elegance',
    description: 'Less is more. This collection focuses on clean lines, neutral tones, and timeless pieces that work for any occasion.',
    category: 'Minimalist',
    season: 'Fall 2024',
    featured: true,
    images: [
      '/images/5.jpg',
      '/images/6.jpg',
      '/images/7.jpg',
      '/images/8.jpg'
    ],
    products: ['5', '6', '7', '8'],
    tags: ['Minimalist', 'Elegant', 'Timeless', 'Clean'],
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    title: 'Bold & Vibrant',
    description: 'Make a statement with our bold collection featuring vibrant colors, unique patterns, and eye-catching designs.',
    category: 'Bold',
    season: 'Fall 2024',
    featured: false,
    images: [
      '/images/1.png',
      '/images/2.png',
      '/images/3.png'
    ],
    products: ['1', '2', '3'],
    tags: ['Bold', 'Vibrant', 'Statement', 'Colorful'],
    createdAt: '2024-01-05'
  },
  {
    id: '4',
    title: 'Athletic Performance',
    description: 'Performance meets style in this athletic-inspired collection. Perfect for active lifestyles and casual wear.',
    category: 'Athletic',
    season: 'Fall 2024',
    featured: false,
    images: [
      '/images/4.jpg',
      '/images/5.jpg',
      '/images/6.jpg'
    ],
    products: ['4', '5', '6'],
    tags: ['Athletic', 'Performance', 'Active', 'Comfort'],
    createdAt: '2024-01-01'
  },
  {
    id: '5',
    title: 'Noir Monochrome',
    description: 'A study in contrast and texture. Layer jet-black essentials with whisper-soft greys for an effortlessly refined silhouette.',
    category: 'Monochrome',
    season: 'Winter 2024',
    featured: true,
    images: [
      '/images/black1.png',
      '/images/black2.png',
      '/images/black3.png',
      '/images/blackSleeve1.png'
    ],
    products: ['9', '10', '11', '12'],
    tags: ['Monochrome', 'Layering', 'Texture', 'Noir'],
    createdAt: '2023-12-18'
  },
  {
    id: '6',
    title: 'Desert Mirage',
    description: 'Sun-baked earth tones meet airy tailoring. A capsule designed for golden-hour moments and endless horizons.',
    category: 'Resort',
    season: 'Spring 2025',
    featured: false,
    images: [
      '/images/orange1.png',
      '/images/orange2.png',
      '/images/orange3.png',
      '/images/white1.png'
    ],
    products: ['13', '14', '15', '16'],
    tags: ['Resort', 'Earthy', 'Sunset', 'Tailored'],
    createdAt: '2024-02-05'
  }
];

const LookbookPage: React.FC = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedLookbook, setSelectedLookbook] = useState<LookbookItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['All', ...Array.from(new Set(lookbookData.map(item => item.category)))];

  const filteredLookbooks = selectedCategory === 'All' 
    ? lookbookData 
    : lookbookData.filter(item => item.category === selectedCategory);

  const featuredLookbooks = lookbookData.filter(item => item.featured);

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart(productId, product.sizes[0], product.colors[0], 1);
    }
  };

  const openLookbookModal = (lookbook: LookbookItem) => {
    setSelectedLookbook(lookbook);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLookbook(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-20">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              LOOKBOOK
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover style inspiration and see our latest collections in action. 
              From streetwear to minimalist elegance, find your perfect look.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {featuredLookbooks.slice(0, 3).map((lookbook, index) => (
                <motion.button
                  key={lookbook.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  onClick={() => openLookbookModal(lookbook)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 hover:bg-white/20 transition-all duration-300"
                >
                  {lookbook.title}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-300 ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-300 ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lookbook Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          layout
          className={`grid gap-10 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
              : 'grid-cols-1'
          }`}
        >
          <AnimatePresence>
            {filteredLookbooks.map((lookbook, index) => (
              <motion.article
                key={lookbook.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.55, delay: index * 0.1, ease: 'easeOut' }}
                className={`group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-1 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
                  viewMode === 'list' ? 'flex flex-col md:flex-row md:items-stretch' : 'flex flex-col'
                }`}
              >
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -top-24 -right-16 h-56 w-56 rounded-full bg-red-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute -bottom-24 -left-20 h-60 w-60 rounded-full bg-sky-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                {/* Images */}
                <div
                  className={`relative overflow-hidden rounded-[26px] border border-white/15 bg-black/40 ${
                    viewMode === 'list' ? 'md:w-[48%]' : 'aspect-[4/5]'
                  }`}
                >
                  <img
                    src={lookbook.images[0]}
                    alt={lookbook.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/70" />

                  <div className="absolute top-6 left-6 flex items-center gap-2 rounded-full border border-white/30 bg-black/80 backdrop-blur-md px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.4em] text-white shadow-lg">
                    {lookbook.category}
                    <Sparkles size={14} className="text-white" />
                  </div>

                  <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                    {lookbook.featured && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/60 bg-amber-500/90 backdrop-blur-md px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg">
                        <Star size={14} className="text-white" />
                        Featured
                      </span>
                    )}
                    <span className="rounded-full border border-white/30 bg-black/80 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-white shadow-lg">
                      {lookbook.season}
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-6 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex gap-3">
                      <button
                        onClick={() => openLookbookModal(lookbook)}
                        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/80 text-slate-800 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white"
                      >
                        <Eye size={18} />
                      </button>
                      <button className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/60 text-slate-700 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white">
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`relative z-10 mt-8 flex flex-1 flex-col rounded-[26px] border border-gray-200 bg-white px-7 py-8 shadow-lg text-slate-900 ${
                    viewMode === 'list' ? 'md:ml-6 md:mt-0 md:w-[52%]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-700">
                      Look {index + 1}
                    </p>
                    <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-700">
                      {new Date(lookbook.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="mt-4 text-3xl font-black uppercase tracking-tight text-slate-900 transition-colors duration-500 group-hover:text-slate-800">
                    {lookbook.title}
                  </h3>

                  <p className="mt-4 text-sm leading-relaxed text-slate-700 line-clamp-4">
                    {lookbook.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {lookbook.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700"
                      >
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
                    <button
                      onClick={() => openLookbookModal(lookbook)}
                      className="group/button flex-1 rounded-full border border-slate-900/20 bg-slate-900 py-3.5 px-6 text-sm font-semibold uppercase tracking-[0.35em] text-white transition-all duration-500 hover:-translate-y-0.5 hover:bg-slate-800"
                    >
                      <span className="flex items-center justify-center gap-2">
                        View Lookbook
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-300 group-hover/button:translate-x-1"
                        />
                      </span>
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-800 transition-all duration-500 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900">
                      <Download size={16} />
                      Save
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lookbook Modal */}
      <AnimatePresence>
        {isModalOpen && selectedLookbook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedLookbook.title}</h2>
                    <p className="text-red-100 mb-4">{selectedLookbook.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                        {selectedLookbook.category}
                      </span>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                        {selectedLookbook.season}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-300"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                {/* Images Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {selectedLookbook.images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg"
                    >
                      <img
                        src={image}
                        alt={`${selectedLookbook.title} ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Featured Products */}
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {selectedLookbook.products.map((productId) => {
                      const product = products.find(p => p.id === productId);
                      if (!product) return null;
                      
                      return (
                        <motion.div
                          key={productId}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                          <div className="aspect-square relative overflow-hidden">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            />
                            <button
                              onClick={() => handleAddToCart(productId)}
                              className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
                            >
                              <ShoppingBag size={16} className="text-gray-800" />
                            </button>
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                            <p className="text-red-600 font-bold">R{(product.price / 100).toFixed(2)}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LookbookPage;
