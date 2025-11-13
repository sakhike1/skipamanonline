import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  CreditCard, 
  MapPin, 
  User, 
  RotateCcw, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  MessageSquare,
  Settings,
  Bell,
  FileText,
  ArrowRight,
  Plus,
  Edit,
  Eye,
  Download,
  Trash2,
  Save,
  X,
  Home,
  Building,
  Phone,
  Mail,
  Calendar,
  CreditCard as CardIcon,
  Banknote,
  Receipt,
  Shield,
  Star
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

const ClientCenter: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrders([
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          date: '2024-01-15',
          status: 'delivered',
          total: 299.99,
          items: [
            { id: '1', name: 'Premium T-Shirt', quantity: 2, price: 149.99, image: '/images/1.png' }
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
          total: 199.99,
          items: [
            { id: '2', name: 'Hoodie Black', quantity: 1, price: 199.99, image: '/images/2.png' }
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
        },
        {
          id: '3',
          orderNumber: 'ORD-2024-003',
          date: '2024-01-22',
          status: 'pending',
          total: 149.99,
          items: [
            { id: '3', name: 'Custom Design T-Shirt', quantity: 1, price: 149.99, image: '/images/3.png' }
          ],
          shippingAddress: {
            street: '789 Pine St',
            city: 'Durban',
            postalCode: '4000',
            country: 'South Africa'
          },
          paymentStatus: 'pending'
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
        },
        {
          id: '2',
          type: 'general',
          subject: 'Question about custom design',
          status: 'resolved',
          date: '2024-01-10',
          priority: 'low',
          description: 'How long does custom design take to process?',
          response: 'Custom designs typically take 3-5 business days to process before shipping.'
        }
      ]);

      setAddresses([
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
        },
        {
          id: '2',
          type: 'work',
          name: 'Work Address',
          street: '456 Business Park',
          city: 'Johannesburg',
          postalCode: '2000',
          country: 'South Africa',
          phone: '+27 11 987 6543',
          isDefault: false
        }
      ]);

      setPaymentMethods([
        {
          id: '1',
          type: 'card',
          name: 'Visa ending in 4242',
          last4: '4242',
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true
        },
        {
          id: '2',
          type: 'bank',
          name: 'Standard Bank Account',
          isDefault: false
        }
      ]);

      setIsLoading(false);
    };

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'paid': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'refunded': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle size={16} />;
      case 'shipped': return <Truck size={16} />;
      case 'processing': return <Clock size={16} />;
      case 'pending': return <AlertCircle size={16} />;
      case 'paid': return <CheckCircle size={16} />;
      case 'failed': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your client center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowRight size={20} className="rotate-180" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Client Center</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome back, <span className="font-semibold text-gray-900">{user?.firstName}</span>
              </div>
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
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
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Orders</p>
                          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                        </div>
                        <Package className="w-8 h-8 text-red-600" />
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {orders.filter(o => o.status === 'pending' || o.status === 'processing').length}
                          </p>
                        </div>
                        <Clock className="w-8 h-8 text-yellow-600" />
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Support Requests</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {supportRequests.filter(r => r.status === 'open' || r.status === 'in_progress').length}
                          </p>
                        </div>
                        <MessageSquare className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b">
                      <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                    </div>
                    <div className="divide-y">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="p-6 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Package size={20} className="text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{order.orderNumber}</p>
                                <p className="text-sm text-gray-600">{order.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span className="capitalize">{order.status}</span>
                              </span>
                              <span className="font-semibold text-gray-900">R{order.total}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-6 border-t">
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-red-600 hover:text-red-700 font-medium flex items-center space-x-2"
                      >
                        <span>View all orders</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
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
                    <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
                      <Plus size={16} />
                      <span>New Order</span>
                    </button>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    {orders.map((order) => (
                      <div key={order.id} className="border-b last:border-b-0">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                              <p className="text-sm text-gray-600">Ordered on {order.date}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span className="capitalize">{order.status}</span>
                              </span>
                              <span className="font-semibold text-gray-900">R{order.total}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Items</h4>
                              <div className="space-y-2">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                      <p className="text-xs text-gray-600">Qty: {item.quantity} × R{item.price}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                              <p className="text-sm text-gray-600">
                                {order.shippingAddress.street}<br />
                                {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                                {order.shippingAddress.country}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                                Payment: {order.paymentStatus}
                              </span>
                              {order.trackingNumber && (
                                <span className="text-sm text-gray-600">
                                  Tracking: {order.trackingNumber}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="text-gray-600 hover:text-gray-900 p-2">
                                <Eye size={16} />
                              </button>
                              <button className="text-gray-600 hover:text-gray-900 p-2">
                                <Download size={16} />
                              </button>
                              {order.paymentStatus === 'pending' && (
                                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
                                  <CreditCard size={16} />
                                  <span>Pay Now</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                    <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
                    <button 
                      onClick={() => setShowPaymentForm(true)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                    >
                      <Plus size={16} />
                      <span>Add Payment Method</span>
                    </button>
                  </div>

                  {/* Unpaid Orders */}
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
                        Unpaid Orders
                      </h3>
                      <p className="text-gray-600 mt-1">Orders that require payment to proceed</p>
                    </div>
                    <div className="p-6">
                      {orders.filter(order => order.paymentStatus === 'pending').length > 0 ? (
                        <div className="space-y-4">
                          {orders.filter(order => order.paymentStatus === 'pending').map((order) => (
                            <div key={order.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{order.orderNumber}</h4>
                                  <p className="text-sm text-gray-600">Ordered on {order.date}</p>
                                  <p className="text-lg font-bold text-red-600">R{order.total.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
                                    <CreditCard size={16} />
                                    <span>Pay Now</span>
                                  </button>
                                  <button className="text-gray-600 hover:text-gray-900 p-2">
                                    <Eye size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">All orders are paid!</h3>
                          <p className="text-gray-600">You have no outstanding payments.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                      <p className="text-gray-600 mt-1">Manage your saved payment methods</p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {paymentMethods.map((method) => (
                          <div key={method.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                  {method.type === 'card' ? <CardIcon size={20} className="text-gray-600" /> : 
                                   method.type === 'bank' ? <Building size={20} className="text-gray-600" /> :
                                   <Banknote size={20} className="text-gray-600" />}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{method.name}</h4>
                                  {method.last4 && (
                                    <p className="text-sm text-gray-600">Expires {method.expiryMonth}/{method.expiryYear}</p>
                                  )}
                                  {method.isDefault && (
                                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                                      Default
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => setEditingPayment(method)}
                                  className="text-gray-600 hover:text-gray-900 p-2"
                                >
                                  <Edit size={16} />
                                </button>
                                <button className="text-red-600 hover:text-red-700 p-2">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
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
                    <h2 className="text-2xl font-bold text-gray-900">Address Management</h2>
                    <button 
                      onClick={() => setShowAddressForm(true)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                    >
                      <Plus size={16} />
                      <span>Add Address</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                      <div key={address.id} className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            {address.type === 'home' ? <Home size={20} className="text-gray-600" /> :
                             address.type === 'work' ? <Building size={20} className="text-gray-600" /> :
                             <MapPin size={20} className="text-gray-600" />}
                            <h3 className="font-semibold text-gray-900">{address.name}</h3>
                            {address.isDefault && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => setEditingAddress(address)}
                              className="text-gray-600 hover:text-gray-900 p-2"
                            >
                              <Edit size={16} />
                            </button>
                            <button className="text-red-600 hover:text-red-700 p-2">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>{address.street}</p>
                          <p>{address.city}, {address.postalCode}</p>
                          <p>{address.country}</p>
                          <p className="flex items-center mt-2">
                            <Phone size={14} className="mr-1" />
                            {address.phone}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
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
                    <h2 className="text-2xl font-bold text-gray-900">Returns & Refunds</h2>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
                      <Plus size={16} />
                      <span>New Return Request</span>
                    </button>
                  </div>

                  {/* Return Policy */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                      <Shield size={20} className="mr-2" />
                      Return Policy
                    </h3>
                    <div className="text-sm text-blue-800 space-y-2">
                      <p>• 30-day return window from delivery date</p>
                      <p>• Items must be in original condition with tags</p>
                      <p>• Free return shipping for defective items</p>
                      <p>• Refunds processed within 5-7 business days</p>
                    </div>
                  </div>

                  {/* Return Requests */}
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold text-gray-900">Your Return Requests</h3>
                    </div>
                    <div className="p-6">
                      {supportRequests.filter(req => req.type === 'return' || req.type === 'refund').length > 0 ? (
                        <div className="space-y-4">
                          {supportRequests.filter(req => req.type === 'return' || req.type === 'refund').map((request) => (
                            <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-900">{request.subject}</h4>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  request.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                  request.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {request.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{request.description}</p>
                              {request.response && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <p className="text-sm text-gray-700">
                                    <strong>Response:</strong> {request.response}
                                  </p>
                                </div>
                              )}
                              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                                <span className="text-xs text-gray-500">Submitted on {request.date}</span>
                                <div className="flex items-center space-x-2">
                                  <button className="text-gray-600 hover:text-gray-900 p-2">
                                    <Eye size={16} />
                                  </button>
                                  <button className="text-gray-600 hover:text-gray-900 p-2">
                                    <MessageSquare size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <RotateCcw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No return requests</h3>
                          <p className="text-gray-600">You haven't submitted any return or refund requests yet.</p>
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
                    <h2 className="text-2xl font-bold text-gray-900">Support Requests</h2>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
                      <Plus size={16} />
                      <span>New Request</span>
                    </button>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    {supportRequests.map((request) => (
                      <div key={request.id} className="border-b last:border-b-0 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">{request.subject}</h3>
                            <p className="text-sm text-gray-600">Created on {request.date}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              request.priority === 'high' ? 'bg-red-100 text-red-800' :
                              request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {request.priority} priority
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              request.status === 'resolved' ? 'bg-green-100 text-green-800' :
                              request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {request.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">{request.description}</p>
                        {request.response && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Response:</h4>
                            <p className="text-gray-600">{request.response}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
                  </div>

                  {/* Account Information */}
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <User size={20} className="mr-2" />
                        Account Information
                      </h3>
                      <p className="text-gray-600 mt-1">Manage your personal account details</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            defaultValue={user?.firstName || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            defaultValue={user?.lastName || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            defaultValue={user?.email || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            placeholder="+27 21 123 4567"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
                          <Save size={16} />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Shield size={20} className="mr-2" />
                        Security Settings
                      </h3>
                      <p className="text-gray-600 mt-1">Manage your account security and password</p>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Change Password */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Change Password</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Current Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
                            <Shield size={16} />
                            <span>Update Password</span>
                          </button>
                        </div>
                      </div>

                      {/* Two-Factor Authentication */}
                      <div className="border-t pt-6">
                        <h4 className="font-medium text-gray-900 mb-4">Two-Factor Authentication</h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            Enable 2FA
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notification Preferences */}
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Bell size={20} className="mr-2" />
                        Notification Preferences
                      </h3>
                      <p className="text-gray-600 mt-1">Choose how you want to be notified</p>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Email Notifications</h4>
                          <p className="text-sm text-gray-600">Receive updates via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Order Updates</h4>
                          <p className="text-sm text-gray-600">Get notified about order status changes</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Promotional Emails</h4>
                          <p className="text-sm text-gray-600">Receive special offers and promotions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                          <p className="text-sm text-gray-600">Receive important updates via SMS</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Eye size={20} className="mr-2" />
                        Privacy Settings
                      </h3>
                      <p className="text-gray-600 mt-1">Control your privacy and data sharing preferences</p>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Profile Visibility</h4>
                          <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                        </div>
                        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                          <option value="private">Private</option>
                          <option value="public">Public</option>
                          <option value="friends">Friends Only</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Data Sharing</h4>
                          <p className="text-sm text-gray-600">Allow data sharing for improved experience</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Marketing Consent</h4>
                          <p className="text-sm text-gray-600">Receive marketing communications</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <AlertCircle size={20} className="mr-2" />
                        Account Actions
                      </h3>
                      <p className="text-gray-600 mt-1">Manage your account status and data</p>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Download Data</h4>
                          <p className="text-sm text-gray-600">Download a copy of your account data</p>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                          <Download size={16} />
                          <span>Download</span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Deactivate Account</h4>
                          <p className="text-sm text-gray-600">Temporarily deactivate your account</p>
                        </div>
                        <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                          Deactivate
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-red-600">Delete Account</h4>
                          <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                        </div>
                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                          Delete Account
                        </button>
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
