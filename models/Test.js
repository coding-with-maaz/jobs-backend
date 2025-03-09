const mongoose = require('mongoose');
const { Schema } = mongoose;

const testSchema = new Schema({
  testName: {
    type: String,
    required: true,
  },
  sections: [{
    type: Schema.Types.ObjectId,
    ref: 'Section',
  }],
  // Removed the audioUrls field as we are no longer handling file uploads
  // audioUrls: {
  //   type: Map,
  //   of: String,
  //   required: true,
  //   default: new Map()
  // }
  answerSheetPDF: {
    type: String,  // Store the PDF file path/URL
    required: false
  },
  submissionDate: {
    type: Date,
    default: null
  }
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
