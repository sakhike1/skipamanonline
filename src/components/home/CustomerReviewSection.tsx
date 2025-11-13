import { motion } from 'framer-motion';
import { Star, CheckCircle, TrendingUp, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { testimonials } from '../../data/testimonials';

/**
 * Powerful customer review section - Closing with a bang
 * White background with impressive testimonials and strong CTA
 */
const CustomerReviewSection: React.FC = () => {

  return (
    <div className="relative bg-white py-24 md:py-32 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-100/20 to-pink-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Award className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-bold text-purple-900 uppercase tracking-wider">Customer Reviews</span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
            <span className="block text-gray-900">WHAT OUR</span>
            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              CUSTOMERS SAY
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Join thousands of satisfied customers who trust us for premium quality and exceptional service
          </p>

          {/* Stats Bar */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
              <div className="text-left">
                <div className="text-3xl font-black text-gray-900">4.9</div>
                <div className="text-sm text-gray-600 font-medium">Average Rating</div>
              </div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-3xl font-black text-gray-900">10K+</div>
                <div className="text-sm text-gray-600 font-medium">Happy Customers</div>
              </div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-3xl font-black text-gray-900">99%</div>
                <div className="text-sm text-gray-600 font-medium">Satisfaction Rate</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.2)] transition-all duration-500 hover:-translate-y-3 hover:border-slate-200 hover:shadow-[0_45px_120px_-45px_rgba(99,102,241,0.35)]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 -right-12 h-48 w-48 rounded-full bg-purple-400/25 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute -bottom-28 -left-16 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent_70%)]" />
              </div>

              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < testimonial.rating
                                ? 'text-yellow-400 fill-current drop-shadow-[0_5px_10px_rgba(250,204,21,0.45)]'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-slate-500">
                        {testimonial.rating}.0
                      </span>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                      {testimonial.purchase}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 shadow-inner">
                    <span>{testimonial.date}</span>
                  </div>
                </div>

                <blockquote className="relative mt-8 text-lg leading-relaxed text-slate-700">
                  <span className="absolute -left-4 -top-4 text-5xl font-serif text-purple-300/70">“</span>
                  <p className="relative z-10 font-medium">
                    {testimonial.text}
                  </p>
                </blockquote>

                <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-200/70 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white text-lg font-bold shadow-lg shadow-purple-500/30">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{testimonial.name}</h4>
                        {testimonial.verified && (
                          <CheckCircle className="h-4 w-4 text-emerald-500" fill="currentColor" />
                        )}
                      </div>
                      <p className="text-sm text-slate-500">{testimonial.location}</p>
                    </div>
                  </div>
                  {testimonial.helpful && (
                    <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                      {testimonial.helpful}+ Helpful
                    </span>
                  )}
                </div>

                {testimonial.tags && testimonial.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {testimonial.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="flex items-center gap-2 rounded-full border border-purple-200/60 bg-purple-50/80 px-3 py-1 text-xs font-semibold text-purple-700 backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Powerful Closing CTA */}
        <motion.div
          className="relative overflow-hidden rounded-[40px] border border-purple-200/60 bg-gradient-to-br from-white via-purple-50/80 to-blue-50/60 p-12 md:p-16 shadow-[0_45px_120px_-45px_rgba(99,102,241,0.35)] text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-purple-400/30 blur-3xl" />
            <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-pink-400/25 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_transparent_65%)]" />
          </div>

          <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-white/60 px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-purple-500">
              Ready to experience
            </span>

            <motion.h3
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-slate-900"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              Premier-quality tees for design-led lifestyles.
              <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Premium Quality, Perfect Fit.
              </span>
            </motion.h3>

            <p className="max-w-3xl text-lg md:text-xl text-slate-600 leading-relaxed">
              Join over <span className="font-semibold text-purple-600">10,000</span> loyal customers who trust Skipaman for elevated craftsmanship, conscious fabrics, and concierge-level service.
            </p>

            <div className="grid w-full gap-6 sm:grid-cols-3">
              {[
                { label: 'Average Rating', value: '4.9', icon: Star },
                { label: 'Happy Customers', value: '10K+', icon: Users },
                { label: 'Satisfaction Rate', value: '99%', icon: TrendingUp },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-3xl border border-white/40 bg-white/70 px-6 py-5 text-left shadow-[0_25px_60px_-40px_rgba(79,70,229,0.35)] backdrop-blur-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30">
                        <Icon size={20} />
                      </span>
                      <div>
                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link
                  to="/shop"
                  className="group relative inline-flex items-center gap-3 rounded-full border border-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-12 py-4 text-base font-semibold uppercase tracking-[0.35em] text-white shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-[0_30px_90px_-40px_rgba(99,102,241,0.5)]"
                >
                  <span className="relative z-10">Shop Now</span>
                  <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white">
                    →
                  </span>
                  <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-white/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link
                  to="/reviews"
                  className="inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-white/70 px-12 py-4 text-base font-semibold uppercase tracking-[0.35em] text-purple-600 transition-all duration-300 hover:border-purple-300 hover:text-purple-700 hover:bg-white"
                >
                  Read More Reviews
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerReviewSection;
