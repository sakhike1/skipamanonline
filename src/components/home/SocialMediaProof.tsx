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
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            <span className="block">SOCIAL</span>
            <span className="block bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              PROOF
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our customers are saying about us on social media
          </p>
        </motion.div>

        {/* Social Posts Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Post Container */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Platform Header */}
              <motion.div 
                className="flex items-center gap-3 p-6 border-b border-gray-100"
                key={`header-${currentPost}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center`}>
                  {React.createElement(getPlatformIcon(socialPosts[currentPost].platform), {
                    className: `w-6 h-6 ${getPlatformColor(socialPosts[currentPost].platform)}`
                  })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {socialPosts[currentPost].username}
                    </h3>
                    {socialPosts[currentPost].verified && (
                      <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
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
                className="p-6"
              >
                {/* Post Image */}
                <div className="mb-4 rounded-2xl overflow-hidden">
                  <img
                    src={socialPosts[currentPost].image}
                    alt="Customer photo"
                    className="w-full h-64 object-cover"
                  />
                </div>

                {/* Post Text */}
                <p className="text-gray-800 leading-relaxed mb-6">
                  {socialPosts[currentPost].content}
                </p>

                {/* Engagement Stats */}
                <div className="flex items-center gap-6 text-gray-500">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="font-medium">{formatNumber(socialPosts[currentPost].likes)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">{socialPosts[currentPost].comments}</span>
                  </div>
                  {socialPosts[currentPost].shares && (
                    <div className="flex items-center gap-2">
                      <Share2 className="w-5 h-5" />
                      <span className="font-medium">{socialPosts[currentPost].shares}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 gap-3">
              {socialPosts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPost(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentPost
                      ? 'bg-purple-500 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              50K+
            </div>
            <p className="text-gray-600 font-medium">Social Followers</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              4.8/5
            </div>
            <p className="text-gray-600 font-medium">Social Rating</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              10K+
            </div>
            <p className="text-gray-600 font-medium">User Posts</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              99%
            </div>
            <p className="text-gray-600 font-medium">Positive Mentions</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialMediaProof;
