const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth'); // Auth middleware

const router = express.Router();

// Step 1: Register user (Skills only)
router.post('/register-step-1', userController.registerStep1);

// Step 2: Add basic information (Name, Phone, Email)
router.post(
  '/register-step-2',
  [
    check('userId').notEmpty().withMessage('User ID is required'),
    check('name').notEmpty().withMessage('Name is required'),
    check('phone').notEmpty().withMessage('Phone is required'),
    check('email').isEmail().withMessage('Valid email is required'),
  ],
  userController.registerStep2
);

// Step 3: Add Bio
router.post(
  '/register-step-3',
  [
    check('userId').notEmpty().withMessage('User ID is required'),
    check('bio').notEmpty().withMessage('Bio is required'),
  ],
  userController.registerStep3
);

// Step 4: Complete registration (Set Password)
router.post(
  '/register-step-4',
  [
    check('userId').notEmpty().withMessage('User ID is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  userController.registerStep4
);

// Login
router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').notEmpty().withMessage('Password is required'),
  ],
  userController.login
);

// Get user profile (Protected Route)
router.get('/profile', auth, userController.getProfile);

// Update user profile (Protected Route)
router.put('/profile', auth, userController.updateProfile);

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
