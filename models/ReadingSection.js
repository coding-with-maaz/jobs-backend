const mongoose = require('mongoose');
const { Schema } = mongoose;

const readingSectionSchema = new Schema({
  sectionName: {
    type: String,
    required: true,
  },
  passageText: {
    type: String,
    required: true
  },
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'ReadingQuestion',
  }]
});

const ReadingSection = mongoose.model('ReadingSection', readingSectionSchema);

module.exports = ReadingSection;