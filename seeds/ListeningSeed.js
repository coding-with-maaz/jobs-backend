const mongoose = require('mongoose');
require('dotenv').config();
const Question = require('../models/Question');
const Section = require('../models/Section');
const Test = require('../models/Test');

const sampleData = {
  questions: [
    // Section 1
    {
      questionText: "What is the caller's name?",
      answerType: "short-answer",
      correctAnswer: "John Smith",
      instructions: "Write NO MORE THAN TWO WORDS"
    },
    {
      questionText: "What is the booking reference number?",
      answerType: "short-answer",
      correctAnswer: "AB123456",
      instructions: "Write NO MORE THAN EIGHT CHARACTERS"
    },
    {
      questionText: "What is the purpose of the call?",
      answerType: "multiple-choice",
      options: ["To make a complaint", "To book a room", "To change a reservation", "To request information"],
      correctAnswer: "To change a reservation",
      instructions: "Choose the correct option"
    },
    // Section 2
    {
      questionText: "Which facility is NOT available in the community center?",
      answerType: "multiple-choice",
      options: ["Swimming pool", "Gym", "Library", "Cafeteria"],
      correctAnswer: "Swimming pool",
      instructions: "Choose the correct option"
    },
    {
      questionText: "What time does the gym open on weekdays?",
      answerType: "short-answer",
      correctAnswer: "6:00",
      instructions: "Write the time in the format HH:MM"
    },
    {
      questionText: "Complete the table with the opening hours for each facility.",
      answerType: "table-completion",
      correctAnswer: "9:00",
      instructions: "Write the time in the format HH:MM for each answer",
      diagramUrl: "/uploads/diagrams/sample-table.png" // Sample diagram URL
    },
    // Section 3
    {
      questionText: "The research project focuses primarily on _____ in urban environments.",
      answerType: "sentence-completion",
      correctAnswer: "Urban planning",
      instructions: "Write NO MORE THAN TWO WORDS"
    },
    {
      questionText: "Match the researchers with their areas of specialization.",
      answerType: "matching",
      options: ["Dr. Smith - A. Transportation", "Dr. Jones - B. Housing", "Dr. Lee - C. Public spaces"],
      correctAnswer: "A,B,C",
      instructions: "Match the letters A-C with the appropriate names"
    },
    {
      questionText: "What methodology was used to collect data?",
      answerType: "multiple-choice",
      options: ["Interviews", "Surveys", "Observation", "Mixed methods"],
      correctAnswer: "Mixed methods",
      instructions: "Choose the correct option"
    },
    // Section 4
    {
      questionText: "What is the lecturer's area of expertise?",
      answerType: "short-answer",
      correctAnswer: "Marine biology",
      instructions: "Write NO MORE THAN TWO WORDS"
    },
    {
      questionText: "Label the diagram of the marine ecosystem.",
      answerType: "diagram-labelling",
      correctAnswer: "coral reef",
      instructions: "Write NO MORE THAN TWO WORDS for each answer",
      diagramUrl: "/uploads/diagrams/sample-ecosystem.png" // Sample diagram URL
    },
    {
      questionText: "Complete the notes about the lecture.",
      answerType: "notes-completion",
      correctAnswer: "biodiversity",
      instructions: "Write NO MORE THAN TWO WORDS for each answer"
    }
  ],
  sections: [
    {
      sectionName: "Section 1: Social Needs",
      questions: [] // Will be populated after questions are created
    },
    {
      sectionName: "Section 2: Community Information",
      questions: []
    },
    {
      sectionName: "Section 3: Academic Discussion",
      questions: []
    },
    {
      sectionName: "Section 4: Academic Lecture",
      questions: []
    }
  ],
  tests: [
    {
      testName: "IELTS Listening Practice Test 1",
      sections: [], // Will be populated after sections are created
      audioUrls: {
        "section1": "https://example.com/audio/section1.mp3",
        "section2": "https://example.com/audio/section2.mp3",
        "section3": "https://example.com/audio/section3.mp3",
        "section4": "https://example.com/audio/section4.mp3"
      }
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
    await Question.deleteMany({});
    await Section.deleteMany({});
    await Test.deleteMany({});
    console.log('Cleared existing data');

    // Create questions
    const createdQuestions = await Question.insertMany(sampleData.questions);
    console.log('Created questions');

    // Create sections with references to questions (3 questions per section)
    const sectionsWithQuestions = sampleData.sections.map((section, index) => ({
      ...section,
      questions: createdQuestions.slice(index * 3, (index * 3) + 3)
    }));
    const createdSections = await Section.insertMany(sectionsWithQuestions);
    console.log('Created sections');

    // Create test with references to sections and audio URLs
    const testWithSections = {
      ...sampleData.tests[0],
      sections: createdSections,
      audioUrls: new Map(Object.entries(sampleData.tests[0].audioUrls))
    };
    const createdTest = await Test.create(testWithSections);
    console.log('Created test');

    console.log('Database seeded successfully!');
    console.log(`Created ${createdQuestions.length} questions`);
    console.log(`Created ${createdSections.length} sections`);
    console.log(`Created 1 test with ${createdSections.length} sections`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();