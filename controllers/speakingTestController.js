const SpeakingTest = require('../models/SpeakingTest');
const fs = require('fs').promises;

// Create a new speaking test with audio
exports.createSpeakingTest = async (req, res) => {
  try {
    const audioFile = req.file;
    const speakingTest = new SpeakingTest({
      ...req.body,
      audioFile: audioFile ? {
        filename: audioFile.filename,
        path: audioFile.path,
        mimetype: audioFile.mimetype
      } : undefined
    });

    await speakingTest.save();
    res.status(201).json(speakingTest);
  } catch (error) {
    // If there's an error, cleanup the uploaded file
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    res.status(400).json({ message: error.message });
  }
};

// Get all speaking tests
exports.getAllSpeakingTests = async (req, res) => {
  try {
    const speakingTests = await SpeakingTest.find().populate({
      path: 'sections',
      populate: { path: 'questions' }
    });
    res.json(speakingTests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific speaking test by ID
exports.getSpeakingTest = async (req, res) => {
  try {
    const speakingTest = await SpeakingTest.findById(req.params.id).populate({
      path: 'sections',
      populate: { path: 'questions' }
    });
    if (!speakingTest) {
      return res.status(404).json({ message: 'Speaking Test not found' });
    }
    res.json(speakingTest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a speaking test by ID
exports.updateSpeakingTest = async (req, res) => {
  try {
    const test = await SpeakingTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Speaking Test not found' });
    }

    // If there's a new audio file
    if (req.file) {
      // Delete the old audio file if it exists
      if (test.audioFile && test.audioFile.path) {
        await fs.unlink(test.audioFile.path).catch(console.error);
      }

      // Update with new audio file information
      test.audioFile = {
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype
      };
    }

    // Update other fields
    Object.keys(req.body).forEach(key => {
      test[key] = req.body[key];
    });

    const updatedTest = await test.save();
    const populatedTest = await updatedTest.populate({
      path: 'sections',
      populate: { path: 'questions' }
    });

    res.json(populatedTest);
  } catch (error) {
    // If there's an error and a new file was uploaded, clean it up
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    res.status(500).json({ message: error.message });
  }
};

// Delete a speaking test by ID
exports.deleteSpeakingTest = async (req, res) => {
  try {
    const test = await SpeakingTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Speaking Test not found' });
    }

    // Delete the associated audio file if it exists
    if (test.audioFile && test.audioFile.path) {
      await fs.unlink(test.audioFile.path).catch(console.error);
    }

    await test.deleteOne();
    res.json({ message: 'Speaking Test deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit a speaking test with audio response
exports.submitSpeakingTest = async (req, res) => {
  try {
    const audioFile = req.file;
    if (!audioFile) {
      return res.status(400).json({ message: 'Audio response is required' });
    }

    // Here you can add additional logic for processing the submission
    // For example, storing the submission in a separate collection
    // or implementing grading logic

    res.json({ 
      message: 'Test submitted successfully',
      audioFile: {
        filename: audioFile.filename,
        path: audioFile.path
      }
    });
  } catch (error) {
    // If there's an error, cleanup the uploaded file
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    res.status(500).json({ message: error.message });
  }
};