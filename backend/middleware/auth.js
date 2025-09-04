const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    // Verify token - handle both real JWT and mock tokens
    let decoded;
    if (token.startsWith('mock.')) {
      // Handle mock tokens from frontend
      try {
        const tokenData = token.split('.')[1];
        decoded = JSON.parse(Buffer.from(tokenData, 'base64').toString());
        console.log('Mock token decoded:', decoded);
      } catch (error) {
        console.error('Invalid mock token:', error);
        throw new Error('Invalid mock token');
      }
    } else {
      // Handle real JWT tokens
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production');
      } catch (error) {
        console.error('JWT verification failed:', error);
        throw error;
      }
    }
    
    // Get user from database
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      console.error('User not found for ID:', decoded.userId);
      return res.status(401).json({
        error: 'Access denied',
        message: 'Invalid token - user not found'
      });
    }

    // Add user to request object (without password)
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please log in again'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Please log in again'
      });
    }

    res.status(500).json({
      error: 'Authentication error',
      message: 'Something went wrong during authentication'
    });
  }
};

// Middleware to check if user has required role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      let decoded;
      if (token.startsWith('mock.')) {
        // Handle mock tokens from frontend
        try {
          const tokenData = token.split('.')[1];
          decoded = JSON.parse(Buffer.from(tokenData, 'base64').toString());
        } catch (error) {
          // Silently ignore invalid mock tokens
          return next();
        }
      } else {
        // Handle real JWT tokens
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production');
        } catch (error) {
          // Silently ignore invalid tokens for optional auth
          return next();
        }
      }
      
      const user = await User.findById(decoded.userId);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
      }
    }
  } catch (error) {
    // Silently ignore token errors for optional auth
  }
  
  next();
};

module.exports = {
  authenticateToken,
  requireRole,
  optionalAuth
}; 