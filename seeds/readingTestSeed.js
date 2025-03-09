const mongoose = require('mongoose');
const ReadingTest = require('../models/ReadingTest');
const ReadingSection = require('../models/ReadingSection');
const ReadingQuestion = require('../models/ReadingQuestion');
require('dotenv').config();

const readingTestData = [
  {
    testName: "Academic Reading Test 1",
    testType: "academic",
    timeLimit: 60,
    sections: [
      {
        sectionName: "The History of Tea",
        passageText: `Tea is one of the most popular beverages in the world. The history of tea dates back to ancient China, where it was first used as a medicinal drink. According to legend, in 2737 BC, the Chinese emperor Shen Nung was sitting beneath a tree while his servant boiled drinking water, when some leaves from the tree blew into the water. Shen Nung, a renowned herbalist, decided to try the infusion that his servant had accidentally created. The tree was a Camellia sinensis, and the resulting drink was what we now call tea.`,
        questions: [
          {
            questionText: "When was tea first discovered according to legend?",
            questionType: "short_answer",
            answerType: "short-answer",
            correctAnswer: "2737 BC",
            marks: 1
          },
          {
            questionText: "Who discovered tea according to the legend?",
            questionType: "short_answer",
            answerType: "short-answer",
            correctAnswer: "Shen Nung",
            marks: 1
          }
        ]
      },
      {
        sectionName: "Climate Change Impact",
        passageText: `Global climate change has already had observable effects on the environment. Glaciers have shrunk, ice on rivers and lakes is breaking up earlier, plant and animal ranges have shifted, and trees are flowering sooner. Effects that scientists had predicted in the past would result from global climate change are now occurring: loss of sea ice, accelerated sea level rise and longer, more intense heat waves.`,
        questions: [
          {
            questionText: "Name three effects of climate change mentioned in the passage.",
            questionType: "short_answer",
            answerType: "short-answer",
            correctAnswer: "shrinking glaciers, earlier ice breakup, shifting plant and animal ranges",
            marks: 3
          }
        ]
      },
      {
        sectionName: "Digital Revolution",
        passageText: `The Digital Revolution, also known as the Third Industrial Revolution, is the shift from mechanical and analog electronic technology to digital electronics and digital computing. The era started during the 1980s and is ongoing. The revolution fundamentally changed the way humans communicate and work.`,
        questions: [
          {
            questionText: "What is another name for the Digital Revolution?",
            questionType: "short_answer",
            answerType: "short-answer",
            correctAnswer: "Third Industrial Revolution",
            marks: 1
          }
        ]
      }
    ]
  },
  {
    testName: "General Training Reading Test 1",
    testType: "general",
    timeLimit: 60,
    sections: [
      {
        sectionName: "Workplace Safety Guidelines",
        passageText: `All employees must follow these basic safety guidelines: Always wear appropriate safety equipment, report any unsafe conditions immediately, keep work areas clean and organized, know emergency procedures, and attend all safety training sessions.`,
        questions: [
          {
            questionText: "List three workplace safety guidelines mentioned in the text.",
            questionType: "short_answer",
            answerType: "short-answer",
            correctAnswer: "wear safety equipment, report unsafe conditions, keep work areas clean",
            marks: 3
          }
        ]
      }
    ]
  }
];

async function seedReadingTests() {
  try {
    // Clear existing data
    await ReadingTest.deleteMany({});
    await ReadingSection.deleteMany({});
    await ReadingQuestion.deleteMany({});

    for (const testData of readingTestData) {
      const sectionIds = [];
      
      // Create sections and questions
      for (const sectionData of testData.sections) {
        const questionIds = [];
        
        // Create questions for each section
        for (const questionData of sectionData.questions) {
          const question = new ReadingQuestion(questionData);
          await question.save();
          questionIds.push(question._id);
        }
        
        // Create section with questions
        const section = new ReadingSection({
          sectionName: sectionData.sectionName,
          passageText: sectionData.passageText,
          questions: questionIds
        });
        await section.save();
        sectionIds.push(section._id);
      }
      
      // Create test with sections
      const test = new ReadingTest({
        testName: testData.testName,
        testType: testData.testType,
        timeLimit: testData.timeLimit,
        sections: sectionIds
      });
      await test.save();
    }
    
    console.log('Reading test data seeded successfully');
  } catch (error) {
    console.error('Error seeding reading test data:', error);
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
  return seedReadingTests();
})
.catch((error) => {
  console.error('MongoDB Atlas connection error:', error);
});
