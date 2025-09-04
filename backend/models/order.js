const { getFirestore } = require('../config/firebase');

// Get Firestore instance
const firestore = getFirestore();

class Order {
  static async findByUserId(userId) {
    if (!firestore) {
      // Fallback to in-memory storage for development
      return this.findByUserIdFallback(userId);
    }

    try {
      const ordersRef = firestore.collection('orders');
      const snapshot = await ordersRef.where('userId', '==', userId).orderBy('createdAt', 'desc').get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error finding orders by user ID:', error);
      return [];
    }
  }

  static async findById(orderId, userId = null) {
    if (!firestore) {
      // Fallback to in-memory storage for development
      return this.findByIdFallback(orderId, userId);
    }

    try {
      const orderDoc = await firestore.collection('orders').doc(orderId).get();
      if (orderDoc.exists) {
        const order = { id: orderDoc.id, ...orderDoc.data() };
        // If userId is provided, ensure the order belongs to that user
        if (userId && order.userId !== userId) {
          return null;
        }
        return order;
      }
      return null;
    } catch (error) {
      console.error('Error finding order by ID:', error);
      return null;
    }
  }

  static async create(orderData) {
    const newOrder = {
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (firestore) {
      // Save to Firestore
      const orderRef = await firestore.collection('orders').add(newOrder);
      return { id: orderRef.id, ...newOrder };
    } else {
      // Fallback to in-memory storage
      return this.createFallback(newOrder);
    }
  }

  static async update(orderId, updateData, userId = null) {
    const order = await this.findById(orderId, userId);
    if (!order) {
      throw new Error('Order not found');
    }

    const updatedOrder = {
      ...order,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    if (firestore) {
      // Update in Firestore
      await firestore.collection('orders').doc(orderId).update({
        ...updateData,
        updatedAt: new Date().toISOString()
      });
    } else {
      // Fallback to in-memory storage
      this.updateFallback(orderId, updatedOrder);
    }
    
    return updatedOrder;
  }

  static async delete(orderId, userId = null) {
    const order = await this.findById(orderId, userId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (firestore) {
      // Delete from Firestore
      await firestore.collection('orders').doc(orderId).delete();
    } else {
      // Fallback to in-memory storage
      this.deleteFallback(orderId);
    }
    return true;
  }

  static async findAll() {
    if (firestore) {
      // Get all orders from Firestore
      const snapshot = await firestore.collection('orders').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } else {
      // Fallback to in-memory storage
      return this.findAllFallback();
    }
  }

  // Fallback methods for development (in-memory storage)
  static findByUserIdFallback(userId) {
    // In-memory orders storage for development
    const orders = new Map();
    return Array.from(orders.values()).filter(order => order.userId === userId);
  }

  static findByIdFallback(orderId, userId = null) {
    const orders = new Map();
    const order = orders.get(orderId);
    if (order && (!userId || order.userId === userId)) {
      return order;
    }
    return null;
  }

  static createFallback(orderData) {
    const orders = new Map();
    const orderId = `order_${Date.now()}`;
    const newOrder = { id: orderId, ...orderData };
    orders.set(orderId, newOrder);
    return newOrder;
  }

  static updateFallback(orderId, updateData) {
    const orders = new Map();
    orders.set(orderId, updateData);
  }

  static deleteFallback(orderId) {
    const orders = new Map();
    orders.delete(orderId);
  }

  static findAllFallback() {
    const orders = new Map();
    return Array.from(orders.values());
  }
}

module.exports = { Order }; 