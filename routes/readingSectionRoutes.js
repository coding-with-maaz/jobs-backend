const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const readingSectionController = require('../controllers/readingSectionController');
const mongoose = require('mongoose');
const fs = require('fs');

// Set up multer storage and file filtering
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Audio and Image file upload handling
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit for files
  fileFilter: (req, file, cb) => {
    console.log('File Original Name:', file.originalname);
    console.log('File MIME Type:', file.mimetype);

    const allowedTypes = /jpeg|jpg|png|mp3|wav/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    // Allow mp3 MIME type (audio/mpeg) and other image formats
    const mimetype = /jpeg|jpg|png|audio\/mpeg|mp3|wav/.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    
    // If file type is not allowed, return error
    cb(new Error('Invalid file type. Only JPEG, PNG, MP3, and WAV files are allowed.'));
  }  
}).fields([
  { name: 'audio', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]);

// Middleware to handle file upload errors
const handleFileUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Multer error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Create Reading Section with audio and image upload
router.post('/', upload, handleFileUploadError, readingSectionController.createReadingSection);

// Get all reading sections
router.get('/', readingSectionController.getAllReadingSections);

// Get a specific reading section by ID
router.get('/:id', readingSectionController.getReadingSection);

// Update a reading section by ID
router.put('/:id', upload, handleFileUploadError, readingSectionController.updateReadingSection);

// Delete a reading section by ID
router.delete('/:id', readingSectionController.deleteReadingSection);

module.exports = router;
