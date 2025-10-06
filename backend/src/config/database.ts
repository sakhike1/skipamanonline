import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skipaman_store';
    
    // Set a shorter timeout for connection attempts
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 second timeout
      bufferCommands: false // Disable mongoose buffering
    });

    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
      }
      process.exit(0);
    });

  } catch (error) {
    console.error('Database connection failed:', error);
    console.log('⚠️  Running without database connection. Some features may not work.');
    console.log('💡 To fix this:');
    console.log('   1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
    console.log('   2. Or update MONGODB_URI in .env with a valid Atlas connection string');
    console.log('   3. Or use the working-server.js for a demo without database');
    
    // Disconnect mongoose to prevent buffering
    await mongoose.disconnect();
    
    // Don't exit the process, just log the error and continue
  }
};

export { connectDB };

