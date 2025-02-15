const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Registration Step 1 (Skills)
  tempUserId: {
    type: String,
    required: true,
    unique: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  
  // Registration Step 2 (Basic Info)
  personalInformation: {
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  
  // Registration Step 3 (Bio)
  bio: {
    type: String,
    trim: true
  },
  
  // Registration Step 4 (Password)
  password: {
    type: String
  },
  
  // Additional fields
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
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  
  // Optional fields
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

// Add index for tempUserId
userSchema.index({ tempUserId: 1 });

// Add compound index for registration tracking
userSchema.index({ tempUserId: 1, registrationStep: 1 });

// Add method to update registration step
userSchema.methods.updateRegistrationStep = function(step) {
  this.registrationStep = step;
  if (step === 4) {
    this.registrationComplete = true;
  }
  return this.save();
};

// Add static method to find by tempUserId
userSchema.statics.findByTempId = function(tempUserId) {
  return this.findOne({ tempUserId });
};

// Pre-save middleware to handle email uniqueness
userSchema.pre('save', async function(next) {
  try {
    if (this.isModified('personalInformation.email')) {
      const existingUser = await this.constructor.findOne({
        'personalInformation.email': this.personalInformation.email,
        _id: { $ne: this._id }
      });
      
      if (existingUser) {
        throw new Error('Email already exists');
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);
