import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingCart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SlideData {
  id: string;
  media: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  };
  title: string;
  subtitle: string;
  cta: string;
  promo: string;
  features: string[];
  color: {
    background: string;
    text: string;
  };
}

// Hero media URLs are served from `/public/images`.
const SLIDES_DATA: SlideData[] = [
  {
    id: 'urban-edge',
    media: {
      type: 'video',
      url: '/images/video1.mp4',
      thumbnail: '/images/image1.jpg'
    },
    title: 'Urban Edge Collection',
    subtitle: 'Streetwear that tells your story',
    cta: 'Explore Urban Styles',
    promo: 'Limited Time Offer: 20% Off',
    features: [
      'Premium Organic Cotton',
      'Unique Graphic Designs',
      'Sustainable Fashion'
    ],
    color: {
      background: 'bg-gradient-to-r from-gray-100 to-slate-200',
      text: 'text-gray-900'
    }
  },
  {
    id: 'minimalist-essentials',
    media: {
      type: 'image',
      url: '/images/image1.jpg'
    },
    title: 'Minimalist Essentials',
    subtitle: 'Timeless Comfort, Refined Design',
    cta: 'Shop Essentials',
    promo: 'New Season Drop',
    features: [
      'Soft Touch Fabric',
      'Versatile Styling',
      'Perfect Fit Guarantee'
    ],
    color: {
      background: 'bg-gradient-to-r from-gray-100/80 to-slate-200/80',
      text: 'text-gray-900'
    }
  },
  {
    id: 'limited-artist-series',
    media: {
      type: 'image',
      url: '/images/image6.jpg'
    },
    title: 'Limited Artist Series',
    subtitle: 'Wearable Art, Exclusive Drops',
    cta: 'View Rare Designs',
    promo: 'Exclusive Collection',
    features: [
      'Collaboration with Local Artists',
      'Limited Edition Prints',
      'Collector\'s Items'
    ],
    color: {
      background: 'bg-gradient-to-r from-gray-100/80 to-slate-200/80',
      text: 'text-gray-900'
    }
  }
];

const SIDE_TEXTS = {
  left: [
    "Premium Quality",
    "Handcrafted",
    "Exclusive Design",
    "Artisanal Craft",
    "Unique Style"
  ],
  right: [
    "Limited Edition",
    "Sustainable",
    "Eco-Friendly",
    "Ethical Fashion",
    "Green Materials"
  ]
};

