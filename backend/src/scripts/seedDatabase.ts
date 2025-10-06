import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { Notification } from '../models/Notification';

// Load environment variables
dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skipaman_store';
    await mongoose.connect(mongoURI);
    console.log('📦 MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const seedProducts = async (): Promise<void> => {
  const products = [
    {
      name: 'Premium Cotton T-Shirt',
      description: 'Soft, comfortable cotton t-shirt perfect for everyday wear. Made from 100% organic cotton.',
      price: 29.99,
      images: ['/images/tshirt1.jpg', '/images/tshirt2.jpg'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        { name: 'White', value: '#FFFFFF' },
        { name: 'Black', value: '#000000' },
        { name: 'Navy', value: '#1B2951' },
        { name: 'Gray', value: '#808080' }
      ],
      category: 'T-Shirts',
      featured: true,
      rating: 4.5,
      reviewCount: 128,
      stock: 50,
      sku: 'TSH-001',
      weight: 0.2,
      dimensions: { length: 70, width: 50, height: 1 },
      tags: ['cotton', 'organic', 'casual', 'comfortable'],
      isActive: true
    },
    {
      name: 'Classic Denim Jeans',
      description: 'Classic fit denim jeans with a comfortable stretch. Perfect for any occasion.',
      price: 79.99,
      images: ['/images/jeans1.jpg', '/images/jeans2.jpg'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        { name: 'Blue', value: '#4169E1' },
        { name: 'Black', value: '#000000' },
        { name: 'Light Blue', value: '#87CEEB' }
      ],
      category: 'Jeans',
      featured: true,
      rating: 4.3,
      reviewCount: 89,
      stock: 30,
      sku: 'JEA-001',
      weight: 0.8,
      dimensions: { length: 110, width: 40, height: 2 },
      tags: ['denim', 'classic', 'stretch', 'comfortable'],
      isActive: true
    },
    {
      name: 'Hooded Sweatshirt',
      description: 'Warm and cozy hooded sweatshirt with kangaroo pocket. Perfect for casual wear.',
      price: 59.99,
      images: ['/images/hoodie1.jpg', '/images/hoodie2.jpg'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        { name: 'Gray', value: '#808080' },
        { name: 'Black', value: '#000000' },
        { name: 'Navy', value: '#1B2951' },
        { name: 'Red', value: '#FF0000' }
      ],
      category: 'Hoodies',
      featured: true,
      rating: 4.7,
      reviewCount: 156,
      stock: 25,
      sku: 'HOO-001',
      weight: 0.6,
      dimensions: { length: 75, width: 55, height: 3 },
      tags: ['hoodie', 'warm', 'casual', 'pocket'],
      isActive: true
    },
    {
      name: 'Running Sneakers',
      description: 'Lightweight running sneakers with excellent cushioning and breathable material.',
      price: 129.99,
      images: ['/images/sneakers1.jpg', '/images/sneakers2.jpg'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        { name: 'White', value: '#FFFFFF' },
        { name: 'Black', value: '#000000' },
        { name: 'Blue', value: '#4169E1' }
      ],
      category: 'Shoes',
      featured: false,
      rating: 4.4,
      reviewCount: 203,
      stock: 40,
      sku: 'SNE-001',
      weight: 0.5,
      dimensions: { length: 30, width: 20, height: 10 },
      tags: ['running', 'sneakers', 'lightweight', 'breathable'],
      isActive: true
    },
    {
      name: 'Leather Jacket',
      description: 'Premium leather jacket with classic design. Perfect for both casual and formal occasions.',
      price: 199.99,
      images: ['/images/jacket1.jpg', '/images/jacket2.jpg'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        { name: 'Black', value: '#000000' },
        { name: 'Brown', value: '#8B4513' }
      ],
      category: 'Jackets',
      featured: true,
      rating: 4.8,
      reviewCount: 67,
      stock: 15,
      sku: 'JAC-001',
      weight: 1.2,
      dimensions: { length: 80, width: 60, height: 5 },
      tags: ['leather', 'premium', 'classic', 'formal'],
      isActive: true
    }
  ];

  // Clear existing products
  await Product.deleteMany({});
  
  // Insert new products
  await Product.insertMany(products);
  console.log('✅ Products seeded successfully');
};

