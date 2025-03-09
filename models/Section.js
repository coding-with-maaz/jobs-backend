const mongoose = require('mongoose');
const { Schema } = mongoose;

const sectionSchema = new Schema({
  sectionName: {
    type: String,
    required: true,
  },
  audio: {
    type: String, // Store the file path for audio
    required: false,
  },
  image: {
    type: String, // Store the file path for image
    required: false,
  },
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question',
  }]
});

const Section = mongoose.model('Section', sectionSchema);

module.exports = Section;
