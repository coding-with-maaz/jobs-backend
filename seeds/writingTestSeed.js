const mongoose = require('mongoose');
const WritingTest = require('../models/WritingTest');
const WritingSection = require('../models/WritingSection');
const WritingQuestion = require('../models/WritingQuestion');
require('dotenv').config();

const writingTestData = [
  {
    testName: "Academic Writing Test 1",
    sections: [
      {
        sectionName: "Task 1",
        questions: [
          {
            questionText: `The graph below shows the number of books read by men and women at different ages.
            
            Summarize the information by selecting and reporting the main features, and make comparisons where relevant.
            
            Write at least 150 words.`,
            answerType: "diagram-completion",
            correctAnswer: "Sample response discussing the trends in reading habits between men and women across age groups",
            instructions: "Spend about 20 minutes on this task",
            diagramUrl: "https://example.com/graphs/reading-habits.png"
          }
        ]
      },
      {
        sectionName: "Task 2",
        questions: [
          {
            questionText: `Some people think that governments should spend less money on arts and invest more in public health.
            
            To what extent do you agree or disagree with this statement?
            
            Give reasons for your answer and include any relevant examples from your own knowledge or experience.`,
            answerType: "short-answer",
            correctAnswer: "Sample response discussing the balance between arts funding and public health investment",
            instructions: "Write at least 250 words. Spend about 40 minutes on this task"
          }
        ]
      }
    ]
  },
  {
    testName: "General Training Writing Test 1",
    sections: [
      {
        sectionName: "Task 1",
        questions: [
          {
            questionText: `You recently stayed in a hotel and were not satisfied with the service.
            
            Write a letter to the hotel manager. In your letter:
            - explain why you were staying at the hotel
            - describe the problems you experienced
            - say what action you would like the manager to take`,
            answerType: "short-answer",
            correctAnswer: "Sample formal letter addressing hotel service issues",
            instructions: "Write at least 150 words. Spend about 20 minutes on this task."
          }
        ]
      },
      {
        sectionName: "Task 2",
        questions: [
          {
            questionText: `In many countries, the amount of crime committed by teenagers is increasing.
            
            What do you think are the causes of this problem and what solutions can you suggest?
            
            Give reasons for your answer and include any relevant examples from your own knowledge or experience.`,
            answerType: "short-answer",
            correctAnswer: "Sample essay discussing causes and solutions for teenage crime",
            instructions: "Write at least 250 words. Spend about 40 minutes on this task"
          }
        ]
      }
    ]
  }
];

async function seedWritingTests() {
  try {
    // Clear existing data
    await WritingTest.deleteMany({});
    await WritingSection.deleteMany({});
    await WritingQuestion.deleteMany({});

    for (const testData of writingTestData) {
      const sectionIds = [];
      
      // Create sections and questions
      for (const sectionData of testData.sections) {
        const questionIds = [];
        
        // Create questions for each section
        for (const questionData of sectionData.questions) {
          const question = new WritingQuestion(questionData);
          await question.save();
          questionIds.push(question._id);
        }
        
        // Create section with questions
        const section = new WritingSection({
          sectionName: sectionData.sectionName,
          questions: questionIds
        });
        await section.save();
        sectionIds.push(section._id);
      }
      
      // Create test with sections and empty audioUrls map
      const test = new WritingTest({
        testName: testData.testName,
        sections: sectionIds,
        audioUrls: new Map()
      });
      await test.save();
    }
    
    console.log('Writing test data seeded successfully');
  } catch (error) {
    console.error('Error seeding writing test data:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Connect to MongoDB Atlas and run the seed
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
  return seedWritingTests();
})
.catch((error) => {
  console.error('MongoDB Atlas connection error:', error);
});
