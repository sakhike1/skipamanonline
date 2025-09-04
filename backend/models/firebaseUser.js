const { getFirestore } = require('../config/firebase');

// Get Firestore instance
const firestore = getFirestore();

class FirebaseUser {
  static async findByUid(uid) {
    if (!firestore) {
      // Fallback to in-memory storage for development
      return this.findByUidFallback(uid);
    }

    try {
      const userDoc = await firestore.collection('users').doc(uid).get();
      if (userDoc.exists) {
        return { id: userDoc.id, ...userDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error finding user by UID:', error);
      return null;
    }
  }

  static async findByEmail(email) {
    if (!firestore) {
      // Fallback to in-memory storage for development
      return this.findByEmailFallback(email);
    }

    try {
      const usersRef = firestore.collection('users');
      const snapshot = await usersRef.where('email', '==', email.toLowerCase()).get();
      
      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  static async create(uid, userData) {
    const { email, firstName, lastName, role = 'user' } = userData;
    
    // Check if user already exists
    const existingUser = await this.findByUid(uid);
    if (existingUser) {
      throw new Error('User with this UID already exists');
    }

    // Create new user
    const newUser = {
      id: uid,
      email: email.toLowerCase(),
      firstName,
      lastName,
      role,
      phone: '',
      dateOfBirth: '',
      gender: 'prefer_not_to_say',
      addresses: [],
      preferences: {
        language: 'en',
        currency: 'USD',
        emailNotifications: {
          orderUpdates: true,
          promotions: true,
          newsletter: true
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (firestore) {
      // Save to Firestore
      await firestore.collection('users').doc(uid).set(newUser);
    } else {
      // Fallback to in-memory storage
      this.createFallback(uid, newUser);
    }
    
    // Return user without sensitive information
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static async update(uid, updateData) {
    const user = await this.findByUid(uid);
    if (!user) {
      throw new Error('User not found');
    }

    // Update user data
    const updatedUser = {
      ...user,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    if (firestore) {
      // Update in Firestore
      await firestore.collection('users').doc(uid).update({
        ...updateData,
        updatedAt: new Date().toISOString()
      });
    } else {
      // Fallback to in-memory storage
      this.updateFallback(uid, updatedUser);
    }
    
    // Return user without sensitive information
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  static async delete(uid) {
    if (firestore) {
      // Delete from Firestore
      const userDoc = await firestore.collection('users').doc(uid).get();
      if (!userDoc.exists) {
        throw new Error('User not found');
      }
      await firestore.collection('users').doc(uid).delete();
    } else {
      // Fallback to in-memory storage
      this.deleteFallback(uid);
    }
    return true;
  }

  static async findAll() {
    if (firestore) {
      // Get all users from Firestore
      const snapshot = await firestore.collection('users').get();
      return snapshot.docs.map(doc => {
        const user = { id: doc.id, ...doc.data() };
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    } else {
      // Fallback to in-memory storage
      return this.findAllFallback();
    }
  }

  // Fallback methods for development (in-memory storage)
  static findByUidFallback(uid) {
    // In-memory user storage for development
    const firebaseUsers = new Map();
    return firebaseUsers.get(uid) || null;
  }

  static findByEmailFallback(email) {
    const firebaseUsers = new Map();
    for (const [uid, user] of firebaseUsers) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return null;
  }

  static createFallback(uid, userData) {
    const firebaseUsers = new Map();
    firebaseUsers.set(uid, userData);
  }

  static updateFallback(uid, updateData) {
    const firebaseUsers = new Map();
    firebaseUsers.set(uid, updateData);
  }

  static deleteFallback(uid) {
    const firebaseUsers = new Map();
    firebaseUsers.delete(uid);
  }

  static findAllFallback() {
    const firebaseUsers = new Map();
    return Array.from(firebaseUsers.values()).map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  // Helper method to get user without sensitive information
  static toJSON(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = { FirebaseUser }; 