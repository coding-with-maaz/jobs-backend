// Create a new speaking section with audio
exports.createSpeakingSection = async (req, res) => {
  try {
    const audioFile = req.file;
    if (!audioFile) {
      return res.status(400).json({ message: 'Audio file is required' });
    }

    const speakingSection = new SpeakingSection({
      sectionName: req.body.sectionName,
      audioFile: {
        filename: audioFile.filename,
        path: audioFile.path,
        mimetype: audioFile.mimetype
      }
    });

    await speakingSection.save();
    res.status(201).json(speakingSection);
  } catch (error) {
    // If there's an error, cleanup the uploaded file
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    res.status(400).json({ message: error.message });
  }
};

// Get all speaking sections
exports.getAllSpeakingSections = async (req, res) => {
  try {
    const speakingSections = await SpeakingSection.find().populate('questions');
    res.json(speakingSections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific speaking section by ID
exports.getSpeakingSection = async (req, res) => {
  try {
    const speakingSection = await SpeakingSection.findById(req.params.id).populate('questions');
    if (!speakingSection) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(speakingSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a speaking section by ID
exports.updateSpeakingSection = async (req, res) => {
  try {
    const section = await SpeakingSection.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // If there's a new audio file
    if (req.file) {
      // Delete the old audio file if it exists
      if (section.audioFile && section.audioFile.path) {
        await fs.unlink(section.audioFile.path).catch(console.error);
      }

      // Update with new audio file information
      section.audioFile = {
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype
      };
    }

    // Update other fields
    if (req.body.sectionName) {
      section.sectionName = req.body.sectionName;
    }

    const updatedSection = await section.save();
    res.json(updatedSection);
  } catch (error) {
    // If there's an error and a new file was uploaded, clean it up
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    res.status(500).json({ message: error.message });
  }
};

// Delete a speaking section by ID
exports.deleteSpeakingSection = async (req, res) => {
  try {
    const section = await SpeakingSection.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Delete the associated audio file if it exists
    if (section.audioFile && section.audioFile.path) {
      await fs.unlink(section.audioFile.path).catch(console.error);
    }

    await section.deleteOne();
    res.json({ message: 'Section deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};