import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Facebook, Heart, MessageCircle, Share2 } from 'lucide-react';

interface SocialPost {
  id: number;
  platform: 'instagram' | 'twitter' | 'facebook';
  username: string;
  content: string;
  image: string;
  likes: number;
  comments: number;
  shares?: number;
  date: string;
  verified: boolean;
}

const SocialMediaProof: React.FC = () => {
  const [currentPost, setCurrentPost] = useState(0);

  const socialPosts: SocialPost[] = [
    {
      id: 1,
      platform: 'instagram',
      username: 'sarah_fashion',
      content: 'Just got my new t-shirt from @skipamanstore and I\'m obsessed! The quality is amazing and the fit is perfect ✨ #skipamanstore #fashion #tshirt',
      image: '/images/4.jpg',
      likes: 1247,
      comments: 89,
      date: '2 days ago',
      verified: true
    },
    {
      id: 2,
      platform: 'twitter',
      username: 'mike_style',
      content: 'Finally found the perfect t-shirt brand! @skipamanstore has the best quality and designs. Highly recommend! 🎯',
      image: '/images/5.jpg',
      likes: 342,
      comments: 23,
      shares: 67,
      date: '1 week ago',
      verified: false
    },
    {
      id: 3,
      platform: 'instagram',
      username: 'emma_trends',
      content: 'Love my new collection from @skipamanstore! The fabric is so soft and the designs are so unique. Can\'t wait to order more! 💕',
      image: '/images/6.jpg',
      likes: 892,
      comments: 45,
      date: '3 days ago',
      verified: true
    },
    {
      id: 4,
      platform: 'facebook',
      username: 'David Wilson',
      content: 'Amazing customer service and fast shipping! The t-shirts are exactly as described and the quality is outstanding. Will definitely order again!',
      image: '/images/7.jpg',
      likes: 156,
      comments: 12,
      shares: 8,
      date: '5 days ago',
      verified: false
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPost((prev) => (prev + 1) % socialPosts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [socialPosts.length]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return Instagram;
      case 'twitter':
        return Twitter;
      case 'facebook':
        return Facebook;
      default:
        return Instagram;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return 'text-pink-500';
      case 'twitter':
        return 'text-blue-500';
      case 'facebook':
        return 'text-blue-600';
      default:
        return 'text-gray-500';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Instagram className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-bold text-purple-900 uppercase tracking-wider">Social Proof</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
            <span className="block text-gray-900">JOIN THE</span>
            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              MOVEMENT
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Thousands of satisfied customers are sharing their love for our products
          </p>
        </motion.div>

        {/* Social Posts Carousel */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Post Container */}
            <motion.div 
              className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200 hover:border-purple-300 transition-all duration-500"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Platform Header */}
              <motion.div 
                className="flex items-center gap-4 p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white"
                key={`header-${currentPost}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-md ring-2 ring-white`}>
                  {React.createElement(getPlatformIcon(socialPosts[currentPost].platform), {
                    className: `w-7 h-7 ${getPlatformColor(socialPosts[currentPost].platform)}`
                  })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {socialPosts[currentPost].username}
                    </h3>
                    {socialPosts[currentPost].verified && (
                      <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                        <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {socialPosts[currentPost].date}
                  </p>
                </div>
              </motion.div>

              {/* Post Content */}
              <motion.div 
                key={`content-${currentPost}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-8"
              >
                {/* Post Image */}
                <div className="mb-6 rounded-2xl overflow-hidden shadow-lg ring-1 ring-gray-200">
                  <img
                    src={socialPosts[currentPost].image}
                    alt="Customer photo"
                    className="w-full h-72 md:h-80 object-cover"
                  />
                </div>

                {/* Post Text */}
                <p className="text-gray-900 leading-relaxed mb-8 text-lg font-medium">
                  {socialPosts[currentPost].content}
                </p>

                {/* Engagement Stats */}
                <div className="flex items-center gap-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="p-2 rounded-full bg-red-50 group-hover:bg-red-100 transition-colors">
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    </div>
                    <span className="font-bold text-gray-900">{formatNumber(socialPosts[currentPost].likes)}</span>
                  </div>
                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="p-2 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                      <MessageCircle className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="font-bold text-gray-900">{socialPosts[currentPost].comments}</span>
                  </div>
                  {socialPosts[currentPost].shares && (
                    <div className="flex items-center gap-3 group cursor-pointer">
                      <div className="p-2 rounded-full bg-green-50 group-hover:bg-green-100 transition-colors">
                        <Share2 className="w-5 h-5 text-green-500" />
                      </div>
                      <span className="font-bold text-gray-900">{socialPosts[currentPost].shares}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-10 gap-3">
              {socialPosts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPost(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentPost
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125 shadow-lg shadow-purple-500/50'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats - Modern Closing Section */}
        <motion.div 
          className="mt-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-3xl p-12 md:p-16 border-2 border-purple-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                  50K+
                </div>
                <p className="text-gray-700 font-semibold">Social Followers</p>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-3">
                  4.8/5
                </div>
                <p className="text-gray-700 font-semibold">Social Rating</p>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  10K+
                </div>
                <p className="text-gray-700 font-semibold">User Posts</p>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                  99%
                </div>
                <p className="text-gray-700 font-semibold">Positive Mentions</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Closing CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Ready to Join the Community?
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Follow us on social media and be part of our growing family of happy customers
          </p>
          <div className="flex justify-center gap-4">
            <motion.a
              href="#"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Follow Us
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialMediaProof;
