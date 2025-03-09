const ReadingTest = require('../models/ReadingTest');
const ReadingSection = require('../models/ReadingSection');
const ReadingQuestion = require('../models/ReadingQuestion');
const { calculateBandScore } = require('../utils/readingBandScoreCalculator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/answer-sheets';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Create unique filename
  }
});

// Create upload middleware
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Only PDF files are allowed');
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size of 10MB
}).single('answerSheet'); // 'answerSheet' is the field name for the file upload


exports.createReadingTest = async (req, res) => {
  try {
    const test = new ReadingTest(req.body);
    await test.save();
    res.status(201).json(test);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateReadingTest = async (req, res) => {
  try {
    const test = await ReadingTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Reading test not found' });
    }

    // Update test fields
    Object.keys(req.body).forEach(key => {
      test[key] = req.body[key];
    });

    await test.save();
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllReadingTests = async (req, res) => {
  try {
    const tests = await ReadingTest.find().populate({
      path: 'sections',
      populate: { path: 'questions' }
    });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReadingTest = async (req, res) => {
  try {
    const test = await ReadingTest.findById(req.params.id).populate({
      path: 'sections',
      populate: { path: 'questions' }
    });
    if (!test) {
      return res.status(404).json({ message: 'Reading test not found' });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReadingTest = async (req, res) => {
  try {
    const test = await ReadingTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Reading test not found' });
    }

    // Delete all associated sections and questions
    for (const sectionId of test.sections) {
      const section = await ReadingSection.findById(sectionId);
      if (section) {
        // Delete all questions in the section
        for (const questionId of section.questions) {
          const question = await ReadingQuestion.findById(questionId);
          if (question) {
            // Delete diagram if exists
            if (question.diagramUrl) {
              const filePath = path.join(__dirname, '..', question.diagramUrl);
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
            }
            await ReadingQuestion.findByIdAndDelete(questionId);
          }
        }
        await ReadingSection.findByIdAndDelete(sectionId);
      }
    }

    await ReadingTest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reading test and all associated sections and questions deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitReadingTest = async (req, res) => {
  try {
    // Handle the file upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err });
      }

      const { answers } = req.body;
      const test = await ReadingTest.findById(req.params.id).populate({
        path: 'sections',
        populate: { path: 'questions' }
      });

      if (!test) {
        return res.status(404).json({ message: 'Reading test not found' });
      }

      let totalScore = 0;
      let totalQuestions = 0;
      let attemptedQuestions = 0;
      const sectionScores = [];
      const questionResults = [];

      // Calculate scores for each section
      test.sections.forEach((section, index) => {
        let sectionScore = 0;
        let sectionAttempted = 0;
        const sectionQuestions = section.questions.length;
        const sectionResults = [];
        
        section.questions.forEach(question => {
          const userAnswer = answers[question._id];
          const isAttempted = userAnswer !== undefined && userAnswer !== null && userAnswer.trim() !== '';
          const isCorrect = isAttempted && userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
          
          // Status can be 'correct', 'incorrect', or 'unattempted'
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

      // Calculate overall band score based on correct answers
      const bandScore = calculateBandScore(totalScore, totalQuestions, test.testType);

      // Calculate completion rate
      const completionRate = (attemptedQuestions / totalQuestions) * 100;

      // Determine performance level based on band score
      let performanceLevel = '';
      if (bandScore >= 8.0) performanceLevel = 'Expert';
      else if (bandScore >= 7.0) performanceLevel = 'Very Good';
      else if (bandScore >= 6.0) performanceLevel = 'Competent';
      else if (bandScore >= 5.0) performanceLevel = 'Modest';
      else performanceLevel = 'Limited';

      // Provide feedback based on unattempted questions
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

      // Send the response with the uploaded answer sheet path
      res.json({
        overallScore: {
          correct: totalScore,
          total: totalQuestions,
          attempted: attemptedQuestions,
          unattempted: totalQuestions - attemptedQuestions,
          percentage: (totalScore / totalQuestions) * 100,
          completionRate: completionRate,
          bandScore: bandScore,
          performanceLevel: performanceLevel
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
        improvementAreas: getImprovementAreas(sectionScores),
        answerSheet: req.file ? req.file.path : null // Include the file path for the uploaded PDF
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to identify areas for improvement
function getImprovementAreas(sectionScores) {
  const weakestSections = sectionScores
    .map(section => ({
      sectionName: section.sectionName,
      percentage: section.percentage,
      unattemptedRate: (section.unattempted / section.total) * 100
    }))
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 2);

  const improvementAreas = [];

  weakestSections.forEach(section => {
    let advice = `Focus on improving your performance in ${section.sectionName}.`;
    
    if (section.unattemptedRate > 25) {
      advice += ` You left ${section.unattemptedRate.toFixed(0)}% of questions unattempted in this section. Work on time management.`;
    } else if (section.percentage < 50) {
      advice += ` Your accuracy in this section was low. Practice more with similar question types.`;
    }
    
    improvementAreas.push(advice);
  });

  // Add general advice
  if (improvementAreas.length === 0) {
    improvementAreas.push("Your performance was balanced across all sections. Continue practicing to maintain consistency.");
  }

  return improvementAreas;
}