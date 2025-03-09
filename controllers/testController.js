const Test = require('../models/Test');
const { calculateBandScore } = require('../utils/bandScoreCalculator');
const multer = require('multer');
const path = require('path');

// Configure multer for PDF storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/answer-sheets')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('answerSheet');

// Create test
exports.createTest = async (req, res) => {
  try {
    const test = new Test({
      ...req.body,
    });

    await test.save();
    res.status(201).json(test);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update test
exports.updateTest = async (req, res) => {
  try {
    const updatedTest = await Test.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTest) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(updatedTest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tests
exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find().populate({
      path: 'sections',
      populate: { path: 'questions' }
    });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get specific test by ID
exports.getTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate({
      path: 'sections',
      populate: { path: 'questions' }
    });
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit test
exports.submitTest = async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'File upload error: ' + err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { answers } = req.body;
      const test = await Test.findById(req.params.id).populate({
        path: 'sections',
        populate: { path: 'questions' }
      });

      if (!test) {
        return res.status(404).json({ message: 'Test not found' });
      }

      // Save PDF path if file was uploaded
      if (req.file) {
        test.answerSheetPDF = req.file.path;
        test.submissionDate = new Date();
        await test.save();
      }

      let totalScore = 0;
      let totalQuestions = 0;
      let attemptedQuestions = 0;
      const sectionScores = [];
      const questionResults = [];

      test.sections.forEach((section) => {
        let sectionScore = 0;
        let sectionAttempted = 0;
        const sectionQuestions = section.questions.length;
        const sectionResults = [];

        section.questions.forEach((question) => {
          const userAnswer = answers[question._id];
          const isAttempted = userAnswer !== undefined && userAnswer !== null && userAnswer.trim() !== '';
          const isCorrect = isAttempted && userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
          
          const status = isAttempted ? (isCorrect ? 'correct' : 'incorrect') : 'unattempted';
          
          if (isCorrect) {
            sectionScore++;
            totalScore++;
          }
          
          if (isAttempted) {
            sectionAttempted++;
            attemptedQuestions++;
          }
          
          sectionResults.push({
            questionId: question._id,
            questionText: question.questionText,
            userAnswer: userAnswer || '',
            correctAnswer: question.correctAnswer,
            isCorrect: isCorrect,
            isAttempted: isAttempted,
            status: status,
            answerType: question.answerType
          });
        });

        totalQuestions += sectionQuestions;
        sectionScores.push({
          sectionId: section._id,
          sectionName: section.sectionName,
          score: sectionScore,
          total: sectionQuestions,
          attempted: sectionAttempted,
          unattempted: sectionQuestions - sectionAttempted,
          percentage: (sectionScore / sectionQuestions) * 100,
          questions: sectionResults
        });

        questionResults.push(...sectionResults);
      });

      const bandScore = calculateBandScore(totalScore, totalQuestions);
      const completionRate = (attemptedQuestions / totalQuestions) * 100;
      let performanceLevel = '';

      if (bandScore >= 8.0) performanceLevel = 'Expert';
      else if (bandScore >= 7.0) performanceLevel = 'Very Good';
      else if (bandScore >= 6.0) performanceLevel = 'Competent';
      else if (bandScore >= 5.0) performanceLevel = 'Modest';
      else performanceLevel = 'Limited';

      let feedback = '';
      if (attemptedQuestions === totalQuestions) {
        feedback = 'You attempted all questions. Great job!';
      } else if (completionRate >= 90) {
        feedback = 'You attempted most questions. Try to answer all questions next time.';
      } else if (completionRate >= 75) {
        feedback = 'You missed several questions. Remember that unattempted questions count against your score.';
      } else if (completionRate >= 50) {
        feedback = 'You missed many questions. Time management might be an issue to work on.';
      } else {
        feedback = 'You missed most questions. Focus on improving your time management and attempting all questions.';
      }

      res.json({
        overallScore: {
          correct: totalScore,
          total: totalQuestions,
          attempted: attemptedQuestions,
          unattempted: totalQuestions - attemptedQuestions,
          percentage: (totalScore / totalQuestions) * 100,
          completionRate: completionRate,
          bandScore: bandScore,
          performanceLevel: performanceLevel,
          answerSheetPDF: test.answerSheetPDF
        },
        sectionScores: sectionScores,
        questionResults: questionResults,
        details: {
          totalQuestions,
          attemptedQuestions,
          unattemptedQuestions: totalQuestions - attemptedQuestions,
          correctAnswers: totalScore,
          incorrectAnswers: attemptedQuestions - totalScore
        },
        feedback: feedback,
        improvementAreas: getImprovementAreas(sectionScores)
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// Delete test by ID
exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to identify areas for improvement
function getImprovementAreas(sectionScores) {
  const weakestSections = sectionScores
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 2);

  return weakestSections.map(section => ({
    sectionName: section.sectionName,
    score: section.score,
    total: section.total,
    percentage: section.percentage,
    recommendation: `Focus on improving your ${section.sectionName.toLowerCase()} skills. Review your answers and practice more ${section.sectionName.toLowerCase()} exercises.`
  }));
}
