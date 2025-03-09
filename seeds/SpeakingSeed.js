const mongoose = require('mongoose');
require('dotenv').config();
const SpeakingSection = require('../models/SpeakingSection');
const SpeakingTest = require('../models/SpeakingTest');
const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const audioDir = 'uploads/audio';
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const sampleData = {
  sections: [
    {
      sectionName: "Part 1: Introduction and Interview",
      audioFile: {
        filename: "part1_intro.mp3",
        path: path.join(audioDir, "part1_intro.mp3"),
        mimetype: "audio/mpeg"
      }
    },
    {
      sectionName: "Part 2: Individual Long Turn",
      audioFile: {
        filename: "part2_cue_card.mp3",
        path: path.join(audioDir, "part2_cue_card.mp3"),
        mimetype: "audio/mpeg"
      }
    },
    {
      sectionName: "Part 3: Two-way Discussion",
      audioFile: {
        filename: "part3_discussion.mp3",
        path: path.join(audioDir, "part3_discussion.mp3"),
        mimetype: "audio/mpeg"
      }
    }
  ],
  tests: [
    {
      testName: "IELTS Speaking Practice Test 1",
      timeLimit: 15, // 15 minutes total
      audioFile: {
        filename: "full_test_1.mp3",
        path: path.join(audioDir, "full_test_1.mp3"),
        mimetype: "audio/mpeg"
      }
    },
    {
      testName: "IELTS Speaking Practice Test 2",
      timeLimit: 15,
      audioFile: {
        filename: "full_test_2.mp3",
        path: path.join(audioDir, "full_test_2.mp3"),
        mimetype: "audio/mpeg"
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
    await SpeakingSection.deleteMany({});
    await SpeakingTest.deleteMany({});
    console.log('Cleared existing speaking test data');

    // Create sections
    const createdSections = await SpeakingSection.insertMany(sampleData.sections);
    console.log('Created speaking sections');

    // Create tests with references to sections
    const testsWithSections = sampleData.tests.map(test => ({
      ...test,
      sections: createdSections // Each test includes all sections
    }));
    const createdTests = await SpeakingTest.insertMany(testsWithSections);
    console.log('Created speaking tests');

    console.log('Speaking test database seeded successfully!');
    console.log(`Created ${createdSections.length} speaking sections`);
    console.log(`Created ${createdTests.length} speaking tests`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding speaking test database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();