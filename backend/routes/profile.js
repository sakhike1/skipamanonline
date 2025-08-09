const express = require('express');
const { authenticateFirebaseToken } = require('../middleware/firebaseAuth');
const { FirebaseUser } = require('../models/firebaseUser');

const router = express.Router();

// Get user profile
router.get('/', authenticateFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.id;
    let user = await FirebaseUser.findByUid(userId);
    
    // If user doesn't exist in our system, create them
    if (!user) {
      user = await FirebaseUser.create(userId, {
        email: req.user.email,
        firstName: '',
        lastName: '',
        role: req.user.role
      });
    }
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
    }

    // Return profile data (excluding sensitive information)
    const profile = {
      id: user.id,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth || '',
      gender: user.gender || 'prefer_not_to_say',
      addresses: user.addresses || [],
      preferences: user.preferences || {
        language: 'en',
        currency: 'USD',
        emailNotifications: {
          orderUpdates: true,
          promotions: true,
          newsletter: true
        }
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to retrieve profile',
      message: 'Something went wrong'
    });
  }
});

// Update user profile
router.patch('/', authenticateFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    // Remove sensitive fields from update data
    delete updateData.password;
    delete updateData.id;
    delete updateData.email; // Don't allow email updates through profile endpoint
    delete updateData.role; // Don't allow role updates through profile endpoint
    delete updateData.createdAt;

    const updatedUser = await FirebaseUser.update(userId, updateData);
    
    // Return updated profile data
    const profile = {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName || '',
      lastName: updatedUser.lastName || '',
      phone: updatedUser.phone || '',
      dateOfBirth: updatedUser.dateOfBirth || '',
      gender: updatedUser.gender || 'prefer_not_to_say',
      addresses: updatedUser.addresses || [],
      preferences: updatedUser.preferences || {
        language: 'en',
        currency: 'USD',
        emailNotifications: {
          orderUpdates: true,
          promotions: true,
          newsletter: true
        }
      },
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    res.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
    }

    res.status(500).json({
      error: 'Failed to update profile',
      message: 'Something went wrong'
    });
  }
});

// Add new address
router.post('/addresses', authenticateFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const addressData = req.body;
    
    let user = await FirebaseUser.findByUid(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
    }

    // Generate new address ID
    const newAddress = {
      id: `addr_${Date.now()}`,
      ...addressData,
      isDefault: user.addresses.length === 0 // First address becomes default
    };

    // Update user's addresses
    const updatedAddresses = [...user.addresses, newAddress];
    
    // If this is the first address, make it default
    if (updatedAddresses.length === 1) {
      updatedAddresses[0].isDefault = true;
    }

    const updatedUser = await FirebaseUser.update(userId, { addresses: updatedAddresses });
    
    res.status(201).json(newAddress);
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      error: 'Failed to add address',
      message: 'Something went wrong'
    });
  }
});

// Update address
router.patch('/addresses/:addressId', authenticateFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const updateData = req.body;
    
    const user = await FirebaseUser.findByUid(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
    }

    const addressIndex = user.addresses.findIndex(addr => addr.id === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({
        error: 'Address not found',
        message: 'No address found with the provided ID'
      });
    }

    // Update address
    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex],
      ...updateData
    };

    const updatedUser = await FirebaseUser.update(userId, { addresses: user.addresses });
    
    res.json(user.addresses[addressIndex]);
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      error: 'Failed to update address',
      message: 'Something went wrong'
    });
  }
});

// Remove address
router.delete('/addresses/:addressId', authenticateFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    
    const user = await FirebaseUser.findByUid(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
    }

    const addressIndex = user.addresses.findIndex(addr => addr.id === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({
        error: 'Address not found',
        message: 'No address found with the provided ID'
      });
    }

    // Remove address
    const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
    
    // If we removed the default address and there are other addresses, make the first one default
    if (user.addresses[addressIndex].isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }

    await FirebaseUser.update(userId, { addresses: updatedAddresses });
    
    res.json({ message: 'Address removed successfully' });
  } catch (error) {
    console.error('Remove address error:', error);
    res.status(500).json({
      error: 'Failed to remove address',
      message: 'Something went wrong'
    });
  }
});

// Set default address
router.patch('/addresses/:addressId/default', authenticateFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    
    const user = await FirebaseUser.findByUid(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
    }

    const addressIndex = user.addresses.findIndex(addr => addr.id === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({
        error: 'Address not found',
        message: 'No address found with the provided ID'
      });
    }

    // Update all addresses to set isDefault to false, then set the target address to true
    const updatedAddresses = user.addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));

    await FirebaseUser.update(userId, { addresses: updatedAddresses });
    
    res.json({ message: 'Default address updated successfully' });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      error: 'Failed to set default address',
      message: 'Something went wrong'
    });
  }
});

module.exports = router; 