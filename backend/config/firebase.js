const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let firebaseApp;

const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length > 0) {
      firebaseApp = admin.apps[0];
      console.log('Firebase Admin already initialized');
      return firebaseApp;
    }

    // Try to initialize with service account key
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL || "https://playplay-395d7-default-rtdb.europe-west1.firebasedatabase.app"
      });
      console.log('Firebase Admin initialized with service account');
    } else if (process.env.FIREBASE_PROJECT_ID) {
      // Initialize with project ID (for development)
      firebaseApp = admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID
      });
      console.log('Firebase Admin initialized with project ID');
    } else {
      console.log('Firebase Admin not initialized - using fallback authentication');
      return null;
    }

    return firebaseApp;
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    console.log('Firebase Admin not initialized - using fallback authentication');
    return null;
  }
};

// Get Firestore instance
const getFirestore = () => {
  if (!firebaseApp) {
    return null;
  }
  return admin.firestore(firebaseApp);
};

// Get Auth instance
const getAuth = () => {
  if (!firebaseApp) {
    return null;
  }
  return admin.auth(firebaseApp);
};

module.exports = {
  initializeFirebase,
  getFirestore,
  getAuth,
  admin
}; 