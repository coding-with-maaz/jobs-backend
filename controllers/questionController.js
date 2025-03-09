const Question = require('../models/Question');
const fs = require('fs');
const path = require('path');

exports.createQuestion = async (req, res) => {
  try {
    // Handle diagram upload if present
    // let diagramUrl = null;
    // if (req.file) {
    //   diagramUrl = `/uploads/diagrams/${req.file.filename}`;
    // }

    const question = new Question({
      ...req.body,
      // diagramUrl
    });
    
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    // Clean up uploaded file if question creation fails
    // if (req.file) {
    //   fs.unlinkSync(req.file.path);
    // }
    res.status(400).json({ message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Update question fields
    question.questionText = req.body.questionText || question.questionText;
    question.answerType = req.body.answerType || question.answerType;
    question.options = req.body.options || question.options;
    question.correctAnswer = req.body.correctAnswer || question.correctAnswer;
    question.instructions = req.body.instructions || question.instructions;

    await question.save();
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateQuestionDiagram = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Commented out diagram-related code
    // res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Commented out diagram deletion code
    // if (question.diagramUrl) {
    //   const filePath = path.join(__dirname, '..', question.diagramUrl);
    //   if (fs.existsSync(filePath)) {
    //     fs.unlinkSync(filePath);
    //   }
    // }

    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
