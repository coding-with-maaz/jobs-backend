const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
  
  // Step 1: Create a new user (Assigns real user ID)
  async registerStep1(userData) {
    try {
      const user = new User({
        ...userData,
        registrationStep: 1,
        registrationComplete: false
      });

      await user.save();
      return { userId: user._id, registrationStep: user.registrationStep };
    } catch (error) {
      throw new Error(`Step 1 failed: ${error.message}`);
    }
  }

  // Step 2 & 3: Update user information
  async createOrUpdateRegistration(userId, userData, step) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      Object.assign(user, userData);
      user.registrationStep = step;

      await user.save();
      return { userId: user._id, registrationStep: user.registrationStep };
    } catch (error) {
      throw new Error(`Step ${step} failed: ${error.message}`);
    }
  }

  // Step 4: Finalize registration (Hash password & complete registration)
  async completeRegistration(userId, password) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      // Validate required fields before finalizing registration
      if (!user.name || !user.email || !user.phone) {
        throw new Error('Missing required information');
      }

      user.password = await bcrypt.hash(password, 10);
      user.registrationStep = 4;
      user.registrationComplete = true;

      await user.save();

      // Generate JWT token
      const token = this._generateToken(user);

      return { token, user: this._sanitizeUser(user) };
    } catch (error) {
      throw new Error(`Step 4 failed: ${error.message}`);
    }
  }

  // User login
  async login(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error('Invalid credentials');

      return { token: this._generateToken(user), user: this._sanitizeUser(user) };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  // Get user profile
  async getProfile(userId) {
    try {
      const user = await User.findById(userId).select('-password').populate('savedJobs');
      if (!user) throw new Error('User not found');

      return user;
    } catch (error) {
      throw new Error(`Profile fetch failed: ${error.message}`);
    }
  }

  // Update user profile
  async updateProfile(userId, profileData) {
    try {
      const allowedUpdates = ['name', 'email', 'phone', 'location', 'bio', 'skills', 'experience', 'education'];
      const sanitizedData = {};

      Object.keys(profileData).forEach(key => {
        if (allowedUpdates.includes(key)) sanitizedData[key] = profileData[key];
      });

      const user = await User.findByIdAndUpdate(userId, sanitizedData, { new: true, runValidators: true }).select('-password');
      if (!user) throw new Error('User not found');

      return user;
    } catch (error) {
      throw new Error(`Profile update failed: ${error.message}`);
    }
  }

  // Save job to user profile
  async saveJob(userId, jobId) {
    try {
      const user = await User.findByIdAndUpdate(userId, { $addToSet: { savedJobs: jobId } }, { new: true }).populate('savedJobs');
      if (!user) throw new Error('User not found');

      return user;
    } catch (error) {
      throw new Error(`Save job failed: ${error.message}`);
    }
  }

  // Unsave job from user profile
  async unsaveJob(userId, jobId) {
    try {
      const user = await User.findByIdAndUpdate(userId, { $pull: { savedJobs: jobId } }, { new: true }).populate('savedJobs');
      if (!user) throw new Error('User not found');

      return user;
    } catch (error) {
      throw new Error(`Unsave job failed: ${error.message}`);
    }
  }

  // Delete user
  async deleteUser(id) {
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) throw new Error('User not found');

      return true;
    } catch (error) {
      throw new Error(`Delete user failed: ${error.message}`);
    }
  }

  // Generate JWT token
  _generateToken(user) {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
  }

  // Remove sensitive user data before sending response
  _sanitizeUser(user) {
    const sanitizedUser = user.toObject();
    delete sanitizedUser.password;
    delete sanitizedUser.__v;
    return sanitizedUser;
  }
}

module.exports = new UserService();
