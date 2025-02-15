const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth'); // Auth middleware

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
