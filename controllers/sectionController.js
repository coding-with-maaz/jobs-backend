const Section = require('../models/Section');
const path = require('path');

exports.createSection = async (req, res) => {
  try {
    // Get the uploaded files
    const audio = req.files?.audio ? req.files.audio[0].path : null;
    const image = req.files?.image ? req.files.image[0].path : null;

    // Parse questions if sent as a JSON string; otherwise default to an empty array
    let questions = [];
    if (req.body.questions) {
      try {
        questions = JSON.parse(req.body.questions);
      } catch (parseError) {
        console.error("Error parsing questions:", parseError);
        return res.status(400).json({ message: "Invalid questions format" });
      }
    }

    const section = new Section({
      sectionName: req.body.sectionName,
      audio: audio,
      image: image,
      questions: questions,
    });

    await section.save();
    res.status(201).json(section);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllSections = async (req, res) => {
  try {
    const sections = await Section.find().populate('questions');
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id).populate('questions');
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    // If questions is provided as a string, parse it into an array.
    if (req.body.questions && typeof req.body.questions === 'string') {
      try {
        req.body.questions = JSON.parse(req.body.questions);
      } catch (parseError) {
        console.error("Error parsing questions:", parseError);
        return res.status(400).json({ message: "Invalid questions format" });
      }
    }
    
    const section = await Section.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(section);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
