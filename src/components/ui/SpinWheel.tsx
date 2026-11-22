import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Percent, Smile, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';

interface SpinWheelProps {
  onClose: () => void;
}

type Prize = {
  id: string;
  label: string;
  color: string;
  icon: React.ReactNode;
  probability: number; // 0-100, higher = more likely
};

const PRIZES: Prize[] = [
  {
    id: 'sorry',
    label: 'Sorry, Better Luck Next Time!',
    color: 'from-gray-600 to-gray-800',
    icon: <Smile className="w-8 h-8" />,
    probability: 75, // 75% chance - they always lose
  },
  {
    id: 'discount',
    label: '50% OFF',
    color: 'from-blue-500 to-blue-700',
    icon: <Percent className="w-8 h-8" />,
    probability: 20, // 20% chance
  },
  {
    id: 'free',
    label: 'Free T-Shirt!',
    color: 'from-yellow-400 via-yellow-500 to-yellow-600',
    icon: <Gift className="w-8 h-8" />,
    probability: 5, // 5% chance - very rare
  },
];

const SpinWheel: React.FC<SpinWheelProps> = ({ onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Prize | null>(null);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Weighted random selection - always favors "sorry"
  // If user is authenticated, they always lose (100% chance of "sorry")
  const selectPrize = (): Prize => {
    // Authenticated users always lose
    if (user) {
      return PRIZES[0]; // Always return "Sorry, Better Luck Next Time!"
    }
    
    // Non-authenticated users get weighted selection (for display purposes)
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const prize of PRIZES) {
      cumulative += prize.probability;
      if (random <= cumulative) {
        return prize;
      }
    }
    
    // Fallback to sorry (shouldn't happen, but safety)
    return PRIZES[0];
  };

  const handleSpin = () => {
    if (isSpinning) return;

    // Check if user is logged in
    if (!user) {
      setShowSignupPrompt(true);
      return;
    }

    setIsSpinning(true);
    setResult(null);

    // Select the prize (weighted)
    const selectedPrize = selectPrize();
    
    // Calculate rotation (multiple full spins + prize position)
    const prizeIndex = PRIZES.findIndex(p => p.id === selectedPrize.id);
    const prizeAngle = (360 / PRIZES.length) * prizeIndex;
    const baseRotation = 360 * 5; // 5 full spins for drama
    const finalRotation = baseRotation + (360 - prizeAngle) + 180 / PRIZES.length; // Center on prize
    
    setRotation(prev => prev + finalRotation);

    // Show result after spin completes
    setTimeout(() => {
      setResult(selectedPrize);
      setIsSpinning(false);
      
      // Mark as spun in localStorage
      localStorage.setItem(`spin_wheel_${user.id}`, 'true');
    }, 4000);
  };

  const handleSignup = () => {
    navigate('/register');
    onClose();
  };

  const handleLogin = () => {
    navigate('/login');
    onClose();
  };

  // Check if authenticated user has already spun
  useEffect(() => {
    if (user && localStorage.getItem(`spin_wheel_${user.id}`)) {
      // Already spun, close automatically after a moment
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, onClose]);

  const prizeAngle = 360 / PRIZES.length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="relative w-full max-w-md mx-4"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 z-10 w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Main Card - Casino Style */}
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl border-4 border-yellow-500/40 shadow-[0_0_50px_rgba(234,179,8,0.3),inset_0_0_30px_rgba(0,0,0,0.5)] overflow-hidden relative">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-yellow-500/10 pointer-events-none"></div>
            {/* Inner border highlight */}
            <div className="absolute inset-1 rounded-3xl border border-yellow-400/20 pointer-events-none"></div>
            {/* Gold Header */}
            <div className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 p-4 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%)] bg-[length:30px_30px] animate-pulse"></div>
              <motion.h2
                className="text-2xl md:text-3xl font-black text-black relative z-10"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎰 SPIN TO WIN 🎰
              </motion.h2>
              <p className="text-black/80 font-semibold mt-1 text-sm relative z-10">
                {user ? 'Spin the wheel for your chance to win!' : 'Sign up first to spin and win amazing prizes!'}
              </p>
            </div>

            {/* Wheel Container */}
            <div className="p-6 md:p-8 bg-gradient-to-b from-gray-900 via-black to-gray-900 relative">
              {/* Casino-style decorative lights */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  className="absolute top-2 left-2 w-3 h-3 bg-yellow-400 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div
                  className="absolute bottom-2 left-2 w-3 h-3 bg-yellow-400 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                />
                <motion.div
                  className="absolute bottom-2 right-2 w-3 h-3 bg-yellow-400 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 1.5 }}
                />
              </div>

              <div className="relative mx-auto" style={{ width: '320px', height: '320px' }}>
                {/* Rotating light effects */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 left-1/2 w-1 h-4 bg-yellow-400 transform -translate-x-1/2 origin-bottom"
                      style={{ transform: `translateX(-50%) rotate(${i * 45}deg)` }}
                    >
                      <div className="w-full h-full bg-gradient-to-b from-yellow-400 to-transparent shadow-[0_0_8px_rgba(234,179,8,0.8)]"></div>
                    </div>
                  ))}
                </motion.div>

                {/* Outer decorative ring */}
                <div className="absolute inset-0 rounded-full border-4 border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.5)]"></div>
                <div className="absolute inset-2 rounded-full border-2 border-yellow-400/20"></div>
                {/* Inner glow ring */}
                <div className="absolute inset-4 rounded-full border border-yellow-500/10 shadow-[inset_0_0_20px_rgba(234,179,8,0.2)]"></div>
                
                {/* Wheel */}
                <div className="relative w-full h-full">
                  <motion.div
                    ref={wheelRef}
                    className="relative w-full h-full rounded-full border-4 border-yellow-500 overflow-hidden"
                    animate={{ 
                      rotate: rotation,
                      boxShadow: [
                        '0 0 40px rgba(234,179,8,0.6), inset 0 0 20px rgba(0,0,0,0.5)',
                        '0 0 50px rgba(234,179,8,0.8), inset 0 0 20px rgba(0,0,0,0.5)',
                        '0 0 40px rgba(234,179,8,0.6), inset 0 0 20px rgba(0,0,0,0.5)',
                      ]
                    }}
                    transition={{
                      rotate: {
                        type: 'spring',
                        stiffness: 50,
                        damping: 15,
                        duration: 4,
                      },
                      boxShadow: {
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }
                    }}
                    style={{ 
                      transformOrigin: 'center',
                      background: `conic-gradient(
                        from 0deg,
                        #111827 0deg 2deg,
                        #1f2937 2deg 58deg,
                        #374151 58deg 118deg,
                        #1f2937 118deg 120deg,
                        #1e3a8a 120deg 122deg,
                        #1e40af 122deg 178deg,
                        #2563eb 178deg 238deg,
                        #1e40af 238deg 240deg,
                        #d97706 240deg 242deg,
                        #f59e0b 242deg 298deg,
                        #fbbf24 298deg 358deg,
                        #d97706 358deg 360deg
                      )`,
                      boxShadow: 'inset 0 0 60px rgba(0,0,0,0.6), 0 0 40px rgba(234,179,8,0.5), inset 0 0 20px rgba(255,255,255,0.1)'
                    }}
                  >
                    {/* Segment dividers - Casino style */}
                    {PRIZES.map((_, index) => {
                      const angle = index * 120;
                      return (
                        <div
                          key={`divider-${index}`}
                          className="absolute inset-0"
                          style={{
                            transform: `rotate(${angle}deg)`,
                            transformOrigin: 'center',
                          }}
                        >
                          {/* Thick divider line */}
                          <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-white/60 via-white/40 to-transparent transform -translate-x-1/2 shadow-[0_0_4px_rgba(255,255,255,0.5)]"></div>
                          {/* Outer highlight */}
                          <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-white/80 transform -translate-x-1/2"></div>
                        </div>
                      );
                    })}

                    {/* Prize Labels with better styling */}
                    {PRIZES.map((prize, index) => {
                      const angle = (index * 120 + 60) * (Math.PI / 180);
                      const radius = 110;
                      const x = 50 + Math.cos(angle) * (radius / 3.2);
                      const y = 50 + Math.sin(angle) * (radius / 3.2);

                      return (
                        <div
                          key={prize.id}
                          className="absolute flex flex-col items-center justify-center"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: 'translate(-50%, -50%)',
                            transformOrigin: 'center',
                          }}
                        >
                          <div className="mb-1 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] scale-90 filter brightness-110">
                            {prize.icon}
                          </div>
                          <div className="text-[9px] font-black text-center leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] uppercase tracking-wide">
                            {prize.label.split(' ').slice(0, 2).map((word, i) => (
                              <div key={i} className="whitespace-nowrap">{word}</div>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    {/* Metallic center hub */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="relative">
                        {/* Outer ring */}
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-300 via-gray-100 to-gray-300 rounded-full border-4 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.8),inset_0_0_10px_rgba(0,0,0,0.3)] flex items-center justify-center z-10">
                          {/* Inner circle */}
                          <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 rounded-full border-2 border-yellow-600 shadow-inner flex items-center justify-center">
                            <span className="text-xs font-black text-black drop-shadow-sm">SPIN</span>
                          </div>
                        </div>
                        {/* Center glow */}
                        <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-xl animate-pulse"></div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Enhanced Casino Pointer */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
                    <div className="relative">
                      {/* Pointer shadow */}
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[18px] border-r-[18px] border-t-[25px] border-l-transparent border-r-transparent border-t-black/30 blur-sm"></div>
                      {/* Main pointer */}
                      <div className="relative w-0 h-0 border-l-[20px] border-r-[20px] border-t-[35px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
                        {/* Pointer highlight */}
                        <div className="absolute -top-[35px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-yellow-200"></div>
                      </div>
                      {/* Pointer glow */}
                      <div className="absolute -top-[35px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[22px] border-r-[22px] border-t-[37px] border-l-transparent border-r-transparent border-t-yellow-500/20 blur-md"></div>
                    </div>
                  </div>

                  {/* Decorative outer elements */}
                  <div className="absolute -inset-4 rounded-full border-2 border-yellow-500/20 pointer-events-none"></div>
                </div>
              </div>

              {/* Enhanced Casino Spin Button */}
              <div className="mt-6 text-center">
                <motion.button
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className="px-10 py-4 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-black font-black text-lg rounded-full shadow-[0_0_30px_rgba(234,179,8,0.6),inset_0_2px_4px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden border-2 border-yellow-600/50 uppercase tracking-wider"
                  whileHover={{ scale: isSpinning ? 1 : 1.08, boxShadow: '0 0 40px rgba(234,179,8,0.8)' }}
                  whileTap={{ scale: isSpinning ? 1 : 0.95 }}
                >
                  {/* Animated shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                      repeatDelay: 1,
                    }}
                  />
                  {/* Button glow */}
                  <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSpinning ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        <span>SPINNING...</span>
                      </>
                    ) : (
                      <>
                        <span>🎰</span>
                        <span>SPIN THE WHEEL!</span>
                        <span>🎰</span>
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Result Modal */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md"
                onClick={() => {
                  setTimeout(() => onClose(), 2000);
                }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className={`bg-gradient-to-br ${result.color} p-12 rounded-3xl border-4 border-white shadow-2xl text-center max-w-md mx-4`}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 flex justify-center"
                  >
                    {result.icon}
                  </motion.div>
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                    {result.label}
                  </h3>
                  {result.id === 'sorry' && (
                    <p className="text-white/80 text-lg">
                      Don't worry, you can try again next time! 🎯
                    </p>
                  )}
                  {result.id === 'discount' && (
                    <p className="text-white/80 text-lg">
                      Use code: <span className="font-black">SPIN50</span> at checkout!
                    </p>
                  )}
                  {result.id === 'free' && (
                    <p className="text-white/80 text-lg">
                      Congratulations! Check your email for details! 🎉
                    </p>
                  )}
                  <p className="text-white/60 text-sm mt-4">
                    Click anywhere to close
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login/Signup Prompt Modal */}
          <AnimatePresence>
            {showSignupPrompt && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md z-50"
                onClick={() => setShowSignupPrompt(false)}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className="bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-600 p-8 rounded-3xl border-4 border-white shadow-2xl text-center max-w-md mx-4 relative overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%)] bg-[length:20px_20px] opacity-50"></div>
                  
                  <div className="relative z-10">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="mb-6 flex justify-center"
                    >
                      <UserPlus className="w-16 h-16 text-black drop-shadow-lg" />
                    </motion.div>
                    <h3 className="text-3xl md:text-4xl font-black text-black mb-3 drop-shadow-lg">
                      Login or Sign Up!
                    </h3>
                    <p className="text-black/90 text-lg mb-2 font-semibold">
                      🎰 Spin the Wheel & Win Prizes! 🎰
                    </p>
                    <p className="text-black/70 text-base mb-8">
                      Create an account or login to spin and win amazing rewards!
                    </p>
                    <div className="flex flex-col gap-3">
                      <motion.button
                        onClick={handleSignup}
                        className="w-full px-8 py-4 bg-black text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all text-lg uppercase tracking-wide relative overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <UserPlus className="w-5 h-5" />
                          Sign Up Free
                        </span>
                      </motion.button>
                      <motion.button
                        onClick={handleLogin}
                        className="w-full px-8 py-4 bg-white/90 text-black font-bold rounded-full border-2 border-black shadow-lg hover:bg-white transition-all text-lg uppercase tracking-wide relative overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.5 }}
                        />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <LogIn className="w-5 h-5" />
                          Already have an account? Login
                        </span>
                      </motion.button>
                      <motion.button
                        onClick={() => setShowSignupPrompt(false)}
                        className="px-6 py-2 text-black/70 font-medium text-sm hover:text-black transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Maybe Later
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SpinWheel;

