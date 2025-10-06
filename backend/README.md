
# Skipaman Store Backend API

A comprehensive Node.js/Express backend API for the Skipaman e-commerce store with real-time notifications, order management, and admin panel functionality.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- User registration and login
- Role-based access control (User/Admin)
- Password hashing with bcrypt
- Protected routes middleware

### 📦 Order Management
- Create, read, update orders
- Order status tracking with real-time updates
- Order history for users
- Admin order management panel
- Order cancellation functionality

### 👥 User Management
- User profiles with addresses
- User preferences and settings
- Admin user management
- User activity tracking

### 🛍️ Product Management
- Product catalog with filtering
- Search functionality
- Category-based organization
- Stock management
- Featured products

### 🔔 Real-time Notifications
- Socket.IO integration
- Order status updates
- Admin notifications
- User notification management
- Real-time delivery estimates

### 📊 Admin Dashboard
- Order statistics and analytics
- User management
- Product management
- Notification system
- Real-time order tracking

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/skipaman_store
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/create-admin` - Create admin user

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/:id/tracking` - Get order tracking

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search/:query` - Search products
- `GET /api/products/categories` - Get product categories

### Admin
- `GET /api/admin/orders` - Get all orders (Admin)
- `GET /api/admin/orders/:id` - Get order details (Admin)
- `PUT /api/admin/orders/:id/status` - Update order status (Admin)
- `GET /api/admin/dashboard` - Get dashboard statistics (Admin)
- `GET /api/admin/users` - Get all users (Admin)
- `PUT /api/admin/users/:id/status` - Update user status (Admin)
- `POST /api/admin/notifications` - Send notification (Admin)

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## Real-time Features

### Socket.IO Events

#### Client to Server
- `subscribeToOrder` - Subscribe to order updates
- `unsubscribeFromOrder` - Unsubscribe from order updates
- `adminNotification` - Send admin broadcast (Admin only)

#### Server to Client
- `orderUpdate` - Order status change notification
- `newNotification` - New notification received
- `adminBroadcast` - Admin broadcast message
- `connected` - Connection confirmation

### Order Status Flow
1. **pending** - Order placed, awaiting confirmation
2. **confirmed** - Order confirmed, being prepared
3. **processing** - Order being processed
4. **packed** - Order packed, ready for shipment
5. **shipped** - Order shipped, in transit
6. **out_for_delivery** - Out for delivery (8-hour estimate)
7. **delivered** - Order delivered successfully

## Database Models

### User
- Personal information (name, email, phone)
- Authentication data (password, role)
- Addresses and preferences
- Activity tracking

### Order
- Order details and items
- Status tracking with history
- Payment and shipping information
- Admin notes and tracking

### Product
- Product information and pricing
- Inventory management
- Categories and tags
- Reviews and ratings

### Notification
- User notifications
- Real-time updates
- Read status tracking
- Notification types

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API request limiting
- **Input Validation**: Request validation
- **Password Hashing**: bcrypt encryption
- **JWT Tokens**: Secure authentication
- **Role-based Access**: Admin/User permissions

## Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### Environment Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRE` - JWT expiration time
- `FRONTEND_URL` - Frontend URL for CORS
- `EMAIL_*` - Email configuration for notifications

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```bash
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   ```

3. **Start the production server**
   ```bash
   npm start
   ```

## API Documentation

The API follows RESTful conventions with JSON responses. All responses include a `success` boolean and appropriate data or error messages.

### Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Format
```json
{
  "success": false,
  "message": "Error description"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
