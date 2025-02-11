const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
  async getAllUsers() {
    return await User.find().select('-password').sort({ createdAt: -1 });
  }

  async getUserById(id) {
    return await User.findById(id).select('-password');
  }

  async createUser(userData) {
    const { password, ...rest } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ ...rest, password: hashedPassword });
    await user.save();
    return this._sanitizeUser(user);
  }

  async updateUser(id, userData) {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    const user = await User.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true
    });
    return this._sanitizeUser(user);
  }

  async deleteUser(id) {
    await User.findByIdAndDelete(id);
    return true;
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = this._generateToken(user);
    return {
      token,
      user: this._sanitizeUser(user)
    };
  }

  async getProfile(userId) {
    const user = await User.findById(userId)
      .select('-password')
      .populate({
        path: 'savedJobs',
        populate: {
          path: 'category',
          select: 'name icon color'
        }
      });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  async saveJob(userId, jobId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedJobs: jobId } },
      { new: true }
    ).populate({
      path: 'savedJobs',
      populate: {
        path: 'category',
        select: 'name icon color'
      }
    });
    return user.savedJobs;
  }

  async unsaveJob(userId, jobId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedJobs: jobId } },
      { new: true }
    ).populate({
      path: 'savedJobs',
      populate: {
        path: 'category',
        select: 'name icon color'
      }
    });
    return user.savedJobs;
  }

  async updateProfile(userId, profileData) {
    const allowedUpdates = [
      'name',
      'email',
      'phone',
      'location',
      'bio',
      'skills',
      'experience',
      'education'
    ];
    
    const sanitizedData = Object.keys(profileData)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = profileData[key];
        return obj;
      }, {});

    const user = await User.findByIdAndUpdate(
      userId,
      sanitizedData,
      { new: true, runValidators: true }
    ).select('-password');
    
    return user;
  }

  _generateToken(user) {
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
  }

  _sanitizeUser(user) {
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  }
}

module.exports = new UserService();