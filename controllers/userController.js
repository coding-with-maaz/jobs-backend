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

class UserController {
  
  // Step 1: Register user (Skills only)
  async registerStep1(req, res) {
    try {
      const { skills } = req.body;
      const user = await userService.registerStep1({ skills });

      return res.status(201).json(user); // Return userId for next steps
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Step 2: Add basic information (Name, Phone, Email)
  async registerStep2(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId, name, phone, email } = req.body;
      if (!userId) return res.status(400).json({ message: "User ID is required" });

      const user = await userService.createOrUpdateRegistration(userId, { name, phone, email }, 2);

      return res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Step 3: Add Bio
  async registerStep3(req, res) {
    try {
      const { userId, bio } = req.body;
      if (!userId) return res.status(400).json({ message: "User ID is required" });

      const user = await userService.createOrUpdateRegistration(userId, { bio }, 3);

      return res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Step 4: Complete registration (Set Password)
  async registerStep4(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId, password } = req.body;
      if (!userId) return res.status(400).json({ message: "User ID is required" });

      const result = await userService.completeRegistration(userId, password);

      return res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
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
      const profile = await userService.getProfile(req.user._id);

      return res.json(profile);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  // Update User Profile
  async updateProfile(req, res) {
    try {
      const profile = await userService.updateProfile(req.user._id, req.body);

      return res.json(profile);
    } catch (error) {
      res.status(400).json({ message: error.message });
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
