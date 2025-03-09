const mongoose = require('mongoose');
const SpeakingTest = require('../models/SpeakingTest');
require('dotenv').config();

const speakingTestData = [
  {
    testName: "IELTS Speaking Test 1",
    description: "This speaking test covers topics about your daily life, a cue card task about describing a place, and a discussion about urban development.",
    instructions: `This test has three parts:
    Part 1 (4-5 minutes): Introduction and interview about familiar topics
    Part 2 (3-4 minutes): Individual long turn - You will be given a task card and have 1 minute to prepare, then speak for 1-2 minutes
    Part 3 (4-5 minutes): Two-way discussion about more abstract aspects of Part 2 topics`,
    timeLimit: 15,
    audioPrompts: new Map([
      ['part1', '/uploads/speaking/test1/part1-intro.mp3'],
      ['part2', '/uploads/speaking/test1/part2-cue-card.mp3'],
      ['part3', '/uploads/speaking/test1/part3-discussion.mp3']
    ])
  },
  {
    testName: "IELTS Speaking Test 2",
    description: "This speaking test focuses on education, a cue card task about describing a memorable event, and a discussion about cultural celebrations.",
    instructions: `This test has three parts:
    Part 1 (4-5 minutes): Introduction and interview about familiar topics
    Part 2 (3-4 minutes): Individual long turn - You will be given a task card and have 1 minute to prepare, then speak for 1-2 minutes
    Part 3 (4-5 minutes): Two-way discussion about more abstract aspects of Part 2 topics`,
    timeLimit: 15,
    audioPrompts: new Map([
      ['part1', '/uploads/speaking/test2/part1-intro.mp3'],
      ['part2', '/uploads/speaking/test2/part2-cue-card.mp3'],
      ['part3', '/uploads/speaking/test2/part3-discussion.mp3']
    ])
  }
];

async function seedSpeakingTests() {
  try {
    // Clear existing data
    await SpeakingTest.deleteMany({});

    // Create tests
    for (const testData of speakingTestData) {
      const test = new SpeakingTest(testData);
      await test.save();
    }
    
    console.log('Speaking test data seeded successfully');
  } catch (error) {
    console.error('Error seeding speaking test data:', error);
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
  return seedSpeakingTests();
})
.catch((error) => {
  console.error('MongoDB Atlas connection error:', error);
});
