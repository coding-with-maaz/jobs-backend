const Joi = require('joi');

const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;

exports.updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50),
  lastName: Joi.string().trim().min(2).max(50),
  displayName: Joi.string().trim().min(2).max(50),
  bio: Joi.string().max(500),
  dateOfBirth: Joi.date().less('now'),
  gender: Joi.string().valid('male', 'female', 'other', 'prefer-not-to-say'),
  location: Joi.object({
    country: Joi.string().trim(),
    city: Joi.string().trim()
  }),
  profileImage: Joi.string().pattern(urlPattern).message('Invalid image URL format'),
  coverImage: Joi.string().pattern(urlPattern).message('Invalid image URL format'),
  socialLinks: Joi.object({
    website: Joi.string().uri(),
    twitter: Joi.string(),
    linkedin: Joi.string(),
    github: Joi.string()
  }),
  preferences: Joi.object({
    emailNotifications: Joi.boolean(),
    newsletter: Joi.boolean(),
    visibility: Joi.string().valid('public', 'private', 'connections')
  })
});