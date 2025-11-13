import React, { useState } from 'react';
import { usePoints } from '../../context/PointsContext';
import { Gift, Truck, Package, CheckCircle, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PointsRedemptionProps {
  isOpen: boolean;
  onClose: () => void;
  onRedemptionSuccess?: (type: 'free_delivery' | 'free_item', value: number) => void;
}

const PointsRedemption: React.FC<PointsRedemptionProps> = ({ 
  isOpen, 
  onClose, 
  onRedemptionSuccess 
}) => {
  const { 
    totalPoints, 
    redeemPoints, 
    canRedeem, 
    getRedemptionOptions 
  } = usePoints();
  
  const [selectedRedemption, setSelectedRedemption] = useState<'free_delivery' | 'free_item' | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemedSuccessfully, setRedeemedSuccessfully] = useState(false);

  const redemptionOptions = getRedemptionOptions();

  const handleRedeem = async (type: 'free_delivery' | 'free_item') => {
    if (!canRedeem(type)) return;

    setIsRedeeming(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const option = redemptionOptions.find(opt => opt.type === type);
    if (option) {
      const success = redeemPoints(type, option.value, option.description);
      
      if (success) {
        setRedeemedSuccessfully(true);
        
        // Notify parent component
        if (onRedemptionSuccess) {
          onRedemptionSuccess(type, option.value);
        }
        
        // Auto close after success
        setTimeout(() => {
          onClose();
          setRedeemedSuccessfully(false);
          setSelectedRedemption(null);
        }, 2000);
      }
    }
    
    setIsRedeeming(false);
  };

  const handleClose = () => {
    setSelectedRedemption(null);
    setRedeemedSuccessfully(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Redeem Points</h2>
                <p className="text-red-100">You have {totalPoints} points available</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-red-500 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {redeemedSuccessfully ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Redemption Successful!</h3>
                <p className="text-gray-600">
                  Your {selectedRedemption === 'free_delivery' ? 'free delivery' : 'free item'} has been applied.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Gift className="w-8 h-8 text-yellow-900" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Choose Your Reward
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Use 200 points to get amazing rewards
                  </p>
                </div>

                {/* Redemption Options */}
                <div className="space-y-3">
                  {redemptionOptions.map((option) => {
                    const isDisabled = !canRedeem(option.type);
                    const isSelected = selectedRedemption === option.type;
                    
                    return (
                      <motion.div
                        key={option.type}
                        whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                        className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-red-500 bg-red-50'
                            : isDisabled
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                            : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                        }`}
                        onClick={() => !isDisabled && setSelectedRedemption(option.type)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isSelected ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {option.type === 'free_delivery' ? (
                                <Truck size={20} />
                              ) : (
                                <Package size={20} />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{option.description}</h4>
                              <p className="text-sm text-gray-600">
                                Value: R{option.value}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${
                              isDisabled ? 'text-gray-400' : 'text-red-600'
                            }`}>
                              {option.cost} pts
                            </div>
                            {isSelected && (
                              <div className="text-xs text-red-600 font-medium">Selected</div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Insufficient Points Warning */}
                {totalPoints < 200 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-yellow-800">Insufficient Points</h4>
                        <p className="text-sm text-yellow-700">
                          You need 200 points to redeem rewards. Write reviews and earn more points!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Redeem Button */}
                <div className="pt-4">
                  <button
                    onClick={() => selectedRedemption && handleRedeem(selectedRedemption)}
                    disabled={!selectedRedemption || !canRedeem(selectedRedemption) || isRedeeming}
                    className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isRedeeming ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Gift className="w-5 h-5" />
                        Redeem {selectedRedemption === 'free_delivery' ? 'Free Delivery' : 'Free Item'}
                      </>
                    )}
                  </button>
                </div>

                {/* Points Balance */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Current Balance: <span className="font-bold text-red-600">{totalPoints} points</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Earn points by writing reviews with photos
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PointsRedemption;
