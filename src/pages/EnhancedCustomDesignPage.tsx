import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHeader } from '../context/HeaderContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Palette, 
  Scissors, 
  Send, 
  FileText,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Clock,
  DollarSign,
  Ruler,
  X,
  Wand2,
  Star,
  Heart,
  Zap,
  ArrowRight,
  ArrowLeft,
  Brush,
  Shirt,
  Lock,
  Award,
  Users,
  TrendingUp,
  Shield,
  CheckCircle2,
  Image as ImageIcon,
  ThumbsUp,
  MessageCircle,
  Globe,
  Target
} from 'lucide-react';
import AuthPrompt from '../components/auth/AuthPrompt';

interface DesignRequest {
  title: string;
  description: string;
  category: string;
  budget: string;
  timeline: string;
  materials: string[];
  colors: string[];
  size: string;
  additionalNotes: string;
  referenceImages: File[];
}

const EnhancedCustomDesignPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { setIsHeaderDark } = useHeader();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  
  const [designRequest, setDesignRequest] = useState<DesignRequest>({
    title: '',
    description: '',
    category: '',
    budget: '',
    timeline: '',
    materials: [],
    colors: [],
    size: '',
    additionalNotes: '',
    referenceImages: []
  });

  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // Set header to dark when component mounts
  useEffect(() => {
    setIsHeaderDark(true);
    
    // Cleanup: reset header when component unmounts
    return () => {
      setIsHeaderDark(false);
    };
  }, [setIsHeaderDark]);

  const categories = [
    'Graphic T-Shirt', 'Text Design T-Shirt', 'Logo T-Shirt', 'Photo Print T-Shirt', 'Vintage Style T-Shirt', 'Minimalist T-Shirt', 'Sports T-Shirt', 'Event T-Shirt', 'Band/Music T-Shirt', 'Custom Art T-Shirt'
  ];

  const materials = [
    '100% Cotton', 'Cotton Blend', 'Organic Cotton', 'Bamboo Cotton', 'Polyester Blend', 'Tri-Blend', 'Performance Fabric', 'Vintage Wash Cotton'
  ];

  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Yellow', hex: '#F59E0B' },
    { name: 'Purple', hex: '#8B5CF6' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Orange', hex: '#F97316' },
    { name: 'Brown', hex: '#92400E' },
    { name: 'Gray', hex: '#6B7280' },
    { name: 'Navy', hex: '#1E3A8A' },
    { name: 'Gold', hex: '#D97706' },
    { name: 'Maroon', hex: '#7C2D12' },
    { name: 'Teal', hex: '#0D9488' },
    { name: 'Rust', hex: '#C2410C' }
  ];

  const budgets = [
    'R700 - Single T-Shirt Design'
  ];

  const timelines = [
    '3-5 days', '1 week', '2 weeks', 'Rush order (24-48 hours +R200)'
  ];

  const sizes = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom Measurements'
  ];

  const steps = [
    { id: 1, title: 'Basic Info', icon: FileText },
    { id: 2, title: 'Details', icon: Palette },
    { id: 3, title: 'Materials', icon: Scissors },
    { id: 4, title: 'Review', icon: CheckCircle }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDesignRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMaterialToggle = (material: string) => {
    const updated = selectedMaterials.includes(material)
      ? selectedMaterials.filter(m => m !== material)
      : [...selectedMaterials, material];
    
    setSelectedMaterials(updated);
    setDesignRequest(prev => ({
      ...prev,
      materials: updated
    }));
  };

  const handleColorToggle = (color: string) => {
    const updated = selectedColors.includes(color)
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color];
    
    setSelectedColors(updated);
    setDesignRequest(prev => ({
      ...prev,
      colors: updated
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setDesignRequest(prev => ({
      ...prev,
      referenceImages: [...prev.referenceImages, ...files]
    }));
  };

  const removeImage = (index: number) => {
    setDesignRequest(prev => ({
      ...prev,
      referenceImages: prev.referenceImages.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    if (!designRequest.title.trim()) {
      setError('Please provide a title for your design request');
      return false;
    }
    if (!designRequest.description.trim()) {
      setError('Please describe your design vision');
      return false;
    }
    if (!designRequest.category) {
      setError('Please select a category');
      return false;
    }
    if (!designRequest.budget) {
      setError('Please select your budget range');
      return false;
    }
    if (!designRequest.timeline) {
      setError('Please select your timeline');
      return false;
    }
    if (!designRequest.size) {
      setError('Please select a size');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('title', designRequest.title);
      formData.append('description', designRequest.description);
      formData.append('category', designRequest.category);
      formData.append('budget', designRequest.budget);
      formData.append('timeline', designRequest.timeline);
      formData.append('materials', JSON.stringify(designRequest.materials));
      formData.append('colors', JSON.stringify(designRequest.colors));
      formData.append('size', designRequest.size);
      formData.append('additionalNotes', designRequest.additionalNotes);
      formData.append('userId', user?.id || '');

      // Append reference images
      designRequest.referenceImages.forEach((file) => {
        formData.append(`referenceImages`, file);
      });

      // Simulate API call (replace with actual API endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
    } catch (error: unknown) {
      console.error('Failed to submit design request:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit design request. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20 relative overflow-hidden">
        {/* Modern background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-green-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/20">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="w-32 h-32 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/25"
              >
                <CheckCircle className="w-16 h-16 text-white" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 via-green-700 to-emerald-700 bg-clip-text text-transparent mb-6"
              >
                Design Request Submitted!
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                Thank you for your custom t-shirt order! We'll review your design and get back to you within 24-48 hours to confirm details and arrange payment of R700 (plus R200 for rush orders if selected).
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 mb-8 border border-green-200 shadow-lg"
              >
                <h3 className="font-bold text-green-900 mb-6 text-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 mr-3" />
                  What happens next?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <p className="text-green-800 text-lg">We'll review your t-shirt design request</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <p className="text-green-800 text-lg">We'll contact you to confirm design and arrange payment</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <p className="text-green-800 text-lg">We'll print your custom t-shirt with premium quality</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                      <span className="text-white text-sm font-bold">4</span>
                    </div>
                    <p className="text-green-800 text-lg">Your custom t-shirt will be ready for collection/delivery</p>
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                onClick={() => setIsSubmitted(false)}
                className="group bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 flex items-center space-x-3 mx-auto"
              >
                <span>Design Another T-Shirt</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20 relative overflow-hidden">
      {/* Modern background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Modern Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="flex items-center justify-center mb-8"
            >
              <div className="relative group">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500 group-hover:scale-110">
                  <Shirt className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 bg-clip-text text-transparent leading-tight">
                CUSTOM T-SHIRT
              </h1>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                DESIGN STUDIO
              </h2>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/20">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-lg font-semibold text-gray-800">Starting at R700</span>
                </div>
                <div className="mx-4 w-px h-6 bg-gray-300"></div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">Fast Turnaround</span>
                </div>
              </div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mt-8"
            >
              Transform your creative vision into premium custom t-shirts. From bold graphics to personal photos, 
              motivational quotes to business branding - we bring your ideas to life with professional quality printing.
            </motion.p>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
            >
              <div className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/15 p-6 backdrop-blur-xl shadow-[0_30px_80px_-45px_rgba(59,130,246,0.35)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_110px_-45px_rgba(59,130,246,0.45)]">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -top-20 -right-10 h-40 w-40 rounded-full bg-cyan-400/30 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" />
                </div>
                <div className="relative z-10">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30">
                    <Brush className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Premium Quality</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    High-grade fabrics, rich inks, and artisan finishing for a luxury hand-feel.
                  </p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/15 p-6 backdrop-blur-xl shadow-[0_30px_80px_-45px_rgba(236,72,153,0.35)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_110px_-45px_rgba(236,72,153,0.45)]">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -bottom-24 -left-12 h-44 w-44 rounded-full bg-pink-400/30 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(255,255,255,0.25),_transparent_60%)]" />
                </div>
                <div className="relative z-10">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-pink-500/30">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Personal Touch</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Dedicated designers translate your story into wearable art that feels uniquely yours.
                  </p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/15 p-6 backdrop-blur-xl shadow-[0_30px_80px_-45px_rgba(16,185,129,0.35)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_110px_-45px_rgba(16,185,129,0.45)]">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -top-16 -left-16 h-40 w-40 rounded-full bg-emerald-400/30 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.25),_transparent_60%)]" />
                </div>
                <div className="relative z-10">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-emerald-500/30">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Rapid Delivery</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Streamlined production pipelines deliver gallery-grade prints without the wait.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr,0.65fr]"
            >
              <div className="relative overflow-hidden rounded-[36px] border border-white/15 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-1 shadow-[0_40px_100px_-40px_rgba(79,70,229,0.55)]">
                <div className="relative h-full rounded-[32px] bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-slate-900/80 p-10">
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-purple-500/30 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_60%)]" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.85 }}
                      className="max-w-lg space-y-6"
                    >
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-white/80 backdrop-blur-xl">
                        Immersive Studio
                        <Sparkles size={14} />
                      </span>
                      <h3 className="text-4xl font-black text-white leading-tight">
                        Craft dream tees in a space built for imagination.
                      </h3>
                      <p className="text-base text-white/80 leading-relaxed">
                        Layer textures, blend palettes, and preview silhouettes in real time. Our designers co-create with you, ensuring every seam and shade supports your story.
                      </p>
                      <div className="flex flex-wrap gap-4 text-white/70 text-sm">
                        <span className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 backdrop-blur-xl">
                          <Palette size={16} />
                          Infinite Palettes
                        </span>
                        <span className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 backdrop-blur-xl">
                          <Ruler size={16} />
                          Tailored Fits
                        </span>
                        <span className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 backdrop-blur-xl">
                          <Sparkles size={16} />
                          Luxury Finishes
                        </span>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9, type: 'spring', stiffness: 120, damping: 14 }}
                      className="relative mx-auto flex w-full max-w-sm justify-center lg:max-w-md"
                    >
                      <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/15 blur-2xl" />
                      <div className="absolute -bottom-10 left-0 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl" />
                      <motion.img
                        src="/images/new1.png"
                        alt="Custom T-Shirt Mockup"
                        className="relative z-10 w-full rounded-[28px] border border-white/15 bg-white/5 p-6 backdrop-blur-2xl shadow-[0_40px_120px_-50px_rgba(59,130,246,0.55)]"
                        initial={{ y: 20 }}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    </motion.div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/60 p-6 backdrop-blur-xl shadow-[0_30px_90px_-50px_rgba(59,130,246,0.35)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-white/40 to-white/60" />
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Timeline</span>
                      <Clock className="h-5 w-5 text-blue-500" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900">3-5 day standard delivery</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Rush production available within 24-48 hours with dedicated concierge updates.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/60 p-6 backdrop-blur-xl shadow-[0_30px_90px_-50px_rgba(16,185,129,0.35)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/60 via-white/40 to-white/60" />
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Investment</span>
                      <DollarSign className="h-5 w-5 text-emerald-500" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900">Flat R700 design package</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Includes design consult, premium print, and optional add-ons for embroidery or foil.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="relative overflow-hidden rounded-3xl border border-white/15 bg-black text-white p-6 shadow-[0_30px_90px_-50px_rgba(99,102,241,0.45)]"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.25),_transparent_60%)]" />
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">Concierge</span>
                      <Sparkles className="h-5 w-5 text-pink-400" />
                    </div>
                    <h4 className="text-2xl font-black leading-snug">One-on-one art direction on every project.</h4>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Share references, sketches, or ideas—our team builds mood boards and iterations until it feels perfect.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats & Social Proof Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: Users, number: '500+', label: 'Happy Clients', color: 'from-blue-500 to-cyan-500' },
                { icon: Award, number: '1,200+', label: 'Designs Created', color: 'from-purple-500 to-pink-500' },
                { icon: Star, number: '4.9/5', label: 'Average Rating', color: 'from-yellow-500 to-orange-500' },
                { icon: Zap, number: '98%', label: 'Satisfaction Rate', color: 'from-green-500 to-emerald-500' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="text-center group"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </p>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Portfolio Gallery Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full border border-purple-200 mb-6"
            >
              <ImageIcon className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-bold text-purple-700 uppercase tracking-wider">Our Work</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-4">
              Design Showcase
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what we've created for our clients. Every design tells a unique story.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { image: '/images/new1.png', title: 'Band Logo Design', category: 'Music' },
              { image: '/images/new2.png', title: 'Corporate Branding', category: 'Business' },
              { image: '/images/new3.png', title: 'Personal Photo Print', category: 'Personal' },
              { image: '/images/black1.png', title: 'Vintage Style', category: 'Vintage' },
              { image: '/images/blue1.png', title: 'Sports Team', category: 'Sports' },
              { image: '/images/orange1.png', title: 'Event T-Shirt', category: 'Event' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-xl border border-gray-200"
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <p className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-1">{item.category}</p>
                      <h3 className="text-xl font-black">{item.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-3xl shadow-2xl p-12 border border-purple-200/50">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-6 py-2 bg-white/80 rounded-full border border-purple-200 mb-6"
              >
                <MessageCircle className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-bold text-purple-700 uppercase tracking-wider">Testimonials</span>
              </motion.div>
              <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-900 via-pink-900 to-blue-900 bg-clip-text text-transparent mb-4">
                What Our Clients Say
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah Johnson',
                  role: 'Band Manager',
                  image: '👩',
                  rating: 5,
                  text: 'Absolutely amazing! They brought our band\'s vision to life. The design quality is outstanding and the team was so professional throughout the process.',
                  design: 'Band Logo T-Shirt'
                },
                {
                  name: 'Michael Chen',
                  role: 'Business Owner',
                  image: '👨',
                  rating: 5,
                  text: 'Perfect for our company event! The custom design exceeded our expectations. Fast delivery and excellent communication. Highly recommend!',
                  design: 'Corporate Branding'
                },
                {
                  name: 'Emma Williams',
                  role: 'Event Organizer',
                  image: '👩',
                  rating: 5,
                  text: 'Incredible attention to detail! The personalized design for our event was exactly what we imagined. Will definitely use again!',
                  design: 'Event T-Shirt'
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                      {testimonial.image}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-xs text-purple-600 mt-1">{testimonial.design}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Process Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple, streamlined process from concept to creation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Submit Request', description: 'Fill out our design form with your vision and preferences', icon: FileText, color: 'from-blue-500 to-cyan-500' },
              { step: '2', title: 'Design Review', description: 'Our team reviews your request and creates initial concepts', icon: Palette, color: 'from-purple-500 to-pink-500' },
              { step: '3', title: 'Approval', description: 'You review and approve the design, we make any adjustments', icon: CheckCircle2, color: 'from-green-500 to-emerald-500' },
              { step: '4', title: 'Production', description: 'We print your design on premium quality t-shirts', icon: Shirt, color: 'from-orange-500 to-red-500' }
            ].map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br ${process.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <process.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-black text-gray-700">{process.step}</span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">{process.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{process.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust & Guarantees Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 rounded-3xl shadow-2xl p-12 border border-purple-500/20 relative overflow-hidden">
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }}
            ></div>
            
            <div className="relative z-10">
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6"
                >
                  <Shield className="w-5 h-5 text-white" />
                  <span className="text-sm font-bold text-white uppercase tracking-wider">Our Guarantees</span>
                </motion.div>
                <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
                  Trust & Quality
                </h2>
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  We stand behind every design with our commitment to excellence
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: Shield, title: '100% Satisfaction', description: 'Love it or we\'ll work until you do', color: 'text-blue-400' },
                  { icon: CheckCircle, title: 'Premium Quality', description: 'Only the finest materials and printing', color: 'text-green-400' },
                  { icon: Lock, title: 'Secure & Private', description: 'Your designs are completely confidential', color: 'text-purple-400' }
                ].map((guarantee, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <guarantee.icon className={`w-12 h-12 ${guarantee.color} mb-4`} />
                    <h3 className="text-2xl font-black text-white mb-3">{guarantee.title}</h3>
                    <p className="text-white/80 leading-relaxed">{guarantee.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35 }}
          className="mb-20"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 p-12 shadow-2xl">
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }}
            ></div>
            
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8"
              >
                <Wand2 className="w-16 h-16 text-white mx-auto mb-6" />
                <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                  Ready to Create Something Amazing?
                </h2>
                <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
                  Join hundreds of satisfied clients who've brought their visions to life. 
                  Start your custom design journey today!
                </p>
                <motion.button
                  onClick={() => {
                    const formSection = document.getElementById('design-form');
                    if (formSection) {
                      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-purple-600 px-12 py-5 rounded-2xl font-black text-xl shadow-2xl hover:shadow-white/25 transition-all duration-300 flex items-center gap-3 mx-auto"
                >
                  <Sparkles className="w-6 h-6" />
                  Start Your Design Request
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Modern Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mb-16"
          id="design-form"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <motion.div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                          isActive
                            ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-white shadow-2xl shadow-purple-500/25'
                            : isCompleted
                            ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="w-6 h-6" />
                      </motion.div>
                      <span className={`text-sm font-bold mt-3 ${
                        isActive ? 'text-purple-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 mx-6">
                        <div className={`h-2 rounded-full transition-all duration-500 ${
                          currentStep > step.id 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : 'bg-gray-200'
                        }`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modern Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <div className="text-center mb-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                    >
                      <FileText className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                      Let's Start Your Design
                    </h3>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Tell us about your vision and we'll bring it to life
                    </p>
                  </div>

                  {/* Design Inspiration Tips */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 mb-8"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">💡 Design Tips</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <span className="text-purple-600 font-bold mt-1">•</span>
                            <span>Be specific about colors, fonts, and placement (front, back, sleeves)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-purple-600 font-bold mt-1">•</span>
                            <span>Include reference images or sketches if you have them</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-purple-600 font-bold mt-1">•</span>
                            <span>Mention any text, logos, or graphics you want included</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-3"
                    >
                      <label className="block text-lg font-bold text-gray-800 flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                        Project Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={designRequest.title}
                        onChange={handleInputChange}
                        className="w-full px-6 py-5 bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl focus:outline-none focus:bg-white focus:border-slate-400 transition-all duration-300 text-gray-900 placeholder-gray-400 text-lg shadow-lg hover:shadow-xl"
                        placeholder="e.g., My Band Logo T-Shirt, Funny Quote Shirt, Family Photo Tee"
                        required
                      />
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-3"
                    >
                      <label className="block text-lg font-bold text-gray-800 flex items-center">
                        <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                        Category *
                      </label>
                      <select
                        name="category"
                        value={designRequest.category}
                        onChange={handleInputChange}
                        className="w-full px-6 py-5 bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl focus:outline-none focus:bg-white focus:border-slate-400 transition-all duration-300 text-gray-900 cursor-pointer text-lg shadow-lg hover:shadow-xl"
                        required
                      >
                        <option value="">Choose your design type</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </motion.div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-3"
                  >
                    <label className="block text-lg font-bold text-gray-800 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Design Description *
                    </label>
                    <div className="relative">
                      <textarea
                        name="description"
                        value={designRequest.description}
                        onChange={handleInputChange}
                        rows={8}
                        className="w-full px-6 py-5 bg-white/90 backdrop-blur-sm border-2 border-slate-200/70 rounded-2xl focus:outline-none focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-300 resize-none text-gray-900 placeholder-gray-400 text-lg shadow-lg hover:shadow-xl"
                        placeholder="Describe your t-shirt design idea in detail. What text, images, or graphics do you want? Where should they be placed (front, back, sleeve)? Any specific colors, fonts, or style preferences? The more details you provide, the better we can bring your vision to life!"
                        required
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                        {designRequest.description.length} characters
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex justify-end pt-6"
                  >
                    <button
                      type="button"
                      onClick={nextStep}
                      className="group bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 flex items-center space-x-3"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 2: Budget, Timeline, Size */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <div className="text-center mb-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                    >
                      <DollarSign className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                      Project Details
                    </h3>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Let's finalize the pricing, timeline, and size for your custom t-shirt
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-3"
                    >
                      <label className="block text-lg font-bold text-gray-800 flex items-center">
                        <span className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3 text-white font-bold text-sm">R</span>
                        Pricing *
                      </label>
                      <select
                        name="budget"
                        value={designRequest.budget}
                        onChange={handleInputChange}
                        className="w-full px-6 py-5 bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl focus:outline-none focus:bg-white focus:border-slate-400 transition-all duration-300 text-gray-900 cursor-pointer text-lg shadow-lg hover:shadow-xl"
                        required
                      >
                        <option value="">Choose your pricing</option>
                        {budgets.map(budget => (
                          <option key={budget} value={budget}>{budget}</option>
                        ))}
                      </select>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-3"
                    >
                      <label className="block text-lg font-bold text-gray-800 flex items-center">
                        <Clock className="w-6 h-6 mr-3 text-blue-600" />
                        Delivery Time *
                      </label>
                      <select
                        name="timeline"
                        value={designRequest.timeline}
                        onChange={handleInputChange}
                        className="w-full px-6 py-5 bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl focus:outline-none focus:bg-white focus:border-slate-400 transition-all duration-300 text-gray-900 cursor-pointer text-lg shadow-lg hover:shadow-xl"
                        required
                      >
                        <option value="">Select delivery time</option>
                        {timelines.map(timeline => (
                          <option key={timeline} value={timeline}>{timeline}</option>
                        ))}
                      </select>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-3"
                    >
                      <label className="block text-lg font-bold text-gray-800 flex items-center">
                        <Ruler className="w-6 h-6 mr-3 text-purple-600" />
                        T-Shirt Size *
                      </label>
                      <select
                        name="size"
                        value={designRequest.size}
                        onChange={handleInputChange}
                        className="w-full px-6 py-5 bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl focus:outline-none focus:bg-white focus:border-slate-400 transition-all duration-300 text-gray-900 cursor-pointer text-lg shadow-lg hover:shadow-xl"
                        required
                      >
                        <option value="">Choose your size</option>
                        {sizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </motion.div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex justify-between pt-6"
                  >
                    <button
                      type="button"
                      onClick={prevStep}
                      className="group px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all duration-300 flex items-center space-x-3"
                    >
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      <span>Previous</span>
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="group bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 flex items-center space-x-3"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 3: Materials and Colors */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <div className="text-center mb-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                    >
                      <Palette className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                      Customize Your T-Shirt
                    </h3>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Choose materials, colors, and upload your design references
                    </p>
                  </div>

                  {/* Materials */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-lg font-bold text-gray-800 mb-6 flex items-center">
                      <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                      T-Shirt Material (Optional)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {materials.map(material => (
                        <motion.button
                          key={material}
                          type="button"
                          onClick={() => handleMaterialToggle(material)}
                          className={`px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${
                            selectedMaterials.includes(material)
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl shadow-purple-500/25'
                          : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/70 hover:border-slate-300 shadow-lg hover:shadow-xl'
                          }`}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {material}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Colors */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-lg font-bold text-gray-800 mb-6 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      T-Shirt Base Color (Optional)
                    </label>
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                      {colors.map(color => (
                        <motion.button
                          key={color.name}
                          type="button"
                          onClick={() => handleColorToggle(color.name)}
                          className={`relative px-4 py-4 rounded-2xl transition-all duration-300 font-bold text-sm border ${
                            selectedColors.includes(color.name)
                              ? 'ring-4 ring-purple-500 ring-opacity-50 shadow-2xl'
                              : 'hover:ring-2 hover:ring-purple-300 hover:ring-opacity-30 shadow-lg hover:shadow-xl'
                          }`}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          style={{ backgroundColor: color.hex }}
                        >
                          <span className={`text-xs font-bold ${
                            color.name === 'White' || color.name === 'Yellow' ? 'text-gray-800' : 'text-white'
                          }`}>
                            {color.name}
                          </span>
                          {selectedColors.includes(color.name) && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
                            >
                              <CheckCircle className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Reference Images */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-lg font-bold text-gray-800 mb-6 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Design Images/References
                    </label>
                    <div className="border-2 border-dashed border-purple-300 rounded-2xl p-12 text-center hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300 group shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-purple-50/30">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center group-hover:scale-105 transition-transform duration-300"
                      >
                        <motion.div 
                          className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300"
                          whileHover={{ rotate: 5, scale: 1.1 }}
                        >
                          <Upload className="w-10 h-10 text-white" />
                        </motion.div>
                        <p className="text-gray-800 text-2xl mb-3 font-black">Upload your design references</p>
                        <p className="text-gray-600 text-base mb-4">PNG, JPG up to 10MB each - High resolution preferred</p>
                        <div className="flex items-center gap-2 text-sm text-purple-600 font-semibold">
                          <Sparkles className="w-4 h-4" />
                          <span>Drag & drop or click to browse</span>
                        </div>
                      </label>
                    </div>
                    
                    {/* Display uploaded images */}
                    {designRequest.referenceImages.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-700">
                            {designRequest.referenceImages.length} image{designRequest.referenceImages.length !== 1 ? 's' : ''} uploaded
                          </p>
                          <button
                            type="button"
                            onClick={() => setDesignRequest(prev => ({ ...prev, referenceImages: [] }))}
                            className="text-sm text-red-600 hover:text-red-700 font-semibold"
                          >
                            Clear All
                          </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {designRequest.referenceImages.map((file, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="relative group"
                            >
                              <div className="aspect-square overflow-hidden rounded-xl border-2 border-gray-200 group-hover:border-purple-400 transition-colors">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Reference ${index + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100 shadow-lg hover:scale-110"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                {file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Additional Notes */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3"
                  >
                    <label className="block text-lg font-bold text-gray-800 flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                      Additional Notes
                    </label>
                    <textarea
                      name="additionalNotes"
                      value={designRequest.additionalNotes}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-6 py-5 bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl focus:outline-none focus:bg-white focus:border-slate-400 transition-all duration-300 resize-none text-gray-900 placeholder-gray-400 text-lg shadow-lg hover:shadow-xl"
                      placeholder="Any special printing requirements, specific placement instructions, font preferences, or other details about your t-shirt design..."
                    />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex justify-between pt-6"
                  >
                    <button
                      type="button"
                      onClick={prevStep}
                      className="group px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all duration-300 flex items-center space-x-3"
                    >
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      <span>Previous</span>
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="group bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 flex items-center space-x-3"
                    >
                      <span>Review & Submit</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <div className="text-center mb-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                    >
                      <CheckCircle className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                      Review Your Design Request
                    </h3>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Please review all the details before submitting your custom t-shirt order
                    </p>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50 rounded-3xl p-8 space-y-8 border-2 border-purple-200 shadow-xl"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                      >
                        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-colors">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                            Project Title
                          </h4>
                          <p className="text-gray-800 text-lg font-semibold">{designRequest.title || 'Not specified'}</p>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-pink-100 hover:border-pink-300 transition-colors">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <span className="w-3 h-3 bg-pink-500 rounded-full mr-3"></span>
                            Category
                          </h4>
                          <p className="text-gray-800 text-lg font-semibold">{designRequest.category || 'Not specified'}</p>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-100 hover:border-green-300 transition-colors">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                            Pricing
                          </h4>
                          <p className="text-gray-800 text-lg font-semibold">{designRequest.budget || 'Not specified'}</p>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-4"
                      >
                        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-100 hover:border-blue-300 transition-colors">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                            Delivery Time
                          </h4>
                          <p className="text-gray-800 text-lg font-semibold">{designRequest.timeline || 'Not specified'}</p>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-100 hover:border-orange-300 transition-colors">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <span className="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
                            T-Shirt Size
                          </h4>
                          <p className="text-gray-800 text-lg font-semibold">{designRequest.size || 'Not specified'}</p>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-cyan-100 hover:border-cyan-300 transition-colors">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <span className="w-3 h-3 bg-cyan-500 rounded-full mr-3"></span>
                            Materials
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedMaterials.length > 0 ? (
                              selectedMaterials.map((material, idx) => (
                                <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                                  {material}
                                </span>
                              ))
                            ) : (
                              <p className="text-gray-500 text-lg">None selected</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border-2 border-indigo-100 hover:border-indigo-300 transition-colors"
                    >
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></span>
                        Design Description
                      </h4>
                      <p className="text-gray-800 text-lg leading-relaxed">{designRequest.description || 'Not specified'}</p>
                    </motion.div>
                    
                    {selectedColors.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-colors"
                      >
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                          <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                          Selected Colors
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {selectedColors.map((colorName, idx) => {
                            const colorObj = colors.find(c => c.name === colorName);
                            return (
                              <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                                <div 
                                  className="w-6 h-6 rounded-full border-2 border-gray-300"
                                  style={{ backgroundColor: colorObj?.hex || '#000000' }}
                                />
                                <span className="text-sm font-semibold text-gray-700">{colorName}</span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {designRequest.referenceImages.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.66 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-100 hover:border-green-300 transition-colors"
                      >
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                          <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                          Reference Images ({designRequest.referenceImages.length})
                        </h4>
                        <div className="grid grid-cols-4 gap-3 mt-4">
                          {designRequest.referenceImages.map((file, index) => (
                            <div key={index} className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Reference ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    
                    {designRequest.additionalNotes && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border-2 border-rose-100 hover:border-rose-300 transition-colors"
                      >
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                          <span className="w-3 h-3 bg-rose-500 rounded-full mr-3"></span>
                          Additional Notes
                        </h4>
                        <p className="text-gray-800 text-lg leading-relaxed">{designRequest.additionalNotes}</p>
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex justify-between pt-6"
                  >
                    <button
                      type="button"
                      onClick={prevStep}
                      className="group px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all duration-300 flex items-center space-x-3"
                    >
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      <span>Previous</span>
                    </button>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                      className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 text-white px-12 py-5 rounded-2xl font-black text-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl hover:shadow-green-500/25 flex items-center space-x-3"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-6 h-6" />
                          <span>Submit Design Request</span>
                          <Sparkles className="w-5 h-5 ml-2" />
                        </>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedCustomDesignPage;
