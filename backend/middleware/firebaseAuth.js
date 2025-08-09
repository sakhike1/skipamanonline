const { initializeFirebase, getAuth } = require('../config/firebase');

// Initialize Firebase Admin
initializeFirebase();

// Middleware to verify Firebase JWT token
const authenticateFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    let decoded;
    
    const auth = getAuth();
    if (auth) {
      // Use Firebase Admin to verify token
      try {
        const decodedToken = await auth.verifyIdToken(token);
        decoded = {
          userId: decodedToken.uid,
          email: decodedToken.email,
          role: 'user' // Default role for Firebase users
        };
      } catch (firebaseError) {
        console.error('Firebase token verification failed:', firebaseError);
        return res.status(401).json({
          error: 'Invalid token',
          message: 'Token verification failed'
        });
      }
    } else {
      // Fallback: Basic JWT verification (for development)
      try {
        const jwt = require('jsonwebtoken');
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production');
      } catch (jwtError) {
        console.error('JWT verification failed:', jwtError);
        return res.status(401).json({
          error: 'Invalid token',
          message: 'Token verification failed'
        });
      }
    }

    // Add user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role || 'user'
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Authentication error',
      message: 'Something went wrong during authentication'
    });
  }
};

module.exports = {
  authenticateFirebaseToken
}; 