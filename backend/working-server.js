const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const PORT = 5000;

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));
app.use(express.json());

// Simple in-memory user storage
const users = [
  {
    id: '1',
    email: 'admin@skipamanstore.com',
    password: 'admin123456',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'buyer',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', email);
  
  // Find user
  const user = users.find(u => u.email === email);
  
  if (user && user.password === password) {
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          createdAt: user.createdAt || new Date().toISOString(),
          updatedAt: user.updatedAt || new Date().toISOString()
        },
        token: 'demo-jwt-token-' + user.id
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }
  
  // Create new user
  const newUser = {
    id: (users.length + 1).toString(),
    email,
    password,
    firstName,
    lastName,
    role: 'buyer',
    isActive: true
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      },
      token: 'demo-jwt-token-' + newUser.id
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }
  
  const userId = token.replace('demo-jwt-token-', '');
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    }
  });
});

// In-memory order storage
let orders = [];
let orderCounter = 1;

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle order subscription
  socket.on('subscribeToOrder', (orderId) => {
    socket.join(`order_${orderId}`);
    console.log(`Client ${socket.id} subscribed to order ${orderId}`);
  });

  // Handle order unsubscription
  socket.on('unsubscribeFromOrder', (orderId) => {
    socket.leave(`order_${orderId}`);
    console.log(`Client ${socket.id} unsubscribed from order ${orderId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Helper function to get status update message
function getStatusUpdateMessage(status, notes) {
  const messages = {
    'pending': 'Your order is being processed and will be prepared shortly.',
    'processing': 'Your order is being prepared for shipment.',
    'shipped': 'Great news! Your order has been shipped and is on its way to you.',
    'delivered': 'Your order has been successfully delivered!',
    'cancelled': 'Your order has been cancelled.'
  };
  
  return notes || messages[status] || 'Your order status has been updated.';
}

// Helper function to notify order updates
function notifyOrderUpdate(orderId, updateData) {
  io.to(`order_${orderId}`).emit('orderUpdate', {
    orderId: orderId,
    orderNumber: updateData.orderNumber,
    status: updateData.status,
    message: updateData.message,
    estimatedDelivery: updateData.estimatedDelivery,
    trackingNumber: updateData.trackingNumber,
    timestamp: new Date().toISOString()
  });
  console.log(`Notified clients about order ${orderId} update: ${updateData.status}`);
}

// Order routes
app.post('/api/orders', (req, res) => {
  const { items, shippingAddress, billingAddress, paymentMethod, notes } = req.body;
  
  // Get user from token (simplified for demo)
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  // Find user by token (simplified)
  const userId = token.includes('admin') ? '1' : '2';
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid user'
    });
  }
  
  // Create new order
  const newOrder = {
    _id: `order_${orderCounter++}`,
    orderNumber: `ORD-${Date.now()}`,
    userId: user.id,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    },
    items: items.map(item => ({
      productId: item.productId,
      productName: 'Minimalist Logo Tee', // Default product name
      productImage: '/images/1.png', // Default product image
      quantity: item.quantity,
      size: item.size,
      color: {
        name: item.color,
        hex: '#000000'
      },
      price: 50000, // R500 in cents
      total: 50000 * item.quantity
    })),
    shippingAddress,
    billingAddress,
    paymentMethod,
    status: 'pending',
    paymentStatus: 'paid',
    subtotal: items.length * 50000, // R500 per item
    tax: 0,
    shipping: items.length * 50000 >= 50000 ? 0 : 5000, // Free shipping over R500
    discount: 0,
    total: items.length * 50000 + (items.length * 50000 >= 50000 ? 0 : 5000),
    notes: notes || '',
    adminNotes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  
  console.log('New order created:', newOrder.orderNumber);
  
  res.json({
    success: true,
    message: 'Order created successfully',
    data: {
      order: newOrder
    }
  });
});

app.get('/api/admin/orders', (req, res) => {
  // Check if user is admin (simplified)
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  
  // Extract user ID from token and check if user is admin
  const userId = token.replace('demo-jwt-token-', '');
  const user = users.find(u => u.id === userId);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  
  // Get query parameters
  const { status, page = 1, limit = 10 } = req.query;
  
  let filteredOrders = orders;
  if (status) {
    filteredOrders = orders.filter(order => order.status === status);
  }
  
  // Sort by creation date (newest first)
  filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: {
      orders: paginatedOrders,
      total: filteredOrders.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredOrders.length / limit)
    }
  });
});

app.get('/api/admin/dashboard', (req, res) => {
  // Check if user is admin (simplified)
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  
  // Extract user ID from token and check if user is admin
  const userId = token.replace('demo-jwt-token-', '');
  const user = users.find(u => u.id === userId);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  
  // Calculate dashboard stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const shippedOrders = orders.filter(order => order.status === 'shipped').length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
  
  // Recent orders (last 5)
  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  
  res.json({
    success: true,
    data: {
      stats: {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        pendingOrders,
        shippedOrders,
        deliveredOrders
      },
      recentOrders
    }
  });
});

app.put('/api/admin/orders/:orderId/status', (req, res) => {
  // Check if user is admin (simplified)
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  
  // Extract user ID from token and check if user is admin
  const userId = token.replace('demo-jwt-token-', '');
  const user = users.find(u => u.id === userId);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  
  const { orderId } = req.params;
  const { status, notes } = req.body;
  
  const orderIndex = orders.findIndex(order => order._id === orderId);
  if (orderIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  
  // Update order
  orders[orderIndex] = {
    ...orders[orderIndex],
    status,
    adminNotes: notes || orders[orderIndex].adminNotes,
    updatedAt: new Date().toISOString()
  };
  
  console.log(`Order ${orders[orderIndex].orderNumber} status updated to: ${status}`);
  
  // Notify clients about the order update
  const updateMessage = getStatusUpdateMessage(status, notes);
  notifyOrderUpdate(orderId, {
    orderNumber: orders[orderIndex].orderNumber,
    status: status,
    message: updateMessage,
    estimatedDelivery: status === 'shipped' ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    trackingNumber: status === 'shipped' ? `TRK${Date.now()}` : undefined
  });
  
  res.json({
    success: true,
    message: 'Order status updated successfully',
    data: {
      order: orders[orderIndex]
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO enabled for real-time updates`);
  console.log(`👤 Admin credentials:`);
  console.log(`   Email: admin@skipamanstore.com`);
  console.log(`   Password: admin123456`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
