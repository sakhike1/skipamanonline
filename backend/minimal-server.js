const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

console.log('🔧 Starting minimal server...');

// Test database connection
async function testDB() {
  try {
    console.log('📦 Testing MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skipaman_store');
    console.log('✅ MongoDB connected successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

app.get('/test', (req, res) => {
  res.json({ message: 'Minimal server is working!' });
});

const PORT = 5000;

async function startServer() {
  await testDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Minimal server running on port ${PORT}`);
    console.log('✅ Server started successfully!');
  });
}

startServer().catch(console.error);


