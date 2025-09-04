import React, { useState } from 'react';
import { Upload, Send, Sparkles, Palette, Ruler, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomRequest: React.FC = () => {
  const [formData, setFormData] = useState({
    designIdea: '',
    preferredColors: '',
    size: '',
    additionalNotes: '',
    name: '',
    email: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowSuccess(true);
    setFormData({
      designIdea: '',
      preferredColors: '',
      size: '',
      additionalNotes: '',
      name: '',
      email: '',
    });
    setSelectedFile(null);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-3 mb-6">
              <Sparkles className="h-8 w-8 text-purple-400" />
              <span className="text-purple-400 font-light tracking-widest text-sm uppercase">Custom Design</span>
              <Sparkles className="h-8 w-8 text-purple-400" />
            </div>
            
            <h2 className="fashion-heading text-7xl md:text-8xl mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              CUSTOM<br />DESIGN
            </h2>
            
            <p className="fashion-subheading mb-8 text-purple-300">YOUR VISION, OUR CRAFT</p>
            
            <motion.p 
              className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Share your creative vision with us, and we'll bring it to life with meticulous attention to detail and premium quality materials. Each piece is crafted to your exact specifications, ensuring a truly unique garment that reflects your personal style.
            </motion.p>
          </motion.div>

          {/* Form Section */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {/* Left Column - Visual Elements */}
            <div className="space-y-12">
              {/* Feature Cards */}
              <div className="space-y-6">
                <motion.div 
                  className="flex items-center space-x-4 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.02, x: 10 }}
                >
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <Palette className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Personalized Design</h3>
                    <p className="text-gray-400 text-sm">Every detail tailored to your vision</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center space-x-4 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.02, x: 10 }}
                >
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Ruler className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Perfect Fit</h3>
                    <p className="text-gray-400 text-sm">Custom sizing for your body type</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center space-x-4 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.02, x: 10 }}
                >
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <ImageIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Reference Images</h3>
                    <p className="text-gray-400 text-sm">Upload inspiration and sketches</p>
                  </div>
                </motion.div>
              </div>

              {/* Process Steps */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-6">How It Works</h3>
                <div className="space-y-4">
                  {[
                    { step: "01", title: "Share Your Vision", desc: "Tell us about your design concept" },
                    { step: "02", title: "We Craft", desc: "Our artisans bring it to life" },
                    { step: "03", title: "Perfect Fit", desc: "Receive your custom creation" }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center space-x-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{item.title}</h4>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-12"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">NAME</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none transition-all duration-300"
                    placeholder="Your full name"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">EMAIL</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </motion.div>
              </div>

              {/* Design Concept */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                viewport={{ once: true }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">DESIGN CONCEPT</label>
                <textarea
                  id="designIdea"
                  name="designIdea"
                  value={formData.designIdea}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none resize-none transition-all duration-300"
                  placeholder="Describe your design idea, inspiration, and any specific details..."
                />
              </motion.div>

              {/* Colors & Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">PREFERRED COLORS</label>
                  <input
                    type="text"
                    id="preferredColors"
                    name="preferredColors"
                    value={formData.preferredColors}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none transition-all duration-300"
                    placeholder="e.g., Navy, Gold, White"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  viewport={{ once: true }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">SELECT SIZE</label>
                  <select
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none transition-all duration-300"
                  >
                    <option value="" className="bg-gray-900">Choose your size</option>
                    <option value="S" className="bg-gray-900">SMALL</option>
                    <option value="M" className="bg-gray-900">MEDIUM</option>
                    <option value="L" className="bg-gray-900">LARGE</option>
                    <option value="XL" className="bg-gray-900">X-LARGE</option>
                    <option value="XXL" className="bg-gray-900">XX-LARGE</option>
                  </select>
                </motion.div>
              </div>

              {/* File Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                viewport={{ once: true }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">UPLOAD REFERENCE IMAGE</label>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-white/5 transition-all duration-300">
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 mb-4 text-purple-400" />
                    <p className="text-lg font-medium text-white mb-2">Drop your image here or click to browse</p>
                    <p className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    {selectedFile && (
                      <motion.p 
                        className="mt-4 text-sm text-green-400 font-medium"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        ✓ {selectedFile.name}
                      </motion.p>
                    )}
                  </label>
                </div>
              </motion.div>

              {/* Additional Notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                viewport={{ once: true }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">ADDITIONAL NOTES</label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none resize-none transition-all duration-300"
                  placeholder="Any additional details, preferences, or special requests..."
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="group w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="tracking-wider">SUBMIT REQUEST</span>
                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Success Message */}
              {showSuccess && (
                <motion.div 
                  className="border border-green-400/30 bg-green-500/10 p-6 rounded-xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <p className="tracking-wider text-sm text-green-400 font-medium text-center">
                    ✨ YOUR REQUEST HAS BEEN SUBMITTED SUCCESSFULLY ✨
                  </p>
                </motion.div>
              )}
            </motion.form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CustomRequest;