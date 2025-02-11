const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');

// Registration validation middleware
const validateStep2 = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('phone').notEmpty().trim().withMessage('Phone number is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
];

const validateStep4 = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

// Multi-step registration routes
router.post('/register/step1', userController.registerStep1);
router.post('/register/step2/:userId', validateStep2, userController.registerStep2);
router.post('/register/step3/:userId', userController.registerStep3);
router.post('/register/step4/:userId', validateStep4, userController.registerStep4);

// Login route
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], userController.login);

// Protected routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.post('/jobs/:jobId/save', auth, userController.saveJob);
router.delete('/jobs/:jobId/save', auth, userController.unsaveJob);

// Admin routes
router.get('/', adminAuth, userController.getAllUsers);
router.get('/:id', adminAuth, userController.getUserById);
router.delete('/:id', adminAuth, userController.deleteUser);

module.exports = router;