const mongoose = require('mongoose');
const { Schema } = mongoose;

const readingQuestionSchema = new Schema({
  questionText: {
    type: String,
    required: true,
  },
  answerType: {
    type: String,
    required: true,
    enum: [
      'multiple-choice',
      'true-false-not-given',
      'short-answer',
      'sentence-completion',
      'notes-completion',
      'summary-completion',
      'plan-completion',
      'diagram-completion',
      'table-completion',
      'chart-completion',
      'diagram-labelling',
      'classification',
      'matching-paragraphs',
      'matching'
    ],
  },
  options: {
    type: [String],
    default: undefined
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  instructions: {
    type: String
  },
  diagramUrl: {
    type: String
  },
  paragraphReference: {
    type: Number
  }
});

const ReadingQuestion = mongoose.model('ReadingQuestion', readingQuestionSchema);

module.exports = ReadingQuestion;
