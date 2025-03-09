const mongoose = require('mongoose');
require('dotenv').config();
const WritingQuestion = require('../models/WritingQuestion');
const WritingSection = require('../models/WritingSection');
const WritingTest = require('../models/WritingTest');
const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const diagramDir = 'uploads/diagrams';
if (!fs.existsSync(diagramDir)) {
  fs.mkdirSync(diagramDir, { recursive: true });
}

const sampleData = {
  questions: [
    // Section 1: Task 1 (Academic)
    {
      questionText: "Describe the graph below showing tourist visits from 2011 to 2014.",
      answerType: "diagram-completion",
      instructions: "Describe the graph and include the main trends.",
      diagramUrl: "/uploads/diagrams/tourist-visits.png",
      correctAnswer: "The graph shows a steady increase in tourism year after year." // Add correct answer
    },
    // Section 2: Task 2 (Essay)
    {
      questionText: "Do you agree or disagree with the following statement? 'Online education is the best way to learn.'",
      answerType: "short-answer",
      instructions: "Write your opinion and justify it.",
      correctAnswer: "Agree/Disagree" // Add correct answer
    },
    {
      questionText: "Some people believe that studying abroad is better for career prospects than studying in one's home country. Do you agree or disagree?",
      answerType: "short-answer",
      instructions: "Write your opinion and justify it.",
      correctAnswer: "Agree/Disagree" // Add correct answer
    }
  ],
  sections: [
    {
      sectionName: "Task 1: Academic Writing",
      questions: [] // Will be populated after questions are created
    },
    {
      sectionName: "Task 2: Essay Writing",
      questions: [] // Will be populated after questions are created
    }
  ],
  tests: [
    {
      testName: "IELTS Writing Practice Test 1",
      sections: [], // Will be populated after sections are created
      timeLimit: 60 // 60 minutes
    }
  ]
};

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await WritingQuestion.deleteMany({});
    await WritingSection.deleteMany({});
    await WritingTest.deleteMany({});
    console.log('Cleared existing writing test data');

    // Create questions
    const createdQuestions = await WritingQuestion.insertMany(sampleData.questions);
    console.log('Created writing questions');

    // Create sections with references to questions
    const sectionsWithQuestions = sampleData.sections.map((section, index) => ({
      ...section,
      questions: createdQuestions.slice(index * 1, (index * 1) + 1) // Adjust slicing based on questions per section
    }));
    const createdSections = await WritingSection.insertMany(sectionsWithQuestions);
    console.log('Created writing sections');

    // Create test with references to sections
    const testWithSections = {
      ...sampleData.tests[0],
      sections: createdSections
    };
    const createdTest = await WritingTest.create(testWithSections);
    console.log('Created writing test');

    console.log('Writing test database seeded successfully!');
    console.log(`Created ${createdQuestions.length} writing questions`);
    console.log(`Created ${createdSections.length} writing sections`);
    console.log(`Created 1 writing test with ${createdSections.length} sections`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding writing test database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
