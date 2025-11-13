import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Filter,
  Search,
  Eye,
  Reply,
  Archive,
  Star,
  Phone,
  Mail,
  Calendar,
  User,
  MapPin,
  CreditCard,
  Truck,
  RotateCcw,
  DollarSign,
  FileText,
  Bell,
  Settings,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  status: 'active' | 'inactive' | 'vip';
  location: string;
  avatar?: string;
}

interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  type: 'order_issue' | 'return_request' | 'refund_request' | 'general_inquiry' | 'complaint' | 'technical_support';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  subject: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  response?: string;
  orderId?: string;
  tags: string[];
}

interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  issues: string[];
}

const CSMDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCustomers([
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@email.com',
          phone: '+27 82 123 4567',
          joinDate: '2023-01-15',
          totalOrders: 12,
          totalSpent: 3599.88,
          lastOrderDate: '2024-01-20',
          status: 'vip',
          location: 'Cape Town, South Africa'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.j@email.com',
          phone: '+27 83 987 6543',
          joinDate: '2023-06-10',
          totalOrders: 8,
          totalSpent: 2199.92,
          lastOrderDate: '2024-01-18',
          status: 'active',
          location: 'Johannesburg, South Africa'
        },
        {
          id: '3',
          name: 'Mike Wilson',
          email: 'mike.wilson@email.com',
          joinDate: '2023-11-05',
          totalOrders: 3,
          totalSpent: 599.97,
          lastOrderDate: '2023-12-15',
          status: 'inactive',
          location: 'Durban, South Africa'
        }
      ]);

      setSupportTickets([
        {
          id: '1',
          customerId: '1',
          customerName: 'John Smith',
          customerEmail: 'john.smith@email.com',
          type: 'return_request',
          priority: 'medium',
          status: 'in_progress',
          subject: 'Return request for damaged item',
          description: 'The t-shirt I received has a hole in it. I would like to return it for a refund.',
          createdAt: '2024-01-20T10:30:00Z',
          updatedAt: '2024-01-20T14:15:00Z',
          assignedTo: 'CS Agent 1',
          orderId: 'ORD-2024-001',
          tags: ['damage', 'return', 'refund']
        },
        {
          id: '2',
          customerId: '2',
          customerName: 'Sarah Johnson',
          customerEmail: 'sarah.j@email.com',
          type: 'general_inquiry',
          priority: 'low',
          status: 'open',
          subject: 'Question about custom design process',
          description: 'How long does it take to process a custom design order?',
          createdAt: '2024-01-21T09:15:00Z',
          updatedAt: '2024-01-21T09:15:00Z',
          tags: ['custom', 'timeline']
        },
        {
          id: '3',
          customerId: '3',
          customerName: 'Mike Wilson',
          customerEmail: 'mike.wilson@email.com',
          type: 'complaint',
          priority: 'high',
          status: 'waiting_customer',
          subject: 'Late delivery complaint',
          description: 'My order was supposed to arrive 3 days ago but still no sign of it.',
          createdAt: '2024-01-19T16:45:00Z',
          updatedAt: '2024-01-20T11:20:00Z',
          assignedTo: 'CS Agent 2',
          orderId: 'ORD-2024-003',
          tags: ['delivery', 'late', 'urgent']
        }
      ]);

      setOrders([
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          customerId: '1',
          customerName: 'John Smith',
          date: '2024-01-15',
          status: 'delivered',
          total: 299.99,
          paymentStatus: 'paid',
          items: [
            { id: '1', name: 'Premium T-Shirt', quantity: 2, price: 149.99 }
          ],
          shippingAddress: {
            street: '123 Main St',
            city: 'Cape Town',
            postalCode: '8001',
            country: 'South Africa'
          },
          trackingNumber: 'TRK123456789',
          estimatedDelivery: '2024-01-20',
          issues: ['damage_reported']
        },
        {
          id: '2',
          orderNumber: 'ORD-2024-002',
          customerId: '2',
          customerName: 'Sarah Johnson',
          date: '2024-01-18',
          status: 'shipped',
          total: 199.99,
          paymentStatus: 'paid',
          items: [
            { id: '2', name: 'Hoodie Black', quantity: 1, price: 199.99 }
          ],
          shippingAddress: {
            street: '456 Oak Ave',
            city: 'Johannesburg',
            postalCode: '2000',
            country: 'South Africa'
          },
          trackingNumber: 'TRK987654321',
          estimatedDelivery: '2024-01-25',
          issues: []
        }
      ]);

      setIsLoading(false);
    };

    if (isAuthenticated && user?.role === 'admin') {
      loadData();
    }
  }, [isAuthenticated, user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'delivered':
      case 'paid':
      case 'active':
      case 'vip':
        return 'text-green-600 bg-green-100';
      case 'in_progress':
      case 'processing':
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'waiting_customer':
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'open':
      case 'cancelled':
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      case 'closed':
      case 'returned':
      case 'refunded':
        return 'text-purple-600 bg-purple-100';
      case 'urgent':
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={20} /> },
    { id: 'tickets', label: 'Support Tickets', icon: <MessageSquare size={20} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
    { id: 'orders', label: 'Orders', icon: <Package size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <PieChart size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
  ];

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CSM Dashboard...</p>
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
                onClick={() => navigate('/admin')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Admin
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Customer Service Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-semibold text-gray-900">{user?.firstName}</span>
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
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {supportTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length}
                          </p>
                        </div>
                        <MessageSquare className="w-8 h-8 text-red-600" />
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Active Customers</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {customers.filter(c => c.status === 'active' || c.status === 'vip').length}
                          </p>
                        </div>
                        <Users className="w-8 h-8 text-blue-600" />
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
                        <Package className="w-8 h-8 text-yellow-600" />
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Urgent Issues</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {supportTickets.filter(t => t.priority === 'urgent' || t.priority === 'high').length}
                          </p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-orange-600" />
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b">
                      <h2 className="text-lg font-semibold text-gray-900">Recent Support Tickets</h2>
                    </div>
                    <div className="divide-y">
                      {supportTickets.slice(0, 5).map((ticket) => (
                        <div key={ticket.id} className="p-6 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <User size={20} className="text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{ticket.subject}</p>
                                <p className="text-sm text-gray-600">{ticket.customerName} • {ticket.createdAt}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                {ticket.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'tickets' && (
                <motion.div
                  key="tickets"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Filters */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="waiting_customer">Waiting Customer</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                      <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="all">All Priority</option>
                        <option value="urgent">Urgent</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>

                  {/* Tickets List */}
                  <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    {filteredTickets.map((ticket) => (
                      <div key={ticket.id} className="border-b last:border-b-0 p-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <User size={20} className="text-gray-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                              <p className="text-sm text-gray-600">{ticket.customerName} • {ticket.customerEmail}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}>
                              {ticket.status}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{ticket.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                            <span>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                            {ticket.assignedTo && <span>Assigned to: {ticket.assignedTo}</span>}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="text-gray-600 hover:text-gray-900 p-2">
                              <Eye size={16} />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 p-2">
                              <Reply size={16} />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 p-2">
                              <Archive size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default CSMDashboard;