const seedUsers = async (): Promise<void> => {
  // Clear existing users
  await User.deleteMany({});

  // Create admin user
  const admin = await User.create({
    email: 'admin@skipamanstore.com',
    password: 'admin123456',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isActive: true,
    emailVerified: true
  });

  // Create sample users
  const users = await User.create([
    {
      email: 'john.doe@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'buyer',
      isActive: true,
      emailVerified: true,
      phone: '+1234567890',
      addresses: [{
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'US',
        phone: '+1234567890',
        isDefault: true
      }]
    },
    {
      email: 'jane.smith@example.com',
      password: 'password123',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'buyer',
      isActive: true,
      emailVerified: true,
      phone: '+1987654321',
      addresses: [{
        firstName: 'Jane',
        lastName: 'Smith',
        address1: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90210',
        country: 'US',
        phone: '+1987654321',
        isDefault: true
      }]
    }
  ]);

  console.log('✅ Users seeded successfully');
  console.log(`   Admin: ${admin.email} / admin123456`);
  console.log(`   User 1: ${users[0].email} / password123`);
  console.log(`   User 2: ${users[1].email} / password123`);
};

const seedOrders = async (): Promise<void> => {
  // Clear existing orders
  await Order.deleteMany({});

  const users = await User.find({ role: 'buyer' });
  const products = await Product.find({});

  if (users.length === 0 || products.length === 0) {
    console.log('⚠️  No users or products found, skipping order seeding');
    return;
  }

  const sampleOrders = [
    {
      userId: users[0]._id,
      items: [
        {
          productId: products[0]._id,
          productName: products[0].name,
          productImage: products[0].images[0],
          quantity: 2,
          size: 'M',
          color: products[0].colors[0],
          price: products[0].price,
          total: products[0].price * 2
        }
      ],
      status: 'delivered',
      paymentStatus: 'paid',
      shippingAddress: users[0].addresses[0],
      billingAddress: users[0].addresses[0],
      subtotal: products[0].price * 2,
      tax: (products[0].price * 2) * 0.08,
      shipping: 0,
      total: (products[0].price * 2) * 1.08,
      paymentMethod: {
        type: 'stripe',
        details: {
          last4: '4242',
          brand: 'visa'
        }
      },
      trackingNumber: 'TRK123456789',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          updatedBy: 'system'
        },
        {
          status: 'confirmed',
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          updatedBy: 'admin'
        },
        {
          status: 'shipped',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          updatedBy: 'admin'
        },
        {
          status: 'delivered',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          updatedBy: 'admin'
        }
      ]
    },
    {
      userId: users[1]._id,
      items: [
        {
          productId: products[1]._id,
          productName: products[1].name,
          productImage: products[1].images[0],
          quantity: 1,
          size: 'L',
          color: products[1].colors[0],
          price: products[1].price,
          total: products[1].price
        }
      ],
      status: 'processing',
      paymentStatus: 'paid',
      shippingAddress: users[1].addresses[0],
      billingAddress: users[1].addresses[0],
      subtotal: products[1].price,
      tax: products[1].price * 0.08,
      shipping: 5.99,
      total: (products[1].price * 1.08) + 5.99,
      paymentMethod: {
        type: 'paypal',
        details: {
          email: users[1].email
        }
      },
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          updatedBy: 'system'
        },
        {
          status: 'confirmed',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          updatedBy: 'admin'
        },
        {
          status: 'processing',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          updatedBy: 'admin'
        }
      ]
    }
  ];

  await Order.insertMany(sampleOrders);
  console.log('✅ Orders seeded successfully');
};

const seedNotifications = async (): Promise<void> => {
  // Clear existing notifications
  await Notification.deleteMany({});

  const users = await User.find({ role: 'buyer' });
  const orders = await Order.find({});

  if (users.length === 0) {
    console.log('⚠️  No users found, skipping notification seeding');
    return;
  }

  const notifications = [
    {
      userId: users[0]._id,
      type: 'system',
      title: 'Welcome to Skipaman Store!',
      message: 'Thank you for joining us. Start exploring our amazing collection of products.',
      isRead: true,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    },
    {
      userId: users[0]._id,
      type: 'order_delivered',
      title: 'Order Delivered',
      message: 'Your order has been delivered successfully. Thank you for shopping with us!',
      isRead: false,
      data: { orderId: orders[0]?._id },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      userId: users[1]._id,
      type: 'system',
      title: 'Welcome to Skipaman Store!',
      message: 'Thank you for joining us. Start exploring our amazing collection of products.',
      isRead: true,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    },
    {
      userId: users[1]._id,
      type: 'order_status_update',
      title: 'Order Processing',
      message: 'Your order is being processed and will be shipped soon.',
      isRead: false,
      data: { orderId: orders[1]?._id },
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
    }
  ];

  await Notification.insertMany(notifications);
  console.log('✅ Notifications seeded successfully');
};

const seedDatabase = async (): Promise<void> => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    await seedUsers();
    await seedProducts();
    await seedOrders();
    await seedNotifications();
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   - Users: Admin + 2 sample users');
    console.log('   - Products: 5 sample products');
    console.log('   - Orders: 2 sample orders');
    console.log('   - Notifications: 4 sample notifications');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };


