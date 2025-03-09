const WritingSection = require('../models/WritingSection');

// Create a new writing section
// Create a new writing section
exports.createWritingSection = async (req, res) => {
  try {
    console.log('Request Body:', req.body);  // Log the incoming request body
    
    if (!req.body.questions) {
      return res.status(400).json({ message: "Questions are required." });
    }

    let questions;
    try {
      questions = Array.isArray(req.body.questions)
        ? req.body.questions
        : JSON.parse(req.body.questions);  // Only parse if it's a stringified JSON
    } catch (parseError) {
      return res.status(400).json({ message: "Invalid JSON format for questions" });
    }

    const writingSection = new WritingSection({
      sectionName: req.body.sectionName,
      questions: questions,
    });

    await writingSection.save();
    res.status(201).json(writingSection);
  } catch (error) {
    console.error("Error creating section:", error);
    res.status(400).json({ message: error.message });
  }
};




// Get all writing sections
exports.getAllWritingSections = async (req, res) => {
  try {
    const writingSections = await WritingSection.find().populate('questions');
    res.json(writingSections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific writing section by ID
exports.getWritingSection = async (req, res) => {
  try {
    const writingSection = await WritingSection.findById(req.params.id).populate('questions');
    if (!writingSection) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(writingSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a writing section by ID
exports.updateWritingSection = async (req, res) => {
  try {
    const updatedSection = await WritingSection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Ensure it returns the updated document
    );
    if (!updatedSection) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(updatedSection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a writing section by ID
exports.deleteWritingSection = async (req, res) => {
  try {
    const deletedSection = await WritingSection.findByIdAndDelete(req.params.id);
    if (!deletedSection) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.status(204).send(); // No content to return on successful deletion
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
