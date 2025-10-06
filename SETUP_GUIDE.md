# Skipaman Store - Complete Setup Guide

This guide will help you set up the complete Skipaman Store application with backend API, real-time notifications, and admin panel functionality.

## 🏗️ Architecture Overview

The application consists of:
- **Frontend**: React + TypeScript + Vite (Port 5173)
- **Backend**: Node.js + Express + TypeScript (Port 5000)
- **Database**: MongoDB
- **Real-time**: Socket.IO for notifications
- **Authentication**: JWT-based with role management

## 📋 Prerequisites

Before starting, ensure you have:
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

## 🚀 Quick Start

### 1. Clone and Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your configuration
# At minimum, set:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (a secure random string)
# - FRONTEND_URL (http://localhost:5173)
```

### 2. Setup Database

```bash
# Start MongoDB (if running locally)
# On Windows: net start MongoDB
# On macOS: brew services start mongodb-community
# On Linux: sudo systemctl start mongod

# Seed the database with sample data
npm run seed
```

### 3. Start Backend Server

```bash
# Development mode
npm run dev

# The backend will start on http://localhost:5000
```

### 4. Setup Frontend

```bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local file:
# VITE_API_URL=http://localhost:5000/api
# VITE_SOCKET_URL=http://localhost:5000
```

### 5. Start Frontend

```bash
# Development mode
npm run dev

# The frontend will start on http://localhost:5173
```

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/skipaman_store

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Admin Configuration (for initial setup)
ADMIN_EMAIL=admin@skipamanstore.com
ADMIN_PASSWORD=admin123456

# Socket.io Configuration
SOCKET_CORS_ORIGIN=http://localhost:5173
```

### Frontend Environment Variables

Create a `.env.local` file in the project root:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 👤 Default Accounts

After seeding the database, you'll have these accounts:

### Admin Account
- **Email**: admin@skipamanstore.com
- **Password**: admin123456
- **Access**: Full admin dashboard, order management

### Sample User Accounts
- **Email**: john.doe@example.com
- **Password**: password123
- **Email**: jane.smith@example.com
- **Password**: password123

## 🎯 Features Overview

### For Users
- ✅ User registration and authentication
- ✅ Browse products with filtering and search
- ✅ Add items to cart and wishlist
- ✅ Place orders with real-time status updates
- ✅ Track order progress with delivery estimates
- ✅ Receive real-time notifications
- ✅ View order history

### For Admins
- ✅ Admin dashboard with analytics
- ✅ Manage all orders and update status
- ✅ View customer information
- ✅ Send notifications to users
- ✅ Real-time order monitoring
- ✅ User management

### Real-time Features
- ✅ Order status updates
- ✅ Delivery notifications
- ✅ Admin broadcasts
- ✅ Live order tracking

## 📱 Order Status Flow

The system supports the following order statuses:

1. **pending** - Order placed, awaiting confirmation
2. **confirmed** - Order confirmed, being prepared
3. **processing** - Order being processed
4. **packed** - Order packed, ready for shipment
5. **shipped** - Order shipped, in transit
6. **out_for_delivery** - Out for delivery (8-hour estimate)
7. **delivered** - Order delivered successfully
8. **cancelled** - Order cancelled
9. **returned** - Order returned
10. **refunded** - Order refunded

## 🔔 Notification System

The app includes a comprehensive notification system:

### Notification Types
- Order confirmations
- Status updates
- Shipping notifications
- Delivery confirmations
- Admin messages
- System notifications

### Real-time Updates
- Socket.IO integration
- Live order tracking
- Instant status changes
- Delivery estimates

## 🛠️ Development

### Backend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run seed         # Seed database with sample data
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🗄️ Database Schema

### Users Collection
- Personal information (name, email, phone)
- Authentication data (password, role)
- Addresses and preferences
- Activity tracking

### Orders Collection
- Order details and items
- Status tracking with history
- Payment and shipping information
- Admin notes and tracking

### Products Collection
- Product information and pricing
- Inventory management
- Categories and tags
- Reviews and ratings

### Notifications Collection
- User notifications
- Real-time updates
- Read status tracking
- Notification types

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- CORS protection
- Rate limiting
- Input validation
- Helmet security headers

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/logout` - Logout

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `GET /api/orders/:id/tracking` - Get order tracking

### Admin
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/dashboard` - Get dashboard stats
- `PUT /api/admin/orders/:id/status` - Update order status
- `POST /api/admin/notifications` - Send notification

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products

## 🚀 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Start with: `npm start`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update API URLs in environment variables

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify database permissions

2. **CORS Errors**
   - Check `FRONTEND_URL` in backend `.env`
   - Ensure frontend URL matches exactly

3. **Socket.IO Connection Issues**
   - Verify `SOCKET_CORS_ORIGIN` in backend `.env`
   - Check firewall settings

4. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT_SECRET configuration
   - Verify token expiration settings

### Logs
- Backend logs: Check console output
- Frontend logs: Check browser developer tools
- Database logs: Check MongoDB logs

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check browser console for errors
4. Verify environment configuration

## 🎉 You're Ready!

Once everything is set up:
1. Visit http://localhost:5173
2. Register a new account or use the sample accounts
3. Browse products and place an order
4. Login as admin to manage orders
5. Experience real-time notifications!

The application is now fully functional with:
- ✅ User authentication and management
- ✅ Product catalog and shopping
- ✅ Order processing and tracking
- ✅ Admin dashboard and controls
- ✅ Real-time notifications
- ✅ Delivery estimates and status updates
