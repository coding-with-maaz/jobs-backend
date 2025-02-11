const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    trim: true,
    required: true
  },
  lastName: {
    type: String,
    trim: true,
    required: true
  },
  displayName: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    maxLength: 500
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  location: {
    country: String,
    city: String
  },
  profileImage: {
    type: String,
    default: 'https://default-profile-image-url.com/default.jpg'
  },
  coverImage: {
    type: String,
    default: 'https://default-cover-image-url.com/default.jpg'
  },
  socialLinks: {
    website: String,
    twitter: String,
    linkedin: String,
    github: String
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    newsletter: {
      type: Boolean,
      default: true
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'connections'],
      default: 'public'
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
profileSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Index for faster queries
profileSchema.index({ user: 1 });
profileSchema.index({ status: 1 });

module.exports = mongoose.model('Profile', profileSchema);