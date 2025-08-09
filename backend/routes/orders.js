const express = require('express');
const { authenticateFirebaseToken } = require('../middleware/firebaseAuth');
const { Order } = require('../models/order');

const router = express.Router();

// Get user orders
router.get('/', authenticateFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userOrders = await Order.findByUserId(userId);
    res.json(userOrders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      error: 'Failed to retrieve orders',
      message: 'Something went wrong'
    });
  }
});

// Get specific order
router.get('/:orderId', authenticateFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId, userId);
    
    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'No order found with the provided ID'
      });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      error: 'Failed to retrieve order',
      message: 'Something went wrong'
    });
  }
});

// Create new order
router.post('/', authenticateFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const orderData = req.body;
    
    const newOrder = await Order.create({
      userId,
      status: 'pending',
      paymentStatus: 'pending',
      ...orderData
    });
    
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      error: 'Failed to create order',
      message: 'Something went wrong'
    });
  }
});

// Update order
router.patch('/:orderId', authenticateFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const updateData = req.body;
    
    const updatedOrder = await Order.update(orderId, updateData, userId);
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order error:', error);
    
    if (error.message === 'Order not found') {
      return res.status(404).json({
        error: 'Order not found',
        message: 'No order found with the provided ID'
      });
    }
    
    res.status(500).json({
      error: 'Failed to update order',
      message: 'Something went wrong'
    });
  }
});

// Update order status
router.patch('/:orderId/status', authenticateFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const { status } = req.body;
    
    const updatedOrder = await Order.update(orderId, { status }, userId);
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    
    if (error.message === 'Order not found') {
      return res.status(404).json({
        error: 'Order not found',
        message: 'No order found with the provided ID'
      });
    }
    
    res.status(500).json({
      error: 'Failed to update order status',
      message: 'Something went wrong'
    });
  }
});

// Update payment status
router.patch('/:orderId/payment', authenticateFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const { paymentStatus } = req.body;
    
    const updatedOrder = await Order.update(orderId, { paymentStatus }, userId);
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update payment status error:', error);
    
    if (error.message === 'Order not found') {
      return res.status(404).json({
        error: 'Order not found',
        message: 'No order found with the provided ID'
      });
    }
    
    res.status(500).json({
      error: 'Failed to update payment status',
      message: 'Something went wrong'
    });
  }
});

// Cancel order
router.post('/:orderId/cancel', authenticateFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const { reason } = req.body;
    
    const updatedOrder = await Order.update(orderId, {
      status: 'cancelled',
      notes: reason ? `Cancelled: ${reason}` : 'Order cancelled by customer'
    }, userId);
    
    res.json(updatedOrder);
  } catch (error) {
    console.error('Cancel order error:', error);
    
    if (error.message === 'Order not found') {
      return res.status(404).json({
        error: 'Order not found',
        message: 'No order found with the provided ID'
      });
    }
    
    res.status(500).json({
      error: 'Failed to cancel order',
      message: 'Something went wrong'
    });
  }
});

// Get order history for a user
router.get('/history/:userId', authenticateFirebaseToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Ensure the authenticated user can only access their own order history
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only access your own order history'
      });
    }
    
    const userOrders = await Order.findByUserId(userId);
    res.json(userOrders);
  } catch (error) {
    console.error('Get order history error:', error);
    res.status(500).json({
      error: 'Failed to retrieve order history',
      message: 'Something went wrong'
    });
  }
});

module.exports = router; 