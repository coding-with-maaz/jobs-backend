const mongoose = require('mongoose');
require('dotenv').config();
const ReadingQuestion = require('../models/ReadingQuestion');
const ReadingSection = require('../models/ReadingSection');
const ReadingTest = require('../models/ReadingTest');
const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const diagramDir = 'uploads/diagrams';
if (!fs.existsSync(diagramDir)) {
  fs.mkdirSync(diagramDir, { recursive: true });
}

const sampleData = {
  questions: [
    // Section 1
    {
      questionText: "According to the passage, what is the main cause of urban pollution?",
      answerType: "multiple-choice",
      options: ["Industrial emissions", "Vehicle exhaust", "Waste disposal", "Construction"],
      correctAnswer: "Vehicle exhaust",
      instructions: "Choose the correct option",
      paragraphReference: 2
    },
    {
      questionText: "The author suggests that public transportation can reduce carbon emissions by _____.",
      answerType: "sentence-completion",
      correctAnswer: "30 percent",
      instructions: "Write NO MORE THAN TWO WORDS AND/OR A NUMBER",
      paragraphReference: 3
    },
    {
      questionText: "The statement 'Urban planners prioritize green spaces in all new developments' is:",
      answerType: "true-false-not-given",
      options: ["True", "False", "Not Given"],
      correctAnswer: "False",
      instructions: "Choose TRUE if the statement agrees with the information, FALSE if it contradicts the information, or NOT GIVEN if there is no information on this",
      paragraphReference: 4
    },
    // Section 2
    {
      questionText: "Complete the table showing different renewable energy sources and their advantages.",
      answerType: "table-completion",
      correctAnswer: "cost-effective",
      instructions: "Write NO MORE THAN TWO WORDS for each answer",
      diagramUrl: "/uploads/diagrams/energy-table.png",
      paragraphReference: 2
    },
    {
      questionText: "Solar energy production has increased by _____ in the last decade.",
      answerType: "sentence-completion",
      correctAnswer: "300%",
      instructions: "Write the correct percentage",
      paragraphReference: 3
    },
    {
      questionText: "Which country is NOT mentioned as a leader in wind energy production?",
      answerType: "multiple-choice",
      options: ["Denmark", "Germany", "China", "Australia"],
      correctAnswer: "Australia",
      instructions: "Choose the correct option",
      paragraphReference: 4
    },
    // Section 3
    {
      questionText: "Match each researcher with their area of specialization.",
      answerType: "matching",
      options: ["Dr. Smith - A. Marine biology", "Dr. Jones - B. Evolutionary biology", "Dr. Lee - C. Conservation"],
      correctAnswer: "A,C,B",
      instructions: "Match the letters A-C with the appropriate names",
      paragraphReference: 2
    },
    {
      questionText: "The study of coral reefs shows that they can recover from bleaching if _____.",
      answerType: "sentence-completion",
      correctAnswer: "water temperatures stabilize",
      instructions: "Write NO MORE THAN THREE WORDS",
      paragraphReference: 5
    },
    {
      questionText: "Label the diagram of the marine ecosystem.",
      answerType: "diagram-labelling",
      correctAnswer: "coral polyps",
      instructions: "Write NO MORE THAN TWO WORDS for each answer",
      diagramUrl: "/uploads/diagrams/marine-ecosystem.png",
      paragraphReference: 6
    }
  ],
  sections: [
    {
      sectionName: "Section 1: Urban Planning and Environment",
      passageText: `Urban environments face numerous challenges in the 21st century. As cities continue to grow, the pressure on infrastructure and natural resources intensifies, creating complex problems for urban planners and policymakers.

      One of the most significant issues is pollution. Vehicle exhaust accounts for approximately 60% of urban air pollution, with industrial emissions making up another 30%. The remaining 10% comes from various sources including construction and waste management.

      Public transportation offers a promising solution to urban congestion and pollution. Studies show that efficient public transit systems can reduce carbon emissions by 30 percent in metropolitan areas. However, implementation requires significant investment and careful planning.

      While some cities have successfully integrated green spaces into their urban development plans, many urban planners still prioritize commercial development over environmental considerations. This approach often leads to concrete jungles with minimal natural elements.

      Sustainable urban development requires a balanced approach that considers economic growth alongside environmental protection. Cities like Copenhagen and Singapore demonstrate that it's possible to achieve this balance through innovative policies and community engagement.`,
      questions: [] // Will be populated after questions are created
    },
    {
      sectionName: "Section 2: Renewable Energy Sources",
      passageText: `The transition to renewable energy represents one of the most important shifts in modern energy policy. As fossil fuel reserves diminish and climate change concerns grow, alternative energy sources have gained significant attention from governments and industries worldwide.

      Solar energy has emerged as a leading renewable source due to its increasingly cost-effective implementation and minimal environmental impact. Modern photovoltaic cells can convert sunlight to electricity with efficiency rates approaching 25% in commercial applications, while experimental designs have achieved over 40% efficiency in laboratory settings.

      The growth in solar energy production has been remarkable, with global capacity increasing by 300% in the last decade alone. This expansion has been driven by both technological improvements and decreasing production costs, making solar increasingly competitive with traditional energy sources.

      Wind energy has also seen substantial growth, particularly in countries with favorable geographic conditions. Denmark now generates over 40% of its electricity from wind, while Germany and China lead in total wind power capacity. The development of offshore wind farms has opened new possibilities for energy generation in coastal regions.

      Hydroelectric power remains the largest source of renewable energy globally, accounting for approximately 16% of total electricity production. However, its growth potential is limited by geographic constraints and environmental concerns related to dam construction.

      Geothermal energy, though less widely implemented, offers promising opportunities for regions with appropriate geological features. Countries like Iceland and New Zealand have successfully harnessed geothermal energy for both electricity generation and direct heating applications.`,
      questions: []
    },
    {
      sectionName: "Section 3: Marine Biology Research",
      passageText: `Marine ecosystems face unprecedented threats from climate change, pollution, and overfishing. Recent research has focused on understanding these impacts and developing conservation strategies to protect vulnerable marine environments.

      The field draws expertise from various specializations. Dr. Smith has conducted groundbreaking research in marine biology, focusing on coral reef ecosystems. Dr. Lee's work in conservation has established new protected marine areas in the Pacific. Meanwhile, Dr. Jones has applied evolutionary biology principles to understand how marine species adapt to changing conditions.

      Ocean acidification represents one of the most serious threats to marine life. As atmospheric carbon dioxide levels increase, approximately 30% is absorbed by oceans, leading to decreased pH levels. This acidification particularly affects organisms that form calcium carbonate shells or skeletons, including corals, mollusks, and certain plankton species.

      Rising sea temperatures present another significant challenge. The frequency and severity of coral bleaching events have increased dramatically in recent decades. When water temperatures rise above normal levels for extended periods, corals expel their symbiotic algae, leading to bleaching and potential death.

      However, research indicates that coral reefs can recover from bleaching events if water temperatures stabilize and other stressors are minimized. Studies in the Great Barrier Reef have documented recovery in areas where protective measures have been implemented effectively.

      The structure of coral reef ecosystems is complex and highly interconnected. Coral polyps form the foundation, creating calcium carbonate structures that provide habitat for countless species. Symbiotic zooxanthellae algae live within the coral tissues, providing nutrients through photosynthesis while receiving shelter and carbon dioxide from the coral.

      Conservation efforts must address multiple threats simultaneously to be effective. Marine protected areas have shown promise when properly managed and enforced. Additionally, reducing carbon emissions, improving water quality, and implementing sustainable fishing practices are essential components of comprehensive marine conservation strategies.`,
      questions: []
    }
  ],
  tests: [
    {
      testName: "IELTS Academic Reading Practice Test 1",
      testType: "academic",
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
    await ReadingQuestion.deleteMany({});
    await ReadingSection.deleteMany({});
    await ReadingTest.deleteMany({});
    console.log('Cleared existing reading test data');

    // Create questions
    const createdQuestions = await ReadingQuestion.insertMany(sampleData.questions);
    console.log('Created reading questions');

    // Create sections with references to questions (3 questions per section)
    const sectionsWithQuestions = sampleData.sections.map((section, index) => ({
      ...section,
      questions: createdQuestions.slice(index * 3, (index * 3) + 3)
    }));
    const createdSections = await ReadingSection.insertMany(sectionsWithQuestions);
    console.log('Created reading sections');

    // Create test with references to sections
    const testWithSections = {
      ...sampleData.tests[0],
      sections: createdSections
    };
    const createdTest = await ReadingTest.create(testWithSections);
    console.log('Created reading test');

    console.log('Reading test database seeded successfully!');
    console.log(`Created ${createdQuestions.length} reading questions`);
    console.log(`Created ${createdSections.length} reading sections`);
    console.log(`Created 1 reading test with ${createdSections.length} sections`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding reading test database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();