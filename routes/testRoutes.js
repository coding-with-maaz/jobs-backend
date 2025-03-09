const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

// Routes for creating, getting, updating, and submitting tests
router.post('/', testController.createTest); // Create a test
router.patch('/:id', testController.updateTest); // Update a test by ID
router.get('/', testController.getAllTests); // Get all tests
router.get('/:id', testController.getTest); // Get a specific test by ID
router.post('/:id/submit', testController.submitTest); // Submit a test

// Delete a test by ID
router.delete('/:id', testController.deleteTest);

module.exports = router;
