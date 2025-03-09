const express = require('express');
const router = express.Router();
const speakingSectionController = require('../controllers/speakingSectionController');
const upload = require('../utils/speakingMutler');

// Create a new speaking section with audio
router.post('/', upload.single('audio'), speakingSectionController.createSpeakingSection);

// Get all speaking sections
router.get('/', speakingSectionController.getAllSpeakingSections);

// Get a specific speaking section by ID
router.get('/:id', speakingSectionController.getSpeakingSection);

// Update a speaking section by ID
router.put('/:id', upload.single('audio'), speakingSectionController.updateSpeakingSection);

// Delete a speaking section by ID
router.delete('/:id', speakingSectionController.deleteSpeakingSection);

module.exports = router;