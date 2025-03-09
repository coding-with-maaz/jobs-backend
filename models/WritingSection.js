const mongoose = require('mongoose');
const { Schema } = mongoose;

const writingSectionSchema = new Schema({
  sectionName: {
    type: String,
    required: true, // Name of the section (e.g., Task 1, Task 2)
  },
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'WritingQuestion', // References to Writing Questions
  }]
});

const WritingSection = mongoose.model('WritingSection', writingSectionSchema);

module.exports = WritingSection;
