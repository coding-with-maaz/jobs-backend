const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

// All routes in this file require authentication
router.use(authenticate);

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', userController.getUserProfile);

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  [
    check('name', 'Name is required').optional().not().isEmpty(),
    check('email', 'Please include a valid email').optional().isEmail()
  ],
  userController.updateUserProfile
);

// @route   PUT api/users/change-password
// @desc    Change user password
// @access  Private
router.put(
  '/change-password',
  [
    check('currentPassword', 'Current password is required').not().isEmpty(),
    check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
  ],
  userController.changePassword
);

module.exports = router;