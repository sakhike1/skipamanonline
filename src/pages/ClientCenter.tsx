import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  CreditCard, 
  MapPin, 
  User, 
  RotateCcw, 
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  MessageSquare,
  Settings,
  Bell,
  ArrowRight,
  Plus,
  Edit,
  Eye,
  Download,
  Trash2,
  Save,
  Home,
  Building,
  Phone,
  CreditCard as CardIcon,
  Banknote,
  Shield,
  Sparkles,
  ChevronRight,
  X,
  Check
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  estimatedDelivery?: string;
}

interface SupportRequest {
  id: string;
  type: 'return' | 'refund' | 'general' | 'complaint';
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  date: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  response?: string;
}

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  name: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface NotificationPrefs {
  emailNotifications: boolean;
  orderUpdates: boolean;
  promotionalEmails: boolean;
  smsNotifications: boolean;
}

const ClientCenter: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: 'address' | 'payment'; id: string } | null>(null);
  
  // Edit states
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
  
  // Form states
  const [addressForm, setAddressForm] = useState<Partial<Address>>({
    type: 'home',
    name: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'South Africa',
    phone: '',
    isDefault: false
  });
  
  const [paymentForm, setPaymentForm] = useState<Partial<PaymentMethod>>({
    type: 'card',
    name: '',
    last4: '',
    expiryMonth: undefined,
    expiryYear: undefined,
    isDefault: false
  });
  
  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>({
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    smsNotifications: true
  });
  
  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Saving states
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isSavingReturn, setIsSavingReturn] = useState(false);
  const [isSavingSupport, setIsSavingSupport] = useState(false);
  
  // Return request form
  const [returnForm, setReturnForm] = useState({
    orderId: '',
    reason: 'damaged' as 'damaged' | 'wrong_item' | 'not_as_described' | 'changed_mind' | 'other',
    description: '',
    refundMethod: 'original' as 'original' | 'store_credit'
  });
  
  // Support request form
  const [supportForm, setSupportForm] = useState({
    type: 'general' as 'general' | 'complaint' | 'question' | 'feedback',
    subject: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Initialize user profile from auth context
  useEffect(() => {
    if (user) {
      setUserProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: ''
      });
    }
  }, [user]);

  // Load data from localStorage or use mock data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Try to load addresses from localStorage
      const savedAddresses = localStorage.getItem('userAddresses');
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      } else {
        const defaultAddresses: Address[] = [
          {
            id: '1',
            type: 'home',
            name: 'Home Address',
            street: '123 Main Street',
            city: 'Cape Town',
            postalCode: '8001',
            country: 'South Africa',
            phone: '+27 21 123 4567',
            isDefault: true
          }
        ];
        setAddresses(defaultAddresses);
        localStorage.setItem('userAddresses', JSON.stringify(defaultAddresses));
      }
      
      // Try to load payment methods from localStorage
      const savedPayments = localStorage.getItem('userPaymentMethods');
      if (savedPayments) {
        setPaymentMethods(JSON.parse(savedPayments));
      } else {
        const defaultPayments: PaymentMethod[] = [
          {
            id: '1',
            type: 'card',
            name: 'Visa ending in 4242',
            last4: '4242',
            expiryMonth: 12,
            expiryYear: 2025,
            isDefault: true
          }
        ];
        setPaymentMethods(defaultPayments);
        localStorage.setItem('userPaymentMethods', JSON.stringify(defaultPayments));
      }
      
      // Load notification preferences
      const savedNotifPrefs = localStorage.getItem('notificationPrefs');
      if (savedNotifPrefs) {
        setNotificationPrefs(JSON.parse(savedNotifPrefs));
      }
      
      // Mock orders
      setOrders([
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          date: '2024-01-15',
          status: 'delivered',
          total: 29999,
          items: [
            { id: '1', name: 'Premium T-Shirt', quantity: 2, price: 14999, image: '/images/1.png' }
          ],
          shippingAddress: {
            street: '123 Main St',
            city: 'Cape Town',
            postalCode: '8001',
            country: 'South Africa'
          },
          paymentStatus: 'paid',
          trackingNumber: 'TRK123456789',
          estimatedDelivery: '2024-01-20'
        },
        {
          id: '2',
          orderNumber: 'ORD-2024-002',
          date: '2024-01-20',
          status: 'shipped',
          total: 19999,
          items: [
            { id: '2', name: 'Hoodie Black', quantity: 1, price: 19999, image: '/images/2.png' }
          ],
          shippingAddress: {
            street: '456 Oak Ave',
            city: 'Johannesburg',
            postalCode: '2000',
            country: 'South Africa'
          },
          paymentStatus: 'paid',
          trackingNumber: 'TRK987654321',
          estimatedDelivery: '2024-01-25'
        }
      ]);

      setSupportRequests([
        {
          id: '1',
          type: 'return',
          subject: 'Return request for Order ORD-2024-001',
          status: 'in_progress',
          date: '2024-01-18',
          priority: 'medium',
          description: 'Item arrived damaged, requesting return and refund.',
          response: 'We have received your return request. A return label has been sent to your email.'
        }
      ]);

      setIsLoading(false);
    };

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Save addresses to localStorage whenever they change
  useEffect(() => {
    if (addresses.length > 0) {
      localStorage.setItem('userAddresses', JSON.stringify(addresses));
    }
  }, [addresses]);

  // Save payment methods to localStorage whenever they change
  useEffect(() => {
    if (paymentMethods.length > 0) {
      localStorage.setItem('userPaymentMethods', JSON.stringify(paymentMethods));
    }
  }, [paymentMethods]);

  // Save notification preferences whenever they change
  useEffect(() => {
    localStorage.setItem('notificationPrefs', JSON.stringify(notificationPrefs));
  }, [notificationPrefs]);

  // Address handlers
  const handleOpenAddressModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setAddressForm(address);
    } else {
      setEditingAddress(null);
      setAddressForm({
        type: 'home',
        name: '',
        street: '',
        city: '',
        postalCode: '',
        country: 'South Africa',
        phone: '',
        isDefault: false
      });
    }
    setShowAddressModal(true);
  };

  const handleSaveAddress = async () => {
    if (!addressForm.name || !addressForm.street || !addressForm.city || !addressForm.postalCode || !addressForm.phone) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    setIsSavingAddress(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (editingAddress) {
      // Update existing address
      setAddresses(prev => prev.map(addr => {
        if (addr.id === editingAddress.id) {
          return { ...addr, ...addressForm } as Address;
        }
        // If this address is being set as default, remove default from others
        if (addressForm.isDefault && addr.id !== editingAddress.id) {
          return { ...addr, isDefault: false };
        }
        return addr;
      }));
      showToast('Address updated successfully');
    } else {
      // Add new address
      const newAddress: Address = {
        id: Date.now().toString(),
        type: addressForm.type || 'home',
        name: addressForm.name || '',
        street: addressForm.street || '',
        city: addressForm.city || '',
        postalCode: addressForm.postalCode || '',
        country: addressForm.country || 'South Africa',
        phone: addressForm.phone || '',
        isDefault: addressForm.isDefault || false
      };
      
      setAddresses(prev => {
        // If new address is default, remove default from others
        if (newAddress.isDefault) {
          return [...prev.map(addr => ({ ...addr, isDefault: false })), newAddress];
        }
        return [...prev, newAddress];
      });
      showToast('Address added successfully');
    }
    
    setIsSavingAddress(false);
    setShowAddressModal(false);
    setEditingAddress(null);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    setShowDeleteConfirm(null);
    showToast('Address deleted successfully');
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    showToast('Default address updated');
  };

  // Payment handlers
  const handleOpenPaymentModal = (payment?: PaymentMethod) => {
    if (payment) {
      setEditingPayment(payment);
      setPaymentForm(payment);
    } else {
      setEditingPayment(null);
      setPaymentForm({
        type: 'card',
        name: '',
        last4: '',
        expiryMonth: undefined,
        expiryYear: undefined,
        isDefault: false
      });
    }
    setShowPaymentModal(true);
  };

  const handleSavePayment = async () => {
    if (!paymentForm.name) {
      showToast('Please enter a name for this payment method', 'error');
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (editingPayment) {
      setPaymentMethods(prev => prev.map(pm => {
        if (pm.id === editingPayment.id) {
          return { ...pm, ...paymentForm } as PaymentMethod;
        }
        if (paymentForm.isDefault && pm.id !== editingPayment.id) {
          return { ...pm, isDefault: false };
        }
        return pm;
      }));
      showToast('Payment method updated successfully');
    } else {
      const newPayment: PaymentMethod = {
        id: Date.now().toString(),
        type: paymentForm.type || 'card',
        name: paymentForm.name || '',
        last4: paymentForm.last4,
        expiryMonth: paymentForm.expiryMonth,
        expiryYear: paymentForm.expiryYear,
        isDefault: paymentForm.isDefault || false
      };
      
      setPaymentMethods(prev => {
        if (newPayment.isDefault) {
          return [...prev.map(pm => ({ ...pm, isDefault: false })), newPayment];
        }
        return [...prev, newPayment];
      });
      showToast('Payment method added successfully');
    }
    
    setShowPaymentModal(false);
    setEditingPayment(null);
  };

  const handleDeletePayment = (id: string) => {
    setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
    setShowDeleteConfirm(null);
    showToast('Payment method deleted successfully');
  };

  // Profile handlers
  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    setIsSavingProfile(false);
    showToast('Profile updated successfully');
  };

  // Password handlers
  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showToast('Please fill in all password fields', 'error');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }
    
    setIsSavingPassword(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSavingPassword(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast('Password changed successfully');
  };

  // Notification preference handler
  const handleToggleNotification = (key: keyof NotificationPrefs) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-white bg-black';
      case 'shipped': return 'text-black bg-gray-200';
      case 'processing': return 'text-black bg-gray-300';
      case 'pending': return 'text-white bg-gray-600';
      case 'cancelled': return 'text-white bg-gray-800';
      case 'paid': return 'text-white bg-black';
      case 'failed': return 'text-white bg-gray-700';
      case 'refunded': return 'text-black bg-gray-200';
      default: return 'text-black bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle size={14} />;
      case 'shipped': return <Truck size={14} />;
      case 'processing': return <Clock size={14} />;
      case 'pending': return <AlertCircle size={14} />;
      case 'paid': return <CheckCircle size={14} />;
      case 'failed': return <AlertCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User size={20} /> },
    { id: 'orders', label: 'My Orders', icon: <Package size={20} /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard size={20} /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin size={20} /> },
    { id: 'returns', label: 'Returns & Refunds', icon: <RotateCcw size={20} /> },
    { id: 'support', label: 'Support', icon: <MessageSquare size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
  ];

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            className="w-16 h-16 border-4 border-black border-t-transparent rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600 font-medium">Loading your client center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-24 right-4 z-[200] px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 ${
              toast.type === 'success' ? 'bg-black text-white' : 'bg-red-600 text-white'
            }`}
          >
            {toast.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150]"
              onClick={() => setShowAddressModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-[151] p-4"
            >
              <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                  <h3 className="text-xl font-bold text-black">
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </h3>
                  <button 
                    onClick={() => setShowAddressModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Address Type</label>
                    <div className="flex gap-2">
                      {(['home', 'work', 'other'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setAddressForm(prev => ({ ...prev, type }))}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            addressForm.type === type
                              ? 'bg-black text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Address Name *</label>
                    <input
                      type="text"
                      value={addressForm.name || ''}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Home, Office, Mom's House"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Street Address *</label>
                    <input
                      type="text"
                      value={addressForm.street || ''}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, street: e.target.value }))}
                      placeholder="123 Main Street, Apt 4B"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">City *</label>
                      <input
                        type="text"
                        value={addressForm.city || ''}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="Cape Town"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">Postal Code *</label>
                      <input
                        type="text"
                        value={addressForm.postalCode || ''}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, postalCode: e.target.value }))}
                        placeholder="8001"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Country</label>
                    <select
                      value={addressForm.country || 'South Africa'}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    >
                      <option value="South Africa">South Africa</option>
                      <option value="Namibia">Namibia</option>
                      <option value="Botswana">Botswana</option>
                      <option value="Zimbabwe">Zimbabwe</option>
                      <option value="Mozambique">Mozambique</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={addressForm.phone || ''}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+27 21 123 4567"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={addressForm.isDefault || false}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
                      Set as default shipping address
                    </label>
                  </div>
                </div>
                <div className="p-6 border-t border-gray-100 flex gap-3">
                  <button
                    onClick={() => setShowAddressModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-200 rounded-full font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleSaveAddress}
                    disabled={isSavingAddress}
                    className="flex-1 px-6 py-3 bg-black text-white rounded-full font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSavingAddress ? (
                      <motion.div 
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <>
                        <Save size={18} />
                        {editingAddress ? 'Update Address' : 'Save Address'}
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150]"
              onClick={() => setShowPaymentModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-[151] p-4"
            >
              <div className="bg-white rounded-2xl w-full max-w-lg">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-black">
                    {editingPayment ? 'Edit Payment Method' : 'Add Payment Method'}
                  </h3>
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Payment Type</label>
                    <div className="flex gap-2">
                      {(['card', 'bank', 'paypal'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setPaymentForm(prev => ({ ...prev, type }))}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            paymentForm.type === type
                              ? 'bg-black text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {type === 'card' ? 'Card' : type === 'bank' ? 'Bank' : 'PayPal'}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Name *</label>
                    <input
                      type="text"
                      value={paymentForm.name || ''}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Visa ending in 4242"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                  </div>
                  
                  {paymentForm.type === 'card' && (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">Last 4 Digits</label>
                        <input
                          type="text"
                          value={paymentForm.last4 || ''}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, last4: e.target.value.slice(0, 4) }))}
                          placeholder="4242"
                          maxLength={4}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">Expiry Month</label>
                          <select
                            value={paymentForm.expiryMonth || ''}
                            onChange={(e) => setPaymentForm(prev => ({ ...prev, expiryMonth: parseInt(e.target.value) }))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                          >
                            <option value="">Month</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                              <option key={month} value={month}>{month.toString().padStart(2, '0')}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">Expiry Year</label>
                          <select
                            value={paymentForm.expiryYear || ''}
                            onChange={(e) => setPaymentForm(prev => ({ ...prev, expiryYear: parseInt(e.target.value) }))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                          >
                            <option value="">Year</option>
                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="isDefaultPayment"
                      checked={paymentForm.isDefault || false}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <label htmlFor="isDefaultPayment" className="text-sm font-medium text-gray-700">
                      Set as default payment method
                    </label>
                  </div>
                </div>
                <div className="p-6 border-t border-gray-100 flex gap-3">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-200 rounded-full font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleSavePayment}
                    className="flex-1 px-6 py-3 bg-black text-white rounded-full font-bold flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save size={18} />
                    {editingPayment ? 'Update' : 'Save'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150]"
              onClick={() => setShowDeleteConfirm(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-[151] p-4"
            >
              <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={32} className="text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Delete {showDeleteConfirm.type}?</h3>
                <p className="text-gray-600 mb-6">
                  This action cannot be undone. Are you sure you want to delete this {showDeleteConfirm.type}?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-6 py-3 border border-gray-200 rounded-full font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={() => {
                      if (showDeleteConfirm.type === 'address') {
                        handleDeleteAddress(showDeleteConfirm.id);
                      } else {
                        handleDeletePayment(showDeleteConfirm.id);
                      }
                    }}
                    className="flex-1 px-6 py-3 bg-black text-white rounded-full font-bold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <div className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
            animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div>
              <motion.button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                whileHover={{ x: -5 }}
              >
                <ArrowRight size={16} className="rotate-180" />
                <span className="text-sm font-medium">Back to Home</span>
              </motion.button>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full">
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-sm font-medium tracking-wider">CLIENT CENTER</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                  Welcome back, {userProfile.firstName || user?.firstName}
                </h1>
                <p className="text-gray-400 text-lg max-w-xl">
                  Manage your orders, payments, addresses, and account settings all in one place.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative">
                <motion.div
                  className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-black text-4xl font-black"
                  animate={{ 
                    boxShadow: [
                      "0 0 0 0 rgba(255,255,255,0.2)",
                      "0 0 0 20px rgba(255,255,255,0)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {(userProfile.firstName || user?.firstName)?.[0]}{(userProfile.lastName || user?.lastName)?.[0]}
                </motion.div>
                <motion.div
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles size={20} className="text-black" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
          >
            {[
              { label: 'Total Orders', value: orders.length, icon: Package },
              { label: 'Addresses', value: addresses.length, icon: MapPin },
              { label: 'Payment Methods', value: paymentMethods.length, icon: CreditCard },
              { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon size={20} className="text-gray-400" />
                  <span className="text-3xl font-black">{stat.value}</span>
                </div>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2 sticky top-24">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-xl text-left transition-all duration-300 group ${
                    activeTab === tab.id
                      ? 'bg-black text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                  </div>
                  <ChevronRight size={16} className={`transition-transform ${activeTab === tab.id ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Recent Orders */}
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-black">Recent Orders</h2>
                        <p className="text-gray-500 text-sm mt-1">Your latest order activity</p>
                      </div>
                      <motion.button
                        onClick={() => setActiveTab('orders')}
                        className="text-sm font-medium text-black flex items-center gap-2 hover:gap-3 transition-all"
                        whileHover={{ x: 3 }}
                      >
                        View All <ArrowRight size={16} />
                      </motion.button>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {orders.slice(0, 3).map((order, index) => (
                        <motion.div 
                          key={order.id} 
                          className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center">
                                <Package size={24} className="text-white" />
                              </div>
                              <div>
                                <p className="font-bold text-black">{order.orderNumber}</p>
                                <p className="text-sm text-gray-500">{order.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span className="capitalize">{order.status}</span>
                              </span>
                              <span className="font-bold text-black">R{(order.total / 100).toFixed(2)}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: 'Manage Addresses', desc: 'Add or edit addresses', icon: MapPin, action: () => setActiveTab('addresses') },
                      { title: 'Payment Methods', desc: 'Manage payment options', icon: CreditCard, action: () => setActiveTab('payments') },
                      { title: 'Get Support', desc: 'Contact our team', icon: MessageSquare, action: () => setActiveTab('support') },
                      { title: 'Settings', desc: 'Update your profile', icon: Settings, action: () => setActiveTab('settings') }
                    ].map((action, index) => (
                      <motion.button
                        key={action.title}
                        onClick={action.action}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-black hover:shadow-lg transition-all text-left group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <action.icon size={24} className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-black">{action.title}</h3>
                            <p className="text-sm text-gray-500">{action.desc}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-black">My Orders</h2>
                      <p className="text-gray-500 mt-1">Track and manage your orders</p>
                    </div>
                    <motion.button 
                      onClick={() => navigate('/shop')}
                      className="bg-black text-white px-6 py-3 rounded-full font-bold flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus size={18} />
                      Shop Now
                    </motion.button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-2xl">
                      <Package size={48} className="text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-black mb-2">No orders yet</h3>
                      <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                      <motion.button
                        onClick={() => navigate('/shop')}
                        className="bg-black text-white px-8 py-3 rounded-full font-bold"
                        whileHover={{ scale: 1.02 }}
                      >
                        Browse Products
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order, index) => (
                        <motion.div 
                          key={order.id} 
                          className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-black transition-colors"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center">
                                  <Package size={24} className="text-white" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-black text-lg">{order.orderNumber}</h3>
                                  <p className="text-sm text-gray-500">Ordered on {order.date}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                  {getStatusIcon(order.status)}
                                  <span className="capitalize">{order.status}</span>
                                </span>
                                <span className="text-xl font-black text-black">R{(order.total / 100).toFixed(2)}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                              <div>
                                <h4 className="font-bold text-black mb-3">Items</h4>
                                <div className="space-y-2">
                                  {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3">
                                      <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                                      <div>
                                        <p className="font-medium text-black">{item.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity} × R{(item.price / 100).toFixed(2)}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-bold text-black mb-3">Shipping Address</h4>
                                <div className="text-gray-600 space-y-1">
                                  <p>{order.shippingAddress.street}</p>
                                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                  <p>{order.shippingAddress.country}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-6">
                              <div className="flex items-center gap-3">
                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(order.paymentStatus)}`}>
                                  Payment: {order.paymentStatus}
                                </span>
                                {order.trackingNumber && (
                                  <span className="text-sm text-gray-500">
                                    Tracking: {order.trackingNumber}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <motion.button 
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <Eye size={18} className="text-gray-600" />
                                </motion.button>
                                <motion.button 
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <Download size={18} className="text-gray-600" />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'payments' && (
                <motion.div
                  key="payments"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-black">Payment Methods</h2>
                      <p className="text-gray-500 mt-1">Manage your saved payment options</p>
                    </div>
                    <motion.button 
                      onClick={() => handleOpenPaymentModal()}
                      className="bg-black text-white px-6 py-3 rounded-full font-bold flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus size={18} />
                      Add Payment Method
                    </motion.button>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="p-6 space-y-4">
                      {paymentMethods.length === 0 ? (
                        <div className="text-center py-12">
                          <CreditCard size={48} className="text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-bold text-black mb-2">No payment methods</h3>
                          <p className="text-gray-500 mb-6">Add a payment method to speed up checkout</p>
                          <motion.button
                            onClick={() => handleOpenPaymentModal()}
                            className="bg-black text-white px-6 py-3 rounded-full font-bold"
                            whileHover={{ scale: 1.02 }}
                          >
                            Add Payment Method
                          </motion.button>
                        </div>
                      ) : (
                        paymentMethods.map((method) => (
                          <div key={method.id} className="border border-gray-200 rounded-xl p-5 hover:border-black transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                                  {method.type === 'card' ? <CardIcon size={24} className="text-white" /> : 
                                   method.type === 'bank' ? <Building size={24} className="text-white" /> :
                                   <Banknote size={24} className="text-white" />}
                                </div>
                                <div>
                                  <h4 className="font-bold text-black">{method.name}</h4>
                                  {method.last4 && (
                                    <p className="text-sm text-gray-500">Expires {method.expiryMonth}/{method.expiryYear}</p>
                                  )}
                                  {method.isDefault && (
                                    <span className="inline-block bg-black text-white text-xs px-2 py-1 rounded-full mt-1 font-medium">
                                      Default
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <motion.button 
                                  onClick={() => handleOpenPaymentModal(method)}
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <Edit size={18} className="text-gray-600" />
                                </motion.button>
                                <motion.button 
                                  onClick={() => setShowDeleteConfirm({ type: 'payment', id: method.id })}
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <Trash2 size={18} className="text-gray-600" />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'addresses' && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-black">My Addresses</h2>
                      <p className="text-gray-500 mt-1">Manage your shipping and billing addresses</p>
                    </div>
                    <motion.button 
                      onClick={() => handleOpenAddressModal()}
                      className="bg-black text-white px-6 py-3 rounded-full font-bold flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus size={18} />
                      Add Address
                    </motion.button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-2xl">
                      <MapPin size={48} className="text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-black mb-2">No addresses saved</h3>
                      <p className="text-gray-500 mb-6">Add an address for faster checkout</p>
                      <motion.button
                        onClick={() => handleOpenAddressModal()}
                        className="bg-black text-white px-8 py-3 rounded-full font-bold"
                        whileHover={{ scale: 1.02 }}
                      >
                        Add Your First Address
                      </motion.button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.map((address, index) => (
                        <motion.div 
                          key={address.id} 
                          className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-black transition-colors"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                {address.type === 'home' ? <Home size={20} className="text-white" /> :
                                 address.type === 'work' ? <Building size={20} className="text-white" /> :
                                 <MapPin size={20} className="text-white" />}
                              </div>
                              <div>
                                <h3 className="font-bold text-black">{address.name}</h3>
                                <span className="text-xs text-gray-500 capitalize">{address.type}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {!address.isDefault && (
                                <motion.button 
                                  onClick={() => handleSetDefaultAddress(address.id)}
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-xs text-gray-500 hover:text-black"
                                  whileHover={{ scale: 1.05 }}
                                  title="Set as default"
                                >
                                  <Check size={16} />
                                </motion.button>
                              )}
                              <motion.button 
                                onClick={() => handleOpenAddressModal(address)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                                whileHover={{ scale: 1.1 }}
                              >
                                <Edit size={16} className="text-gray-600" />
                              </motion.button>
                              <motion.button 
                                onClick={() => setShowDeleteConfirm({ type: 'address', id: address.id })}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                                whileHover={{ scale: 1.1 }}
                              >
                                <Trash2 size={16} className="text-gray-600" />
                              </motion.button>
                            </div>
                          </div>
                          
                          {address.isDefault && (
                            <span className="inline-block bg-black text-white text-xs px-2 py-1 rounded-full font-medium mb-3">
                              Default
                            </span>
                          )}
                          
                          <div className="space-y-1 text-gray-600">
                            <p>{address.street}</p>
                            <p>{address.city}, {address.postalCode}</p>
                            <p>{address.country}</p>
                            <p className="flex items-center gap-2 mt-3 text-black font-medium">
                              <Phone size={14} />
                              {address.phone}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'returns' && (
                <motion.div
                  key="returns"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-black">Returns & Refunds</h2>
                      <p className="text-gray-500 mt-1">Manage your return requests</p>
                    </div>
                    <motion.button 
                      className="bg-black text-white px-6 py-3 rounded-full font-bold flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus size={18} />
                      New Return Request
                    </motion.button>
                  </div>

                  {/* Return Policy */}
                  <div className="bg-black text-white rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield size={24} />
                      <h3 className="text-lg font-bold">Return Policy</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        '30-day return window',
                        'Original condition required',
                        'Free return shipping',
                        '5-7 day refund processing'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Return Requests */}
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-lg font-bold text-black">Your Return Requests</h3>
                    </div>
                    <div className="p-6">
                      {supportRequests.filter(req => req.type === 'return' || req.type === 'refund').length > 0 ? (
                        <div className="space-y-4">
                          {supportRequests.filter(req => req.type === 'return' || req.type === 'refund').map((request) => (
                            <div key={request.id} className="border border-gray-200 rounded-xl p-5">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-bold text-black">{request.subject}</h4>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  request.status === 'resolved' ? 'bg-black text-white' :
                                  request.status === 'in_progress' ? 'bg-gray-200 text-black' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  {request.status.replace('_', ' ')}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-3">{request.description}</p>
                              {request.response && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <p className="text-sm text-gray-700">
                                    <strong>Response:</strong> {request.response}
                                  </p>
                                </div>
                              )}
                              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                <span className="text-xs text-gray-500">Submitted on {request.date}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <RotateCcw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-bold text-black mb-2">No return requests</h3>
                          <p className="text-gray-500">You haven't submitted any return requests yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'support' && (
                <motion.div
                  key="support"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-black">Support Requests</h2>
                      <p className="text-gray-500 mt-1">Get help from our support team</p>
                    </div>
                    <motion.button 
                      className="bg-black text-white px-6 py-3 rounded-full font-bold flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus size={18} />
                      New Request
                    </motion.button>
                  </div>

                  {supportRequests.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-2xl">
                      <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-black mb-2">No support requests</h3>
                      <p className="text-gray-500">Need help? Create a support request.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {supportRequests.map((request, index) => (
                        <motion.div 
                          key={request.id} 
                          className="bg-white rounded-2xl border border-gray-200 p-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-bold text-black">{request.subject}</h3>
                              <p className="text-sm text-gray-500">Created on {request.date}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                request.priority === 'high' ? 'bg-black text-white' :
                                request.priority === 'medium' ? 'bg-gray-200 text-black' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {request.priority}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                request.status === 'resolved' ? 'bg-black text-white' :
                                request.status === 'in_progress' ? 'bg-gray-200 text-black' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {request.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4">{request.description}</p>
                          {request.response && (
                            <div className="bg-gray-50 p-4 rounded-xl">
                              <h4 className="font-bold text-black mb-2">Response:</h4>
                              <p className="text-gray-600">{request.response}</p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-black">Account Settings</h2>
                    <p className="text-gray-500 mt-1">Manage your account preferences</p>
                  </div>

                  {/* Account Information */}
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                      <h3 className="text-lg font-bold text-black flex items-center gap-2">
                        <User size={20} />
                        Account Information
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">First Name</label>
                          <input
                            type="text"
                            value={userProfile.firstName}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, firstName: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">Last Name</label>
                          <input
                            type="text"
                            value={userProfile.lastName}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, lastName: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">Email Address</label>
                          <input
                            type="email"
                            value={userProfile.email}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={userProfile.phone}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+27 21 123 4567"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <motion.button 
                          onClick={handleSaveProfile}
                          disabled={isSavingProfile}
                          className="bg-black text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 disabled:opacity-50"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isSavingProfile ? (
                            <motion.div 
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                          ) : (
                            <>
                              <Save size={18} />
                              Save Changes
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                      <h3 className="text-lg font-bold text-black flex items-center gap-2">
                        <Shield size={20} />
                        Change Password
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">Current Password</label>
                          <input
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">New Password</label>
                          <input
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                          />
                        </div>
                        <motion.button 
                          onClick={handleChangePassword}
                          disabled={isSavingPassword}
                          className="bg-black text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 disabled:opacity-50"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isSavingPassword ? (
                            <motion.div 
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                          ) : (
                            <>
                              <Shield size={18} />
                              Update Password
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Notification Preferences */}
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                      <h3 className="text-lg font-bold text-black flex items-center gap-2">
                        <Bell size={20} />
                        Notification Preferences
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      {[
                        { key: 'emailNotifications' as const, title: 'Email Notifications', desc: 'Receive updates via email' },
                        { key: 'orderUpdates' as const, title: 'Order Updates', desc: 'Get notified about order status changes' },
                        { key: 'promotionalEmails' as const, title: 'Promotional Emails', desc: 'Receive special offers and promotions' },
                        { key: 'smsNotifications' as const, title: 'SMS Notifications', desc: 'Receive important updates via SMS' }
                      ].map((pref) => (
                        <div key={pref.key} className="flex items-center justify-between py-2">
                          <div>
                            <h4 className="font-bold text-black">{pref.title}</h4>
                            <p className="text-sm text-gray-500">{pref.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={notificationPrefs[pref.key]} 
                              onChange={() => handleToggleNotification(pref.key)}
                              className="sr-only peer" 
                            />
                            <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                      <h3 className="text-lg font-bold text-black flex items-center gap-2">
                        <AlertCircle size={20} />
                        Danger Zone
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <h4 className="font-bold text-black">Deactivate Account</h4>
                          <p className="text-sm text-gray-500">Temporarily deactivate your account</p>
                        </div>
                        <motion.button 
                          className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-full font-bold hover:border-black hover:text-black transition-colors"
                          whileHover={{ scale: 1.02 }}
                        >
                          Deactivate
                        </motion.button>
                      </div>
                      <div className="flex items-center justify-between py-2 border-t border-gray-100 pt-4">
                        <div>
                          <h4 className="font-bold text-black">Delete Account</h4>
                          <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                        </div>
                        <motion.button 
                          className="px-6 py-2 bg-black text-white rounded-full font-bold"
                          whileHover={{ scale: 1.02 }}
                        >
                          Delete Account
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCenter;
