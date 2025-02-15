const userService = require('../services/userService');
const { validationResult } = require('express-validator');
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController {
  
  // Step 1: Register user (Skills only)
  async registerStep1(req, res) {
    try {
      const { skills } = req.body;
      
      if (!skills || !Array.isArray(skills)) {
        return res.status(400).json({
          error: true,
          message: 'Skills array is required'
        });
      }

      // Create new user with skills
      const user = new User({
        skills,
        registrationStep: 1,
        registrationComplete: false,
        personalInformation: {} // Initialize empty object
      });

      const savedUser = await user.save();

      return res.status(201).json({
        success: true,
        message: 'Skills saved successfully',
        data: {
          userId: savedUser._id,
          skills: savedUser.skills
        }
      });
    } catch (error) {
      console.error('Registration Step 1 Error:', error);
      return res.status(500).json({
        error: true,
        message: 'Registration failed. Please try again.'
      });
    }
  }

  // Step 2: Add basic information
  async registerStep2(req, res) {
    try {
      const { userId, firstName, lastName, email, phone, skills } = req.body;
      
      if (!userId) {
        return res.status(400).json({
          error: true,
          message: 'User ID is required'
        });
      }

      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: true,
          message: 'User not found'
        });
      }

      // Update user information
      user.personalInformation = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim()
      };
      user.registrationStep = 2;

      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Basic information saved successfully',
        data: {
          userId: user._id,
          firstName: user.personalInformation.firstName,
          lastName: user.personalInformation.lastName,
          email: user.personalInformation.email,
          phone: user.personalInformation.phone,
          skills: user.skills
        }
      });
    } catch (error) {
      console.error('Registration Step 2 Error:', error);
      return res.status(500).json({
        error: true,
        message: 'Registration failed. Please try again.',
        details: error.message
      });
    }
  }

  // Step 3: Add Bio
  async registerStep3(req, res) {
    try {
      const { userId, bio } = req.body;
      
      if (!userId) {
        return res.status(400).json({
          error: true,
          message: 'User ID is required'
        });
      }

      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: true,
          message: 'User not found'
        });
      }

      // Update user information
      user.bio = bio.trim();
      user.registrationStep = 3;

      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Bio saved successfully',
        data: {
          userId: user._id,
          bio: user.bio,
          skills: user.skills,
          firstName: user.personalInformation.firstName,
          lastName: user.personalInformation.lastName,
          email: user.personalInformation.email,
          phone: user.personalInformation.phone
        }
      });
    } catch (error) {
      console.error('Registration Step 3 Error:', error);
      return res.status(500).json({
        error: true,
        message: 'Registration failed. Please try again.',
        details: error.message
      });
    }
  }

  // Step 4: Complete registration (Set Password)
  async registerStep4(req, res) {
    try {
      const { userId, password } = req.body;
      
      if (!userId) {
        return res.status(400).json({
          error: true,
          message: 'User ID is required'
        });
      }

      if (!password || password.length < 6) {
        return res.status(400).json({
          error: true,
          message: 'Password must be at least 6 characters long'
        });
      }

      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: true,
          message: 'User not found'
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update user
      user.password = hashedPassword;
      user.registrationStep = 4;
      user.registrationComplete = true;

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        success: true,
        message: 'Registration completed successfully',
        data: {
          token,
          user: {
            userId: user._id,
            firstName: user.personalInformation.firstName,
            lastName: user.personalInformation.lastName,
            email: user.personalInformation.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      console.error('Registration Step 4 Error:', error);
      return res.status(500).json({
        error: true,
        message: 'Registration failed. Please try again.',
        details: error.message
      });
    }
  }

  // User Login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);

      return res.json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  // Get User Profile
  async getProfile(req, res) {
    try {
      const userId = req.user.id; // From auth middleware
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching profile'
      });
    }
  }

  // Update User Profile
  async updateProfile(req, res) {
    try {
      const userId = req.user.id; // From auth middleware
      const updateData = req.body;

      // Remove sensitive fields if they exist
      delete updateData.password;
      delete updateData._id;

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating profile'
      });
    }
  }

  // Save Job to User Profile
  async saveJob(req, res) {
    try {
      const savedJobs = await userService.saveJob(req.user._id, req.params.jobId);

      return res.json(savedJobs);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Unsave Job from User Profile
  async unsaveJob(req, res) {
    try {
      const savedJobs = await userService.unsaveJob(req.user._id, req.params.jobId);

      return res.json(savedJobs);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get All Users
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();

      return res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get User by ID
  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Delete User
  async deleteUser(req, res) {
    try {
      await userService.deleteUser(req.params.id);

      return res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new UserController();
