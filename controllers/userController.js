// const userService = require('../services/userService');
// const { validationResult } = require('express-validator');

// class UserController {
//   // Step 1: Add skills (Optional)
//   async registerStep1(req, res) {
//     try {
//       const { skills } = req.body;
//       const user = await userService.createOrUpdateRegistration(null, { skills }, 1);
//       res.status(201).json(user);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   }

//   // Step 2: Basic Information (Required)
//   async registerStep2(req, res) {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }

//       const { userId } = req.params;
//       const { name, phone, email } = req.body;
//       const user = await userService.createOrUpdateRegistration(userId, { name, phone, email }, 2);
//       res.json(user);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   }

//   // Step 3: Bio (Optional)
//   async registerStep3(req, res) {
//     try {
//       const { userId } = req.params;
//       const { bio } = req.body;
//       const user = await userService.createOrUpdateRegistration(userId, { bio }, 3);
//       res.json(user);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   }

//   // Step 4: Password (Required)
//   async registerStep4(req, res) {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }

//       const { userId } = req.params;
//       const { password } = req.body;
//       const user = await userService.completeRegistration(userId, password);
//       res.json(user);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   }

//   async login(req, res) {
//     try {
//       const { email, password } = req.body;
//       const result = await userService.login(email, password);
//       res.json(result);
//     } catch (error) {
//       res.status(401).json({ message: error.message });
//     }
//   }

//   async getProfile(req, res) {
//     try {
//       const profile = await userService.getProfile(req.user._id);
//       res.json(profile);
//     } catch (error) {
//       res.status(404).json({ message: error.message });
//     }
//   }

//   async updateProfile(req, res) {
//     try {
//       const profile = await userService.updateProfile(req.user._id, req.body);
//       res.json(profile);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   }

//   async saveJob(req, res) {
//     try {
//       const savedJobs = await userService.saveJob(req.user._id, req.params.jobId);
//       res.json(savedJobs);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   }

//   async unsaveJob(req, res) {
//     try {
//       const savedJobs = await userService.unsaveJob(req.user._id, req.params.jobId);
//       res.json(savedJobs);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   }

//   async getAllUsers(req, res) {
//     try {
//       const users = await userService.getAllUsers();
//       res.json(users);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   }

//   async getUserById(req, res) {
//     try {
//       const user = await userService.getUserById(req.params.id);
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
//       res.json(user);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   }

//   async deleteUser(req, res) {
//     try {
//       await userService.deleteUser(req.params.id);
//       res.json({ message: 'User deleted successfully' });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   }
// }

// module.exports = new UserController();


const userService = require('../services/userService');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class UserController {
  // Step 1: Add skills (Optional)
  async registerStep1(req, res) {
    try {
      const { skills } = req.body;
      
      // Store skills in a temporary object or session
      const tempUserData = { skills };
      
      // Return a temporary user ID or session ID
      const tempUserId = mongoose.Types.ObjectId(); // Generate a temporary ID
      res.status(201).json({ tempUserId, skills });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Step 2: Basic Information (Required)
  async registerStep2(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { tempUserId } = req.params; // Use the temporary ID from step 1
      const { name, phone, email, skills } = req.body;
  
      // Create the user document with all required fields
      const user = await userService.createOrUpdateRegistration(tempUserId, { name, phone, email, skills }, 2);
      
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Step 3: Bio (Optional)
  async registerStep3(req, res) {
    try {
      const { userId } = req.params;
      const { bio } = req.body;
      const user = await userService.createOrUpdateRegistration(userId, { bio }, 3);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Step 4: Complete Registration (Required)
  async registerStep4(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      console.log('Step 4 Request:', {
        userId: req.params.userId,
        body: req.body
      });

      const { userId } = req.params;
      const { password, name, email, phone, skills, bio } = req.body;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      // Find the existing user document
      const user = await User.findById(userId);
      console.log('Found User:', user);

      if (!user) {
        return res.status(404).json({ 
          message: 'User not found',
          userId: userId
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update user with final registration data
      user.password = hashedPassword;
      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.skills = skills || user.skills || [];
      user.bio = bio || user.bio || '';
      user.registrationStep = 4;
      user.registrationComplete = true;

      const savedUser = await user.save();
      console.log('Saved User:', savedUser);

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const response = {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          skills: user.skills,
          bio: user.bio
        }
      };

      console.log('Response:', response);
      res.json(response);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ 
        message: 'Registration failed',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  async getProfile(req, res) {
    try {
      const profile = await userService.getProfile(req.user._id);
      res.json(profile);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const profile = await userService.updateProfile(req.user._id, req.body);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async saveJob(req, res) {
    try {
      const savedJobs = await userService.saveJob(req.user._id, req.params.jobId);
      res.json(savedJobs);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async unsaveJob(req, res) {
    try {
      const savedJobs = await userService.unsaveJob(req.user._id, req.params.jobId);
      res.json(savedJobs);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      await userService.deleteUser(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new UserController();
