const mongoose = require('mongoose');
const { Schema } = mongoose;

const writingTestSchema = new Schema({
  testName: {
    type: String,
    required: true, 
  },
  sections: [{
    type: Schema.Types.ObjectId,
    ref: 'WritingSection', 
  }],
  audioUrls: {
    type: Map,
    of: String, 
    required: true,
    default: new Map(),
  },
  answerSheet: { // New field to store answer sheet PDF path
    type: String,
  },
});


const WritingTest = mongoose.model('WritingTest', writingTestSchema);

module.exports = WritingTest;
