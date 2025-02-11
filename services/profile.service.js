const Profile = require('../models/Profile');
const User = require('../models/User');
const AppError = require('../utils/appError');
const { sanitizeUrl } = require('../utils/security.utils');

class ProfileService {
  async getProfile(userId, requestingUserId) {
    const profile = await Profile.findOne({ user: userId })
      .populate('user', 'email role verified');
    
    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    // Check visibility permissions
    if (profile.preferences.visibility === 'private' && 
        userId.toString() !== requestingUserId.toString()) {
      throw new AppError('Profile is private', 403);
    }
    
    return profile;
  }

  async updateProfile(userId, profileData) {
    // Sanitize URLs if present
    if (profileData.profileImage) {
      profileData.profileImage = sanitizeUrl(profileData.profileImage);
    }
    if (profileData.coverImage) {
      profileData.coverImage = sanitizeUrl(profileData.coverImage);
    }
    if (profileData.socialLinks) {
      Object.keys(profileData.socialLinks).forEach(key => {
        if (profileData.socialLinks[key]) {
          profileData.socialLinks[key] = sanitizeUrl(profileData.socialLinks[key]);
        }
      });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: profileData },
      { 
        new: true,
        runValidators: true,
        context: 'query'
      }
    );

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    return profile;
  }

  async searchProfiles(query) {
    const searchCriteria = {
      status: 'active',
      'preferences.visibility': 'public'
    };

    if (query.name) {
      const nameRegex = new RegExp(query.name, 'i');
      searchCriteria.$or = [
        { firstName: nameRegex },
        { lastName: nameRegex },
        { displayName: nameRegex }
      ];
    }

    if (query.location) {
      searchCriteria.$or = [
        { 'location.country': new RegExp(query.location, 'i') },
        { 'location.city': new RegExp(query.location, 'i') }
      ];
    }

    return Profile.find(searchCriteria)
      .select('-preferences -socialLinks')
      .populate('user', 'email verified')
      .limit(20);
  }

  async updateProfileStatus(userId, status) {
    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { status },
      { new: true }
    );

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    return profile;
  }

  async deleteProfile(userId) {
    const result = await Profile.deleteOne({ user: userId });
    if (result.deletedCount === 0) {
      throw new AppError('Profile not found', 404);
    }
  }
}

module.exports = new ProfileService();