# 🛍️ E-Commerce Application with Real API

A modern e-commerce application built with React, TypeScript, and a real Node.js/Express backend API with JWT authentication.

## 🚀 Features

### Frontend (React + TypeScript)
- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS and Framer Motion
- **JWT Authentication**: Complete login/register system with token management
- **Protected Routes**: Role-based access control (user/admin)
- **Shopping Features**: Product browsing, wishlist, cart management
- **Admin Dashboard**: User management and statistics
- **Real-time Updates**: Live authentication state management

### Backend (Node.js + Express)
- **RESTful API**: Complete CRUD operations
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Express-validator for data validation
- **Security Middleware**: Helmet, CORS, rate limiting
- **Error Handling**: Comprehensive error management
- **Role-based Authorization**: Admin and user roles

## 📁 Project Structure

```
project/
├── src/                    # Frontend React application
│   ├── components/         # React components
│   ├── context/           # React context providers
│   ├── pages/             # Page components
│   ├── services/          # API service layer
│   └── types/             # TypeScript type definitions
├── backend/               # Backend Node.js API
│   ├── middleware/        # Express middleware
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   ├── server.js         # Main server file
│   └── package.json      # Backend dependencies
└── README.md             # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Backend Setup

```bash
# Navigate to backend directory
cd project/backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your configuration
# Update JWT_SECRET and other settings as needed

# Start the backend server
npm run dev
```

The backend will start on `http://localhost:3001`

### 2. Frontend Setup

```bash
# Navigate to project root
cd project

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Frontend API Configuration

Update the API base URL in `src/services/authService.ts`:

```typescript
const API_BASE_URL = 'http://localhost:3001/api';
```

## 🔐 Authentication

### Demo Credentials

**Admin User:**
- Email: `admin@demo.com`
- Password: `admin123`

**Regular User:**
- Register a new account through the signup form

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user

#### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats/overview` - Get user statistics

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/categories/list` - Get product categories

## 🎯 Key Features

### 1. Real Authentication Flow
- Users must register before logging in
- Secure password hashing with bcrypt
- JWT tokens with refresh mechanism
- Automatic token validation and refresh

### 2. Enhanced Error Handling
- Clear error messages for different scenarios
- Smart user guidance (e.g., "Account not found" → "Create account")
- Professional error UI with animations

### 3. Admin Dashboard
- View all registered users
- User statistics and analytics
- Role-based access control
- Real-time data from API

### 4. Security Features
- JWT token validation
- Password hashing
- Rate limiting
- CORS protection
- Input validation
- Role-based authorization

## 🚀 Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure proper CORS origins
4. Set up a real database (MongoDB, PostgreSQL, etc.)
5. Use environment variables for sensitive data

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred hosting
3. Update API base URL to production endpoint
4. Configure environment variables

## 🔄 Database Integration

The current implementation uses in-memory storage. To integrate with a real database:

### MongoDB Example
```bash
npm install mongoose
```

### PostgreSQL Example
```bash
npm install pg sequelize
```

Update the User model in `backend/models/user.js` to use your database.

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
npm test
```

## 📝 API Documentation

### Authentication Flow
1. **Register**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login`
3. **Access Protected Routes**: Include `Authorization: Bearer <token>` header
4. **Refresh Token**: `POST /api/auth/refresh` when token expires
5. **Logout**: `POST /api/auth/logout`

### Error Responses
All API endpoints return consistent error responses:
```json
{
  "error": "Error Type",
  "message": "Human-readable error message"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your environment configuration
3. Ensure both frontend and backend are running
4. Check the API endpoints are accessible

## 🎉 What's Next?

- [ ] Add real database integration
- [ ] Implement product management
- [ ] Add payment processing
- [ ] Email verification
- [ ] Password reset functionality
- [ ] User profile management
- [ ] Order management system
- [ ] Analytics dashboard
- [ ] Mobile app development
