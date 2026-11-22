import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Lock } from 'lucide-react';
import type { OrderData } from '../../services/paypalService';
import { capturePayPalOrder, createPayPalOrder } from '../../services/paypalApi';

type Props = {
  orderData: OrderData;
  onPaymentStart: () => void;
  onPaymentComplete: (success: boolean) => void;
  onPaid: () => void;
};

export default function PayPalSmartButtons({ orderData, onPaymentStart, onPaymentComplete, onPaid }: Props) {
  const [error, setError] = useState<string | null>(null);

  const clientId = (import.meta.env.VITE_PAYPAL_CLIENT_ID as string | undefined)?.trim();
  const currency = orderData.currency || (import.meta.env.VITE_PAYPAL_CURRENCY as string | undefined) || 'ZAR';
  const disableFundingRaw = (import.meta.env.VITE_PAYPAL_DISABLE_FUNDING as string | undefined)?.trim();
  const disableFunding = useMemo(
    () =>
      disableFundingRaw
        ? disableFundingRaw.split(',').map((s) => s.trim()).filter(Boolean)
        : undefined,
    [disableFundingRaw]
  );

  const options = useMemo(
    () => ({
      clientId: clientId || 'test',
      currency,
      intent: 'capture' as const,
      ...(disableFunding?.length ? { disableFunding } : {}),
    }),
    [clientId, currency, disableFunding]
  );

  if (!clientId) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
          <p className="text-red-800">
            PayPal is not configured. Set <span className="font-semibold">VITE_PAYPAL_CLIENT_ID</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4"
        >
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <p className="text-red-800">{error}</p>
          </div>
        </motion.div>
      )}

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Lock className="w-4 h-4" />
        <span>Secure checkout powered by PayPal</span>
      </div>

      <PayPalScriptProvider options={options}>
        <PayPalButtons
          style={{ layout: 'vertical', shape: 'rect', label: 'paypal' }}
          forceReRender={[currency]}
          createOrder={async () => {
            try {
              setError(null);
              onPaymentStart();
              sessionStorage.setItem('pending_order_data', JSON.stringify(orderData));
              return await createPayPalOrder(orderData);
            } catch (e) {
              const message = e instanceof Error ? e.message : 'Failed to create PayPal order';
              setError(message);
              onPaymentComplete(false);
              throw e;
            }
          }}
          onApprove={async (data) => {
            try {
              setError(null);
              const orderID = data.orderID;
              if (!orderID) throw new Error('Missing PayPal order ID');
              await capturePayPalOrder(orderID);
              onPaymentComplete(true);
              onPaid();
            } catch (e) {
              const message = e instanceof Error ? e.message : 'Payment capture failed';
              setError(message);
              onPaymentComplete(false);
            }
          }}
          onCancel={() => {
            onPaymentComplete(false);
            setError('Payment was cancelled. Please try again.');
          }}
          onError={(err) => {
            onPaymentComplete(false);
            setError(err instanceof Error ? err.message : 'PayPal checkout error');
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}

