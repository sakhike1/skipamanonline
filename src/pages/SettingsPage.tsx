import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Package, 
  MapPin, 
  Settings as SettingsIcon, 
  Edit, 
  Trash2, 
  Plus,
  Calendar,
  DollarSign,
  Truck,
  Phone,
  Bell,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { useOrders } from '../context/OrderContext';
import { Order, Address } from '../types';

type TabType = 'profile' | 'orders' | 'addresses' | 'preferences';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { profile, getProfile, updateProfile, addAddress, updateAddress, removeAddress, setDefaultAddress } = useProfile();
  const { orders, getOrders, getOrderStatusText, getOrderStatusColor, getPaymentStatusText, getPaymentStatusColor } = useOrders();
  
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [loading, setLoading] = useState(true);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'shipped' | 'delivered' | 'cancelled'>('all');

  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: 'prefer_not_to_say' as 'male' | 'female' | 'other' | 'prefer_not_to_say'
  });

  const [addressForm, setAddressForm] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: ''
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          getProfile(),
          getOrders()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [getProfile, getOrders]);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth || '',
        gender: (profile.gender || 'prefer_not_to_say') as 'male' | 'female' | 'other' | 'prefer_not_to_say'
      });
    }
  }, [profile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAddress(addressForm);
      setShowAddAddress(false);
      setAddressForm({
        firstName: '',
        lastName: '',
        company: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        phone: ''
      });
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (orderFilter === 'all') return true;
    return order.status === orderFilter;
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center"
            >
              <SettingsIcon className="w-8 h-8 text-purple-400" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
            <p className="text-gray-400">Manage your profile, orders, and preferences</p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <User className="mr-2" />
                    Personal Information
                  </h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={profileForm.dateOfBirth}
                          onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                      >
                        Update Profile
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  {/* Order Filter */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex flex-wrap gap-2">
                      {(['all', 'pending', 'shipped', 'delivered', 'cancelled'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setOrderFilter(filter)}
                          className={`px-3 py-1 rounded-md text-sm transition-colors ${
                            orderFilter === filter
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orders List */}
                  <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                      <div className="bg-gray-800 rounded-lg p-8 text-center">
                        <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-300 mb-2">No orders found</h3>
                        <p className="text-gray-500">You haven't placed any orders yet.</p>
                      </div>
                    ) : (
                      filteredOrders.map((order) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-800 rounded-lg p-6"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-2">
                                <h3 className="text-lg font-semibold text-white">
                                  Order #{order.id.slice(-8)}
                                </h3>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(
                                    order.status
                                  )}`}
                                >
                                  {getOrderStatusText(order.status)}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                                    order.paymentStatus
                                  )}`}
                                >
                                  {getPaymentStatusText(order.paymentStatus)}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  ${order.total.toFixed(2)}
                                </div>
                                <div className="flex items-center">
                                  <Package className="w-4 h-4 mr-1" />
                                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-3 mb-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center gap-4 p-3 bg-gray-700 rounded-md">
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="w-12 h-12 object-cover rounded-md"
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium text-white">{item.productName}</h4>
                                  <p className="text-sm text-gray-400">
                                    Size: {item.size} | Color: {item.color.name} | Qty: {item.quantity}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-white">${item.total.toFixed(2)}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Order Summary */}
                          <div className="border-t border-gray-700 pt-4">
                            <div className="flex justify-between items-center">
                              <div className="text-sm text-gray-400">
                                <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
                                <p>Tax: ${order.tax.toFixed(2)}</p>
                                <p>Shipping: ${order.shipping.toFixed(2)}</p>
                                {order.discount > 0 && (
                                  <p className="text-green-400">Discount: -${order.discount.toFixed(2)}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold text-white">Total: ${order.total.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Tracking Info */}
                          {order.trackingNumber && (
                            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                              <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-blue-400">
                                  Tracking: {order.trackingNumber}
                                </span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <MapPin className="mr-2" />
                      Addresses
                    </h2>
                    <button
                      onClick={() => setShowAddAddress(true)}
                      className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Address
                    </button>
                  </div>

                  {/* Add Address Form */}
                  {showAddAddress && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-gray-800 rounded-lg p-6"
                    >
                      <h3 className="text-lg font-semibold text-white mb-4">Add New Address</h3>
                      <form onSubmit={handleAddressSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              First Name
                            </label>
                            <input
                              type="text"
                              value={addressForm.firstName}
                              onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Last Name
                            </label>
                            <input
                              type="text"
                              value={addressForm.lastName}
                              onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Address Line 1
                          </label>
                          <input
                            type="text"
                            value={addressForm.address1}
                            onChange={(e) => setAddressForm({ ...addressForm, address1: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              value={addressForm.city}
                              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              State
                            </label>
                            <input
                              type="text"
                              value={addressForm.state}
                              onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Postal Code
                            </label>
                            <input
                              type="text"
                              value={addressForm.postalCode}
                              onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                          >
                            Add Address
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddAddress(false)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* Addresses List */}
                  <div className="space-y-4">
                    {profile?.addresses.length === 0 ? (
                      <div className="bg-gray-800 rounded-lg p-8 text-center">
                        <MapPin className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-300 mb-2">No addresses saved</h3>
                        <p className="text-gray-500">Add your first address to get started.</p>
                      </div>
                    ) : (
                      profile?.addresses.map((address) => (
                        <motion.div
                          key={address.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-800 rounded-lg p-6"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-white">
                                  {address.firstName} {address.lastName}
                                </h3>
                                {address.isDefault && (
                                  <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="text-gray-400 space-y-1">
                                <p>{address.address1}</p>
                                <p>{address.city}, {address.state} {address.postalCode}</p>
                                <p>{address.country}</p>
                                <p className="flex items-center">
                                  <Phone className="w-4 h-4 mr-1" />
                                  {address.phone}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setDefaultAddress(address.id!)}
                                className="p-2 text-green-400 hover:bg-green-500/10 rounded-md transition-colors"
                                title="Set as default"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeAddress(address.id!)}
                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                                title="Delete address"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <SettingsIcon className="mr-2" />
                    Preferences
                  </h2>
                  <div className="space-y-6">
                    {/* Email Notifications */}
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <Bell className="mr-2" />
                        Email Notifications
                      </h3>
                      <div className="space-y-3">
                        {profile?.preferences && Object.entries(profile.preferences.emailNotifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </p>
                              <p className="text-sm text-gray-400">
                                Receive notifications about {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                const updatedPrefs = {
                                  ...profile.preferences,
                                  emailNotifications: {
                                    ...profile.preferences.emailNotifications,
                                    [key]: !value
                                  }
                                };
                                updateProfile({ preferences: updatedPrefs });
                              }}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                value ? 'bg-purple-500' : 'bg-gray-600'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  value ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Language and Currency */}
                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <Globe className="mr-2" />
                        Language & Currency
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Language
                          </label>
                          <select
                            value={profile?.preferences.language || 'en'}
                            onChange={(e) => {
                              const updatedPrefs = {
                                ...profile!.preferences,
                                language: e.target.value
                              };
                              updateProfile({ preferences: updatedPrefs });
                            }}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Currency
                          </label>
                          <select
                            value={profile?.preferences.currency || 'USD'}
                            onChange={(e) => {
                              const updatedPrefs = {
                                ...profile!.preferences,
                                currency: e.target.value
                              };
                              updateProfile({ preferences: updatedPrefs });
                            }}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="CAD">CAD (C$)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage; 