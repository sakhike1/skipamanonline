const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/skipaman_store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'admin'], default: 'buyer' },
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  addresses: { type: Array, default: [] },
  preferences: {
    emailNotifications: {
      orderUpdates: true,
      promotions: true,
      newsletter: true,
      productRecommendations: true
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@skipamanstore.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@skipamanstore.com');
      console.log('Password: admin123456');
      process.exit(0);
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123456', salt);

    // Create admin user
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
    console.log('🎯 Role: admin');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
