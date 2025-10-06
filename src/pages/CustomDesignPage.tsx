import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHeader } from '../context/HeaderContext';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Palette, 
  Scissors, 
  Send, 
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

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

const CustomDesignPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { setIsHeaderDark } = useHeader();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
    'Custom T-Shirt', 'Hoodie', 'Tank Top', 'Long Sleeve', 'Polo Shirt', 'Crop Top', 'Vintage Tee', 'Sports Jersey', 'Other'
  ];

  const materials = [
    'Cotton', 'Silk', 'Wool', 'Linen', 'Denim', 'Leather', 'Suede', 'Cashmere', 'Polyester', 'Rayon'
  ];

  const colors = [
    'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Orange', 'Brown', 'Gray', 'Navy'
  ];

  const budgets = [
    'Under $100', '$100 - $300', '$300 - $500', '$500 - $1000', 'Over $1000'
  ];

  const timelines = [
    '1-2 weeks', '2-4 weeks', '1-2 months', '2-3 months', 'Flexible'
  ];

  const sizes = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom Measurements'
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
      setError('Please log in to submit a design request');
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Design Request Submitted!</h1>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for sharing your creative vision with us. Our design team will review your request and get back to you within 24-48 hours.
              </p>
              <div className="bg-purple-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-purple-900 mb-2">What happens next?</h3>
                <ul className="text-left text-purple-800 space-y-2">
                  <li>• Our design team will review your request</li>
                  <li>• We'll contact you to discuss details and pricing</li>
                  <li>• Once approved, we'll begin crafting your custom piece</li>
                  <li>• You'll receive regular updates on the progress</li>
                </ul>
              </div>
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <Palette className="w-8 h-8 text-purple-600" />
            </div>
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
              <Scissors className="w-8 h-8 text-pink-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">CUSTOM DESIGN</h1>
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">YOUR VISION, OUR CRAFT</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Share your creative vision with us, and we'll bring it to life with meticulous attention to detail and premium quality materials. Each piece is crafted to your exact specifications, ensuring a truly unique garment that reflects your personal style.
          </p>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Design Request Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={designRequest.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-900 placeholder-gray-500"
                    placeholder="e.g., Custom Band T-Shirt, Logo Design, Personal Quote"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={designRequest.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-900"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Design Description *
              </label>
              <textarea
                name="description"
                value={designRequest.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 resize-none text-gray-900 placeholder-gray-500"
                placeholder="Describe your design idea in detail. What text, graphics, or images do you want? Any specific colors, fonts, or placement preferences?"
                required
              />
            </div>

            {/* Budget and Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range *
                </label>
                <select
                  name="budget"
                  value={designRequest.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-900"
                  required
                >
                  <option value="">Select budget range</option>
                  {budgets.map(budget => (
                    <option key={budget} value={budget}>{budget}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline *
                </label>
                <select
                  name="timeline"
                  value={designRequest.timeline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-900"
                  required
                >
                  <option value="">Select timeline</option>
                  {timelines.map(timeline => (
                    <option key={timeline} value={timeline}>{timeline}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size *
              </label>
              <select
                name="size"
                value={designRequest.size}
                onChange={handleInputChange}
                className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-900"
                required
              >
                <option value="">Select size</option>
                {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Materials */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred Materials
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {materials.map(material => (
                  <button
                    key={material}
                    type="button"
                    onClick={() => handleMaterialToggle(material)}
                    className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 font-medium ${
                      selectedMaterials.includes(material)
                        ? 'border-purple-500 bg-purple-500 text-white shadow-lg transform scale-105'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 hover:shadow-md'
                    }`}
                  >
                    {material}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred Colors
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {colors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorToggle(color)}
                    className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 font-medium ${
                      selectedColors.includes(color)
                        ? 'border-purple-500 bg-purple-500 text-white shadow-lg transform scale-105'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 hover:shadow-md'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Reference Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Reference Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300">
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
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-gray-700 font-medium mb-1">Click to upload reference images</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB each • Drag and drop supported</p>
                </label>
              </div>
              
              {/* Display uploaded images */}
              {designRequest.referenceImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {designRequest.referenceImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Reference ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="additionalNotes"
                value={designRequest.additionalNotes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 resize-none text-gray-900 placeholder-gray-500"
                placeholder="Any specific printing requirements, placement instructions, font preferences, or other design details..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3" />
                    Submit Design Request
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomDesignPage;
