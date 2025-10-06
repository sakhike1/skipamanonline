const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

console.log('🔧 Step 1: Environment loaded');

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('🔧 Step 2: Basic middleware configured');

// Test database connection
async function testDB() {
  try {
    console.log('🔧 Step 3: Testing MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skipaman_store');
    console.log('✅ Step 3: MongoDB connected successfully!');
  } catch (error) {
    console.error('❌ Step 3: MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

// Test route imports
async function testImports() {
  try {
    console.log('🔧 Step 4: Testing route imports...');
    
    // Test auth routes
    const authRoutes = require('./src/routes/auth');
    console.log('✅ Step 4a: Auth routes loaded');
    
    // Test user routes
    const userRoutes = require('./src/routes/users');
    console.log('✅ Step 4b: User routes loaded');
    
    // Test order routes
    const orderRoutes = require('./src/routes/orders');
    console.log('✅ Step 4c: Order routes loaded');
    
    // Test product routes
    const productRoutes = require('./src/routes/products');
    console.log('✅ Step 4d: Product routes loaded');
    
    // Test admin routes
    const adminRoutes = require('./src/routes/admin');
    console.log('✅ Step 4e: Admin routes loaded');
    
    // Test notification routes
    const notificationRoutes = require('./src/routes/notifications');
    console.log('✅ Step 4f: Notification routes loaded');
    
    console.log('✅ Step 4: All routes loaded successfully!');
  } catch (error) {
    console.error('❌ Step 4: Route import failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

app.get('/test', (req, res) => {
  res.json({ message: 'Step-by-step server is working!' });
});

const PORT = 5000;

async function startServer() {
  await testDB();
  await testImports();
  
  app.listen(PORT, () => {
    console.log(`🚀 Step-by-step server running on port ${PORT}`);
    console.log('✅ Server started successfully!');
  });
}

startServer().catch(console.error);


