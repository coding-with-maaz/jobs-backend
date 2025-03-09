const express = require('express');
const router = express.Router();
const speakingTestController = require('../controllers/speakingTestController');

// Create a new speaking test with optional audio
router.post('/', speakingTestController.createSpeakingTest);

// Get all speaking tests
router.get('/', speakingTestController.getAllSpeakingTests);

// Get a specific speaking test by ID
router.get('/:id', speakingTestController.getSpeakingTest);

// Update a specific speaking test by ID with optional audio
router.put('/:id', speakingTestController.updateSpeakingTest);

// Delete a specific speaking test by ID
router.delete('/:id', speakingTestController.deleteSpeakingTest);

// Submit a specific speaking test with audio response
router.post('/:id/submit', speakingTestController.submitSpeakingTest);

module.exports = router;