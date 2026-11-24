import { useCallback, useState } from 'react';
import { validateEmail } from '../utils/validation';
import { trackLead } from '../lib/analytics';
import { subscribeToNewsletter } from '../services/newsletter';

interface UseNewsletterReturn {
  email: string;
  setEmail: (email: string) => void;
  isSubscribing: boolean;
  handleSubscribe: (e: React.FormEvent) => Promise<void>;
  status: 'idle' | 'success' | 'error';
  message: string | null;
  resetStatus: () => void;
}

/**
 * Custom hook for newsletter subscription functionality
 * Handles email state and validation.
 */
export const useNewsletter = (
  onSuccess?: () => void,
  onError?: (error: string) => void,
  /** Passed to GA4/Meta as lead source when marketing cookies accepted */
  leadSource: string = 'newsletter',
): UseNewsletterReturn => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const resetStatus = useCallback(() => {
    setStatus('idle');
    setMessage(null);
  }, []);

  const setError = useCallback(
    (msg: string) => {
      setStatus('error');
      setMessage(msg);
      onError?.(msg);
    },
    [onError]
  );

  const setSuccess = useCallback(
    (msg: string) => {
      setStatus('success');
      setMessage(msg);
      onSuccess?.();
      trackLead(leadSource);
    },
    [onSuccess, leadSource],
  );

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubscribing) return;

    const normalizedEmail = email.trim().toLowerCase();
    // Any new submit resets previous messages
    resetStatus();

    if (!normalizedEmail) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(normalizedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);

    try {
      const result = await subscribeToNewsletter(normalizedEmail, leadSource);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      if (result.duplicate) {
        setStatus('success');
        setMessage('You’re already on the list. Thanks for staying with us.');
        setEmail('');
        return;
      }
      setSuccess('You’re subscribed. We’ll email you when new drops and offers land.');
      setEmail('');
    } catch (error: unknown) {
      console.error('Newsletter subscription error:', error);
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return {
    email,
    setEmail,
    isSubscribing,
    handleSubscribe,
    status,
    message,
    resetStatus,
  };
};

