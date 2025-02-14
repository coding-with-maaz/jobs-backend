const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Step 1 (Optional)
  skills: [{
    type: String,
    trim: true
  }],
  
  // Step 2 (Required)
  name: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
  },
  
  // Step 3 (Optional)
  bio: {
    type: String,
    trim: true
  },
  
  // Step 4 (Required)
  password: {
    type: String,
  },
  
  // Additional fields
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  registrationStep: {
    type: Number,
    default: 1,
    min: 1,
    max: 4
  },
  registrationComplete: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    trim: true
  },
  experience: [{
    title: String,
    company: String,
    location: String,
    from: Date,
    to: Date,
    current: Boolean,
    description: String
  }],
  education: [{
    school: String,
    degree: String,
    field: String,
    from: Date,
    to: Date,
    current: Boolean
  }],
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  avatar: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