const ParticleEffect: React.FC<{ key: string }> = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 2 + 1
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
          }}
          initial={{ 
            opacity: 0,
            scale: 0,
            x: 0,
            y: 0
          }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: [0, (Math.random() - 0.5) * 100],
            y: [0, (Math.random() - 0.5) * 100]
          }}
          transition={{
            duration: particle.duration,
            ease: "easeOut",
            times: [0, 0.5, 1]
          }}
        />
      ))}
    </div>
  );
};

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [mediaError, setMediaError] = useState(false);
  const [leftTextIndex, setLeftTextIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const slideInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const startAutoSlide = useCallback(() => {
    if (slideInterval.current) clearInterval(slideInterval.current);
    
    slideInterval.current = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % SLIDES_DATA.length);
    }, 5000);
  }, []);

  const stopAutoSlide = useCallback(() => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
      slideInterval.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoSlide();
    const video = videoRef.current; // Capture ref value
    return () => {
      stopAutoSlide();
      // Cleanup video when component unmounts
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    };
  }, [startAutoSlide, stopAutoSlide]);

  useEffect(() => {
    // Start text rotation for left side
    const leftInterval = setInterval(() => {
      setLeftTextIndex((prev) => (prev + 1) % SIDE_TEXTS.left.length);
    }, 4000);

    return () => {
      clearInterval(leftInterval);
    };
  }, []);

  useEffect(() => {
    const el = imageRef.current;
    if (!el) return;
    el.setAttribute('fetchpriority', currentSlideIndex === 0 ? 'high' : 'low');
  }, [currentSlideIndex]);

  const handleSlideChange = useCallback((index: number) => {
    // Pause current video before changing slides
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setCurrentSlideIndex(index);
    stopAutoSlide();
    startAutoSlide();
  }, [stopAutoSlide, startAutoSlide]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    setMousePosition({ x, y });
  }, []);

  const handleMediaLoad = useCallback(() => {
    setIsMediaLoading(false);
    setMediaError(false);
  }, []);

  const handleMediaError = useCallback(() => {
    setIsMediaLoading(false);
    setMediaError(true);
  }, []);

  const currentSlide = SLIDES_DATA[currentSlideIndex];

  const renderMedia = () => {
    if (currentSlide.media.type === 'video') {
      return (
        <>
          {isMediaLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
          {mediaError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
              <p className="text-white">Failed to load video</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                src={currentSlide.media.url}
                className="absolute inset-0 w-full h-full object-cover"
                loop
                muted
                playsInline
                autoPlay
                onLoadedData={handleMediaLoad}
                onError={handleMediaError}
                onAbort={() => console.log('Video playback was aborted')}
              />
            </>
          )}
        </>
      );
    }

    return (
      <>
        {isMediaLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
        {mediaError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
            <p className="text-white">Failed to load image</p>
          </div>
        ) : (
          <motion.img 
            ref={imageRef}
            src={currentSlide.media.url} 
            alt={currentSlide.title}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{
              scale: isHovered ? 1.1 : 1,
              x: isHovered ? mousePosition.x : 0,
              y: isHovered ? mousePosition.y : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              mass: 1
            }}
            onLoad={handleMediaLoad}
            onError={handleMediaError}
          />
        )}
      </>
    );
  };

  return (
    <motion.div 
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 ${currentSlide.color.background}`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div className="absolute inset-0">
              {renderMedia()}
            </motion.div>
            
            {/* Particle Effect */}
            <AnimatePresence>
              <ParticleEffect key={`particles-${currentSlide.id}`} />
            </AnimatePresence>

            {/* Left side animated text */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden md:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={leftTextIndex}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                  className="text-left"
                >
                  <motion.span
                    className="block text-xl font-medium writing-mode-vertical text-gray-900"
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                    animate={{
                      color: [
                        '#111827',
                        '#374151',
                        '#6b7280',
                        '#374151',
                        '#111827'
                      ]
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    {SIDE_TEXTS.left[leftTextIndex]}
                  </motion.span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Main content — inset card on mobile so it doesn’t span edge-to-edge */}
            <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-5 md:px-6">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="relative mx-auto w-full max-w-[calc(100vw-2rem)] space-y-4 text-left sm:max-w-2xl sm:space-y-6 md:max-w-4xl"
              >
                {/* Text background “card” — tighter inset on small screens */}
                <div className="absolute -inset-2 -z-10 rounded-2xl bg-white/55 backdrop-blur-md sm:-inset-4 sm:rounded-3xl sm:bg-white/60" />

                <h1 className="relative z-10 text-[1.65rem] font-bold leading-[1.1] tracking-tight text-black drop-shadow-[0_1px_6px_rgba(255,255,255,0.85)] sm:text-5xl sm:leading-tight xl:text-7xl">
                  {currentSlide.title}
                </h1>
                <p className="relative z-10 text-base font-semibold text-gray-900 drop-shadow-[0_1px_4px_rgba(255,255,255,0.75)] sm:text-xl">
                  {currentSlide.subtitle}
                </p>

                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {currentSlide.features.map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="rounded-md border border-gray-900/35 bg-gray-900/80 px-2.5 py-1 text-[11px] font-medium text-white shadow-md backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm"
                      >
                        {feature}
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/shop')}
                      className="group relative rounded-xl shadow-xl transition-all duration-300 sm:rounded-2xl sm:shadow-2xl"
                    >
                      <span className="pointer-events-none absolute -inset-[2px] rounded-xl bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-amber-400 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100 sm:rounded-2xl" />
                      <span className="pointer-events-none absolute -inset-[1px] rounded-xl bg-[length:200%_200%] bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-amber-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-[gradientShift_1.5s_ease_infinite] sm:rounded-2xl" />
                      <span className="relative z-10 flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white shadow-xl transition-colors duration-300 group-hover:bg-gray-950 sm:gap-3 sm:rounded-2xl sm:px-8 sm:py-4 sm:text-lg">
                        <ShoppingCart className="h-[18px] w-[18px] shrink-0 sm:h-[22px] sm:w-[22px]" aria-hidden />
                        <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-[length:200%_200%] bg-clip-text text-transparent group-hover:from-fuchsia-100 group-hover:via-white group-hover:to-cyan-100">
                          {currentSlide.cta}
                        </span>
                        <ArrowRight className="h-[18px] w-[18px] shrink-0 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" aria-hidden />
                      </span>
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0, 0, 0, 0.25)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/new-arrivals')}
                      className="group flex items-center justify-center gap-2 rounded-xl border-2 border-gray-900/45 bg-gray-900/70 px-5 py-3 text-sm font-bold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:border-gray-900 hover:bg-gray-900/90 sm:gap-3 sm:rounded-2xl sm:px-8 sm:py-4 sm:text-lg"
                    >
                      <span>{currentSlide.promo}</span>
                      <ArrowRight className="h-[18px] w-[18px] shrink-0 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" aria-hidden />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Slide indicators: small “pill” track (global 44px min-button was blowing these up on mobile) */}
      <div
        className="pointer-events-auto absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center sm:bottom-7 md:bottom-9"
        role="tablist"
        aria-label="Hero slides"
      >
        <div className="flex items-center gap-1 rounded-full border border-white/20 bg-black/35 px-2 py-1.5 shadow-lg backdrop-blur-md sm:gap-1.5 sm:px-2.5 sm:py-2">
          {SLIDES_DATA.map((_, index) => {
            const active = currentSlideIndex === index;
            return (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleSlideChange(index)}
                className="carousel-indicator-dot inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-transparent transition-colors hover:bg-white/10 sm:h-10 sm:w-10"
                aria-label={`Go to slide ${index + 1}`}
              >
                <span
                  className={[
                    'block rounded-full transition-all duration-300 ease-out',
                    active
                      ? 'h-1 w-6 bg-white shadow-[0_0_12px_rgba(255,255,255,0.45)] sm:h-1.5 sm:w-7'
                      : 'h-1 w-1 bg-white/40 hover:bg-white/65 sm:h-1.5 sm:w-1.5',
                  ].join(' ')}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default HeroSection;