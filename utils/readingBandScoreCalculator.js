// Band score calculation based on IELTS Reading scoring system
function calculateBandScore(correctAnswers, totalQuestions, testType = 'academic') {
  const rawScore = correctAnswers;
  
  if (testType === 'academic') {
    // IELTS Academic Reading band score conversion table
    if (rawScore >= 39) return 9.0;
    if (rawScore >= 37) return 8.5;
    if (rawScore >= 35) return 8.0;
    if (rawScore >= 33) return 7.5;
    if (rawScore >= 30) return 7.0;
    if (rawScore >= 27) return 6.5;
    if (rawScore >= 23) return 6.0;
    if (rawScore >= 19) return 5.5;
    if (rawScore >= 15) return 5.0;
    if (rawScore >= 13) return 4.5;
    if (rawScore >= 10) return 4.0;
    if (rawScore >= 8) return 3.5;
    if (rawScore >= 6) return 3.0;
    if (rawScore >= 4) return 2.5;
    return 2.0;
  } else {
    // IELTS General Training Reading band score conversion table
    // Note: General Training has a slightly different conversion table
    if (rawScore >= 40) return 9.0;
    if (rawScore >= 39) return 8.5;
    if (rawScore >= 37) return 8.0;
    if (rawScore >= 36) return 7.5;
    if (rawScore >= 34) return 7.0;
    if (rawScore >= 32) return 6.5;
    if (rawScore >= 30) return 6.0;
    if (rawScore >= 27) return 5.5;
    if (rawScore >= 23) return 5.0;
    if (rawScore >= 19) return 4.5;
    if (rawScore >= 15) return 4.0;
    if (rawScore >= 12) return 3.5;
    if (rawScore >= 9) return 3.0;
    if (rawScore >= 6) return 2.5;
    return 2.0;
  }
}

// Calculate performance metrics for each section type
function calculateSectionMetrics(sectionScores) {
  const sectionTypes = {
    'Section 1': { name: 'Factual Information', scores: [] },
    'Section 2': { name: 'Analytical Reading', scores: [] },
    'Section 3': { name: 'Detailed Comprehension', scores: [] }
  };
  
  sectionScores.forEach(section => {
    const sectionNumber = section.sectionName.split(':')[0].trim();
    if (sectionTypes[sectionNumber]) {
      sectionTypes[sectionNumber].scores.push(section.percentage);
    }
  });
  
  const metrics = {};
  Object.keys(sectionTypes).forEach(key => {
    const scores = sectionTypes[key].scores;
    if (scores.length > 0) {
      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      metrics[key] = {
        name: sectionTypes[key].name,
        averageScore: average.toFixed(2)
      };
    }
  });
  
  return metrics;
}

module.exports = { calculateBandScore, calculateSectionMetrics };