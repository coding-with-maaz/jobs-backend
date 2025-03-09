const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const readingTestController = require('../controllers/readingTestController');

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/answer-sheets';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Create unique filename
  }
});

// Create upload middleware
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Only PDF files are allowed');
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size of 10MB
}).single('answerSheet'); // 'answerSheet' is the field name for the file upload

// Routes
router.post('/', readingTestController.createReadingTest);
router.put('/:id', readingTestController.updateReadingTest);
router.get('/', readingTestController.getAllReadingTests);
router.get('/:id', readingTestController.getReadingTest);
router.delete('/:id', readingTestController.deleteReadingTest);

// Updated submit route to include file upload handling
router.post('/:id/submit', upload, readingTestController.submitReadingTest);

module.exports = router;
