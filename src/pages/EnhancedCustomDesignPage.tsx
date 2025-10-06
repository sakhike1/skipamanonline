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
  Lock
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
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                  <Brush className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Premium Quality</h3>
                <p className="text-gray-600 text-sm">High-grade materials and professional printing techniques</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Personal Touch</h3>
                <p className="text-gray-600 text-sm">Every design is crafted with attention to your unique vision</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Fast Delivery</h3>
                <p className="text-gray-600 text-sm">Quick turnaround times to get your designs fast</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Modern Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
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
                        className="w-full px-6 py-5 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-300 transition-all duration-300 text-gray-900 placeholder-gray-400 text-lg shadow-lg hover:shadow-xl focus:shadow-purple-500/10"
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
                        className="w-full px-6 py-5 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-300 transition-all duration-300 text-gray-900 cursor-pointer text-lg shadow-lg hover:shadow-xl focus:shadow-purple-500/10"
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
                    <textarea
                      name="description"
                      value={designRequest.description}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-6 py-5 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-300 transition-all duration-300 resize-none text-gray-900 placeholder-gray-400 text-lg shadow-lg hover:shadow-xl focus:shadow-purple-500/10"
                      placeholder="Describe your t-shirt design idea in detail. What text, images, or graphics do you want? Where should they be placed (front, back, sleeve)? Any specific colors, fonts, or style preferences? The more details you provide, the better we can bring your vision to life!"
                      required
                    />
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
                        className="w-full px-6 py-5 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-green-500/20 focus:border-green-300 transition-all duration-300 text-gray-900 cursor-pointer text-lg shadow-lg hover:shadow-xl focus:shadow-green-500/10"
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
                        className="w-full px-6 py-5 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-300 text-gray-900 cursor-pointer text-lg shadow-lg hover:shadow-xl focus:shadow-blue-500/10"
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
                        className="w-full px-6 py-5 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-300 transition-all duration-300 text-gray-900 cursor-pointer text-lg shadow-lg hover:shadow-xl focus:shadow-purple-500/10"
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
                              : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 border-2 border-gray-200 hover:border-purple-300 shadow-lg hover:shadow-xl'
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
                          className={`relative px-4 py-4 rounded-2xl transition-all duration-300 font-bold text-sm border-2 ${
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
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300 group">
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
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                          <Upload className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-gray-700 text-xl mb-3 font-bold">Upload your design references</p>
                        <p className="text-gray-500 text-lg">PNG, JPG up to 10MB each - High resolution preferred</p>
                      </label>
                    </div>
                    
                    {/* Display uploaded images */}
                    {designRequest.referenceImages.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6"
                      >
                        {designRequest.referenceImages.map((file, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Reference ${index + 1}`}
                              className="w-full h-40 object-cover rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </motion.div>
                        ))}
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
                      className="w-full px-6 py-5 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/20 focus:border-orange-300 transition-all duration-300 resize-none text-gray-900 placeholder-gray-400 text-lg shadow-lg hover:shadow-xl focus:shadow-orange-500/10"
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
                    className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 space-y-8 border border-gray-200 shadow-lg"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                      >
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                            Project Title
                          </h4>
                          <p className="text-gray-700 text-lg">{designRequest.title || 'Not specified'}</p>
                        </div>
                        
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                            Category
                          </h4>
                          <p className="text-gray-700 text-lg">{designRequest.category || 'Not specified'}</p>
                        </div>
                        
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                            Pricing
                          </h4>
                          <p className="text-gray-700 text-lg">{designRequest.budget || 'Not specified'}</p>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-4"
                      >
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                            Delivery Time
                          </h4>
                          <p className="text-gray-700 text-lg">{designRequest.timeline || 'Not specified'}</p>
                        </div>
                        
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                            T-Shirt Size
                          </h4>
                          <p className="text-gray-700 text-lg">{designRequest.size || 'Not specified'}</p>
                        </div>
                        
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></span>
                            Materials
                          </h4>
                          <p className="text-gray-700 text-lg">{selectedMaterials.length > 0 ? selectedMaterials.join(', ') : 'None selected'}</p>
                        </div>
                      </motion.div>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
                    >
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                        Design Description
                      </h4>
                      <p className="text-gray-700 text-lg leading-relaxed">{designRequest.description || 'Not specified'}</p>
                    </motion.div>
                    
                    {designRequest.additionalNotes && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
                      >
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-rose-500 rounded-full mr-3"></span>
                          Additional Notes
                        </h4>
                        <p className="text-gray-700 text-lg leading-relaxed">{designRequest.additionalNotes}</p>
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
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group bg-gradient-to-r from-green-500 to-emerald-500 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25 flex items-center space-x-3"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Submit Design Request</span>
                        </>
                      )}
                    </button>
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
