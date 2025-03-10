const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  },
  salary: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['fulltime', 'parttime', 'contract', 'internship']
  },  
  description: {
    type: String,
    required: true
  },
  requirements: [{
    type: String
  }],
  applicationUrl: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Add a static method to count jobs by category
jobSchema.statics.countByCategory = function(categoryId) {
  return this.countDocuments({ category: categoryId });
};

module.exports = mongoose.model('Job', jobSchema);
