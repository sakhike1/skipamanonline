import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Shield, Key, ArrowRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const DemoAuthPage: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const demoCredentials = [
    {
      type: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
      description: 'Create a new account with any email',
      icon: User,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      type: 'Admin User',
      email: 'admin@demo.com',
      password: 'admin123',
      description: 'Pre-created admin account for testing',
      icon: Shield,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30'
    }
  ];

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 bg-purple-500/20 rounded-full flex items-center justify-center"
            >
              <Key className="w-10 h-10 text-purple-400" />
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-4">Authentication Demo</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Test the authentication system with these demo credentials. 
              Users must sign up before they can log in, just like a real application.
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {demoCredentials.map((credential, index) => {
              const IconComponent = credential.icon;
              return (
                <motion.div
                  key={credential.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className={`${credential.bgColor} ${credential.borderColor} border rounded-xl p-6 backdrop-blur-md`}
                >
                  <div className="flex items-center mb-4">
                    <IconComponent className={`w-8 h-8 ${credential.color} mr-3`} />
                    <h3 className="text-xl font-semibold text-white">{credential.type}</h3>
                  </div>
                  
                  <p className="text-gray-300 mb-6">{credential.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={credential.email}
                          readOnly
                          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                        />
                        <button
                          onClick={() => copyToClipboard(credential.email, `${credential.type}-email`)}
                          className="ml-2 p-2 text-gray-400 hover:text-white transition-colors"
                        >
                          {copied === `${credential.type}-email` ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                      <div className="flex items-center">
                        <input
                          type="password"
                          value={credential.password}
                          readOnly
                          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                        />
                        <button
                          onClick={() => copyToClipboard(credential.password, `${credential.type}-password`)}
                          className="ml-2 p-2 text-gray-400 hover:text-white transition-colors"
                        >
                          {copied === `${credential.type}-password` ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">How to Test</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-white font-medium">For Regular Users:</p>
                  <p className="text-gray-300">Go to the registration page and create a new account with any email address. Then use those credentials to log in.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="text-white font-medium">For Admin Access:</p>
                  <p className="text-gray-300">Use the admin credentials above to log in. Admin users can access the admin dashboard to view all registered users.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="text-white font-medium">Test Authentication Flow:</p>
                  <p className="text-gray-300">Try logging in with non-existent credentials to see the error handling. The system will guide you to sign up first.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/register"
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-300"
            >
              <User className="w-5 h-5 mr-2" />
              Create New Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            
            <Link
              to="/login"
              className="flex items-center justify-center px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/20 transition-all duration-300"
            >
              <Key className="w-5 h-5 mr-2" />
              Sign In
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center mt-8"
          >
            <Link
              to="/"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              ← Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DemoAuthPage; 