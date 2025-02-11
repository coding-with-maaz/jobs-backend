const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

// Validation middleware
const validateRegistration = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('adminCode').notEmpty().withMessage('Admin registration code is required')
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const validateProfileUpdate = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required')
];

// Public routes
router.post('/register', validateRegistration, adminController.register);
router.post('/login', validateLogin, adminController.login);

// Protected routes
router.get('/profile', adminAuth, adminController.getProfile);
router.put('/profile', [adminAuth, validateProfileUpdate], adminController.updateProfile);

module.exports = router;