const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

console.log('🔧 Starting simplified server...');

const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample product data
const sampleProducts = [
  {
    id: 1,
    name: "Premium Cotton T-Shirt",
    price: 29.99,
    category: "clothing",
    image: "/images/tshirt1.jpg",
    description: "High-quality cotton t-shirt perfect for everyday wear",
    stock: 50,
    featured: true
  },
  {
    id: 2,
    name: "Classic Denim Jeans",
    price: 79.99,
    category: "clothing",
    image: "/images/jeans1.jpg",
    description: "Comfortable and stylish denim jeans",
    stock: 30,
    featured: true
  },
  {
    id: 3,
    name: "Running Sneakers",
    price: 99.99,
    category: "shoes",
    image: "/images/sneakers1.jpg",
    description: "Lightweight running sneakers for active lifestyle",
    stock: 25,
    featured: false
  }
];

// Sample user data
let users = [
  {
    id: 1,
    email: 'admin@skipamanstore.com',
    password: '$2a$10$dummy.hash.for.admin123456',
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: 2,
    email: 'user@example.com',
    password: '$2a$10$dummy.hash.for.password123',
    role: 'user',
    name: 'Test User'
  }
];

// Sample orders data
let orders = [];
let notifications = [];

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: 'development'
  });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple authentication (for demo purposes)
  const user = users.find(u => u.email === email);
  
  if (user && (password === 'admin123456' || password === 'password123')) {
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
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
  const { email, password, name } = req.body;
  
  const newUser = {
    id: users.length + 1,
    email,
    password: '$2a$10$dummy.hash.for.' + password,
    role: 'user',
    name
  };
  
  users.push(newUser);
  
  res.json({
    success: true,
    message: 'Registration successful',
    data: {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      },
      token: 'demo-jwt-token-' + newUser.id
    }
  });
});

// Product routes
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: {
      products: sampleProducts,
      total: sampleProducts.length
    }
  });
});

app.get('/api/products/featured', (req, res) => {
  const featured = sampleProducts.filter(p => p.featured);
  res.json({
    success: true,
    data: {
      products: featured,
      total: featured.length
    }
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = sampleProducts.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json({
      success: true,
      data: { product }
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
});

// Order routes
app.post('/api/orders', (req, res) => {
  const newOrder = {
    id: orders.length + 1,
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  orders.push(newOrder);
  
  // Emit socket event for new order
  io.emit('orderUpdate', {
    orderId: newOrder.id,
    status: 'pending',
    message: 'Order placed successfully'
  });
  
  res.json({
    success: true,
    message: 'Order created successfully',
    data: { order: newOrder }
  });
});

app.get('/api/orders', (req, res) => {
  res.json({
    success: true,
    data: { orders }
  });
});

// Notification routes
app.get('/api/notifications', (req, res) => {
  res.json({
    success: true,
    data: { notifications }
  });
});

app.get('/api/notifications/unread-count', (req, res) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  res.json({
    success: true,
    data: { unreadCount }
  });
});

// Admin routes
app.get('/api/admin/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      totalOrders: orders.length,
      totalUsers: users.length,
      totalProducts: sampleProducts.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length
    }
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);
  
  socket.emit('connected', { message: 'Connected to server' });
  
  socket.on('disconnect', () => {
    console.log('👤 User disconnected:', socket.id);
  });
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`🚀 Simplified server running on port ${PORT}`);
  console.log(`📱 Frontend URL: http://localhost:5173`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log('✅ Server started successfully!');
  console.log('📝 Demo accounts:');
  console.log('   Admin: admin@skipamanstore.com / admin123456');
  console.log('   User: user@example.com / password123');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});




