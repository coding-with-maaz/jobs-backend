const mongoose = require('mongoose');
const { Schema } = mongoose;

const speakingSectionSchema = new Schema({
  sectionName: {
    type: String,
    required: true,
  },
  audioFile: {
    filename: String,
    path: String,
    mimetype: String
  }
}, {
  timestamps: true
});

const SpeakingSection = mongoose.model('SpeakingSection', speakingSectionSchema);

module.exports = SpeakingSection;