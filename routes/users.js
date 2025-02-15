const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth'); // Auth middleware
const { User } = require('../models'); // Updated import

const router = express.Router();

// Registration routes
router.post('/register/step1', userController.registerStep1);
router.post('/register/step2', userController.registerStep2);
router.post('/register/step3', userController.registerStep3);
router.post('/register/step4', userController.registerStep4);

// Login
router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').notEmpty().withMessage('Password is required'),
  ],
  userController.login
);

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .select('-password')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    // Remove sensitive fields
    delete updateData.password;
    delete updateData._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// Save Job (Protected Route)
router.post('/save-job/:jobId', auth, userController.saveJob);

// Unsave Job (Protected Route)
router.delete('/unsave-job/:jobId', auth, userController.unsaveJob);

// Get all users (Admin only)
router.get('/users', adminAuth, userController.getAllUsers);

// Get user by ID (Admin or self)
router.get('/user/:id', auth, userController.getUserById);

// Delete user (Admin only)
router.delete('/user/:id', adminAuth, userController.deleteUser);

module.exports = router;
