const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const adminController = require('../controllers/adminController');
const { authenticate, isAdmin } = require('../middleware/auth');

// All routes in this file require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', adminController.getAllUsers);

// @route   GET api/admin/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get('/users/:id', adminController.getUserById);

// @route   PUT api/admin/users/:id
// @desc    Update user
// @access  Private/Admin
router.put(
  '/users/:id',
  [
    check('name', 'Name is required').optional().not().isEmpty(),
    check('email', 'Please include a valid email').optional().isEmail(),
    check('role', 'Role must be either user or admin').optional().isIn(['user', 'admin'])
  ],
  adminController.updateUser
);

// @route   DELETE api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;