import { useState } from 'react';
import { validateEmail } from '../utils/validation';

interface UseNewsletterReturn {
  email: string;
  setEmail: (email: string) => void;
  isSubscribing: boolean;
  handleSubscribe: (e: React.FormEvent) => Promise<void>;
}

/**
 * Custom hook for newsletter subscription functionality
 * Handles email state, validation, and subscription logic
 */
export const useNewsletter = (onSuccess?: () => void, onError?: (error: string) => void): UseNewsletterReturn => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      onError?.('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      onError?.('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      onSuccess?.();
      setEmail('');
    } catch (error) {
      onError?.('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return {
    email,
    setEmail,
    isSubscribing,
    handleSubscribe,
  };
};

