const multer = require('multer');
const path = require('path');

// Set storage for PDF uploads
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'answer-sheets')); // Upload folder for answer sheets
  },
  filename: (req, file, cb) => {
    const fileName = `answerSheet_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  }
});

// Filter to accept only PDF files
const pdfUpload = multer({
  storage: pdfStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

module.exports = { pdfUpload };
