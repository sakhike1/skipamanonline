const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { User } = require('../models/user');

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({
      message: 'Users retrieved successfully',
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Failed to retrieve users',
      message: 'Something went wrong'
    });
  }
});

// Get user by ID (admin only)
router.get('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
    }

    res.json({
      message: 'User retrieved successfully',
      user: User.toJSON(user)
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to retrieve user',
      message: 'Something went wrong'
    });
  }
});

// Update user (admin only)
router.put('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove sensitive fields from update data
    delete updateData.password;
    delete updateData.id;
    delete updateData.createdAt;

    const updatedUser = await User.update(id, updateData);
    
    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
    }

    res.status(500).json({
      error: 'Failed to update user',
      message: 'Something went wrong'
    });
  }
});

// Delete user (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (id === req.user.id) {
      return res.status(400).json({
        error: 'Cannot delete own account',
        message: 'You cannot delete your own admin account'
      });
    }

    await User.delete(id);
    
    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
    }

    res.status(500).json({
      error: 'Failed to delete user',
      message: 'Something went wrong'
    });
  }
});

// Get user statistics (admin only)
router.get('/stats/overview', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const users = await User.findAll();
    
    const stats = {
      total: users.length,
      admins: users.filter(user => user.role === 'admin').length,
      regularUsers: users.filter(user => user.role === 'user').length,
      recentUsers: users.filter(user => {
        const userDate = new Date(user.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return userDate > weekAgo;
      }).length
    };

    res.json({
      message: 'User statistics retrieved successfully',
      stats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      error: 'Failed to retrieve user statistics',
      message: 'Something went wrong'
    });
  }
});

module.exports = router; 