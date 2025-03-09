const express = require('express');
const router = express.Router();
const testController = require('../controllers/writingTestController');
const { audioUpload } = require('../middleware/upload'); // Middleware for audio upload
const { pdfUpload } = require('../middleware/write-upload'); // New middleware for PDF upload

// Create a new writing test (with audio file uploads for each section)
const sectionAudioFields = [
  { name: 'section1', maxCount: 1 },
  { name: 'section2', maxCount: 1 },
  { name: 'section3', maxCount: 1 },
  { name: 'section4', maxCount: 1 }
];

router.post('/', audioUpload.fields(sectionAudioFields), testController.createWritingTest);

// Update audio for a specific writing test by ID
router.patch('/:id/audio', audioUpload.fields(sectionAudioFields), testController.updateWritingTestAudio);

// Get all writing tests
router.get('/', testController.getAllWritingTests);

// Get a specific writing test by ID
router.get('/:id', testController.getWritingTest);

// Submit a writing test
router.post('/:id/submit', pdfUpload.single('answerSheet'), testController.submitWritingTest);

module.exports = router;
