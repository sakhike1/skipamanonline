const mongoose = require('mongoose');

async function createAdmin() {
  console.log('🔄 Connecting to MongoDB...');
  
  try {
    await mongoose.connect('mongodb://localhost:27017/skipaman_store');
    console.log('✅ Connected to MongoDB');
    
    // Simple user creation
    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      password: String,
      firstName: String,
      lastName: String,
      role: String,
      isActive: Boolean,
      emailVerified: Boolean,
      addresses: Array,
      preferences: Object,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }));
    
    // Check if admin exists
    const existing = await User.findOne({ email: 'admin@skipamanstore.com' });
    if (existing) {
      console.log('✅ Admin user already exists!');
      console.log('📧 Email: admin@skipamanstore.com');
      console.log('🔑 Password: admin123456');
    } else {
      console.log('🔄 Creating admin user...');
      
      // Create admin with hashed password (using bcrypt)
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123456', 10);
      
      const admin = new User({
        email: 'admin@skipamanstore.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
        emailVerified: true,
        addresses: [],
        preferences: {
          emailNotifications: {
            orderUpdates: true,
            promotions: true,
            newsletter: true,
            productRecommendations: true
          }
        }
      });
      
      await admin.save();
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@skipamanstore.com');
      console.log('🔑 Password: admin123456');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createAdmin();
