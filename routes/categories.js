const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const categoryController = require('../controllers/categoryController');

// Validation middleware
const validateCategory = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('icon').notEmpty().trim().withMessage('Icon is required'),
  body('color').notEmpty().trim().withMessage('Color is required')
];

// Routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', validateCategory, categoryController.createCategory);
router.put('/:id', validateCategory, categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;