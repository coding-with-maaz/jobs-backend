// routes/writingSectionRoutes.js

const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/writingSectionController');

// Create a new writing section
router.post('/', sectionController.createWritingSection);

// Get all writing sections
router.get('/', sectionController.getAllWritingSections);

// Get a specific writing section by ID
router.get('/:id', sectionController.getWritingSection);

// Update a specific writing section by ID
router.put('/:id', sectionController.updateWritingSection);  // Updated route for PUT

// Delete a specific writing section by ID
router.delete('/:id', sectionController.deleteWritingSection);  // Added route for DELETE

module.exports = router;