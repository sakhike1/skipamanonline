import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useProductData } from '../context/ProductDataContext';
import { useAuth } from '../context/useAuth';
import type { OrderData } from '../services/paypalService';
import { supabase } from '../lib/supabase';
import { generatePublicReference } from '../utils/referenceNumbers';
import { trackPurchase } from '../lib/analytics';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { products } = useProductData();
  const { user } = useAuth();

  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(true);
  const [orderError, setOrderError] = useState<string | null>(null);
  const purchaseTracked = useRef(false);

  useEffect(() => {
    const createOrder = async () => {
      try {
        const storedOrderData = sessionStorage.getItem('pending_order_data');
        if (!storedOrderData) {
          setOrderError('Order data not found. Please contact support with your payment confirmation.');
          setIsCreatingOrder(false);
          return;
        }

        if (!supabase) {
          setOrderError('Ordering is unavailable (database not configured).');
          setIsCreatingOrder(false);
          return;
        }

        if (!user?.id) {
          setOrderError('Please sign in to complete your order. Your cart is preserved.');
          setIsCreatingOrder(false);
          return;
        }

        const orderData: OrderData = JSON.parse(storedOrderData);

        const subtotal =
          orderData.subtotal ||
          orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = orderData.shippingAmount || 0;
        const tax = 0;
        const total = orderData.amount || subtotal + shipping + tax;

        const line1 = orderData.shippingAddress.line1;
        const city = orderData.shippingAddress.city;
        const postal = orderData.shippingAddress.postal_code;
        const country = orderData.shippingAddress.country || 'South Africa';

        const { data: addressRow, error: addrErr } = await supabase
          .from('addresses')
          .insert({
            user_id: user.id,
            label: 'Checkout',
            street: line1,
            city,
            province: city,
            postal_code: postal,
            country,
            is_default: false,
          })
          .select('id')
          .single();

        if (addrErr) throw addrErr;

        const humanOrderRef = generatePublicReference('SKP');

        const { data: orderRow, error: orderErr } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            status: 'confirmed',
            total_amount: total,
            shipping_address_id: addressRow?.id ?? null,
            notes: `Paid via checkout — ${orderData.customerEmail}`,
            order_number: humanOrderRef,
            payment_status: 'paid',
          })
          .select('id, order_number')
          .single();

        if (orderErr) throw orderErr;

        const orderId = orderRow.id as string;

        for (const cartLine of cart.items) {
          const product = products.find((p) => p.id === cartLine.productId);
          const unitRand = product ? product.price / 100 : 0;
          const { error: lineErr } = await supabase.from('order_items').insert({
            order_id: orderId,
            product_id: cartLine.productId,
            quantity: cartLine.quantity,
            size: String(cartLine.size),
            colour: cartLine.color?.name ?? '',
            unit_price: unitRand,
          });
          if (lineErr) throw lineErr;
        }

        const displayRef =
          (orderRow as { order_number?: string | null })?.order_number?.trim() ||
          humanOrderRef ||
          orderId.replace(/-/g, '').slice(0, 12).toUpperCase();
        setOrderNumber(displayRef);
        setConfirmationMessage('Order confirmed! We will update you regarding delivery.');

        if (!purchaseTracked.current) {
          purchaseTracked.current = true;
          trackPurchase({
            transactionId: orderId,
            value: total,
            currency: 'ZAR',
            items: cart.items.map((line) => {
              const product = products.find((p) => p.id === line.productId);
              return {
                item_id: line.productId,
                item_name: product?.name ?? 'Product',
                price: product ? product.price / 100 : 0,
                quantity: line.quantity,
              };
            }),
          });
        }

        sessionStorage.removeItem('pending_order_data');
        clearCart();
      } catch (error) {
        console.error('Error creating order:', error);
        setOrderError(
          error instanceof Error
            ? error.message
            : 'Failed to create order. Please contact support with your payment confirmation.',
        );
      } finally {
        setIsCreatingOrder(false);
      }
    };

    void createOrder();
  }, [cart.items, products, user, clearCart]);

  if (isCreatingOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <Loader2 className="w-full h-full text-purple-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Order</h2>
          <p className="text-gray-600">Please wait while we confirm your order...</p>
        </motion.div>
      </div>
    );
  }

  if (orderError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Processing Error</h2>
          <p className="text-gray-600 mb-6">{orderError}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => navigate('/orders')} variant="outline">
              View Orders
            </Button>
            <Button onClick={() => navigate('/')} variant="primary">
              Continue Shopping
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>

        <motion.h1
          className="text-3xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Payment Successful!
        </motion.h1>

        <motion.p
          className="text-gray-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {confirmationMessage ||
            'Thank you for your purchase! Your order has been confirmed and payment processed successfully.'}
        </motion.p>

        {orderNumber && (
          <motion.div
            className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-center text-blue-800 mb-2">
              <Package size={16} className="mr-2" />
              <span className="font-medium">Order reference</span>
            </div>
            <p className="text-blue-700 text-lg font-bold">{orderNumber}</p>
          </motion.div>
        )}

        <motion.div
          className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 text-left"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center text-blue-800 mb-2">
            <Mail size={16} className="mr-2 shrink-0" />
            <span className="font-medium">Confirmation &amp; updates</span>
          </div>
          <p className="text-blue-800 text-sm leading-relaxed">
            Automated order emails are being rolled out. For now,{' '}
            <strong>save your order reference below</strong> and open{' '}
            <Link to="/orders" className="font-semibold underline underline-offset-2 hover:text-blue-900">
              Orders
            </Link>{' '}
            anytime to track status. When email sending is active for your account, confirmations will arrive at the
            address from checkout.
          </p>
        </motion.div>

        <motion.div
          className="bg-green-50 border border-green-200 rounded-md p-4 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-center text-green-800 mb-2">
            <Package size={16} className="mr-2" />
            <span className="font-medium">Order Processing</span>
          </div>
          <p className="text-green-700 text-sm">
            Your order is being prepared and will be shipped within 1-2 business days.
          </p>
        </motion.div>

        <motion.div
          className="rounded-lg border border-amber-200 bg-amber-50/90 px-4 py-3 mb-6 text-left"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <p className="text-sm text-amber-950">
            <strong>Questions or payment mismatch?</strong>{' '}
            <Link
              to="/support"
              className="font-semibold text-amber-950 underline underline-offset-2 hover:text-amber-900"
            >
              Contact support
            </Link>{' '}
            with your order reference and we’ll help straight away.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button onClick={() => navigate('/orders')} variant="outline" className="flex items-center justify-center">
            View Orders
          </Button>
          <Button onClick={() => navigate('/')} variant="primary" className="flex items-center justify-center">
            Continue Shopping
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </motion.div>

        <motion.p
          className="text-xs text-gray-500 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Keep your reference handy until you see tracking on your order. That is the source of truth while email
          automation finishes rollout.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
