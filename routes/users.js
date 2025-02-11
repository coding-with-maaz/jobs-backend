const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');

// Validation middleware
const validateUser = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Public routes
router.post('/register', validateUser, userController.register);
router.post('/login', validateLogin, userController.login);

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