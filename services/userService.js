// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// class UserService {
//   async createOrUpdateRegistration(userId, userData, step) {
//     try {
//       let user;
      
//       if (!userId) {
//         // First step - create new user
//         user = new User({
//           ...userData,
//           registrationStep: step
//         });
//       } else {
//         // Update existing registration
//         user = await User.findById(userId);
//         if (!user) {
//           throw new Error('Registration not found');
//         }

//         // Update user data
//         Object.assign(user, userData);
//         user.registrationStep = step;
//       }

//       await user.save();
//       return this._sanitizeUser(user);
//     } catch (error) {
//       throw new Error(`Registration step ${step} failed: ${error.message}`);
//     }
//   }

//   async completeRegistration(userId, password) {
//     try {
//       const user = await User.findById(userId);
//       if (!user) {
//         throw new Error('Registration not found');
//       }

//       // Validate required fields
//       if (!user.name || !user.email || !user.phone) {
//         throw new Error('Required fields are missing');
//       }

//       // Hash password and complete registration
//       const hashedPassword = await bcrypt.hash(password, 10);
//       user.password = hashedPassword;
//       user.registrationStep = 4;
//       user.registrationComplete = true;
      
//       await user.save();

//       // Generate token and return user data
//       const token = this._generateToken(user);
//       return {
//         token,
//         user: this._sanitizeUser(user)
//       };
//     } catch (error) {
//       throw new Error(`Registration completion failed: ${error.message}`);
//     }
//   }

//   async getAllUsers() {
//     return await User.find().select('-password').sort({ createdAt: -1 });
//   }

//   async getUserById(id) {
//     return await User.findById(id).select('-password');
//   }

//   async login(email, password) {
//     const user = await User.findOne({ email });
//     if (!user) {
//       throw new Error('Invalid credentials');
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       throw new Error('Invalid credentials');
//     }

//     const token = this._generateToken(user);
//     return {
//       token,
//       user: this._sanitizeUser(user)
//     };
//   }

//   async getProfile(userId) {
//     const user = await User.findById(userId)
//       .select('-password')
//       .populate({
//         path: 'savedJobs',
//         populate: {
//           path: 'category',
//           select: 'name icon color'
//         }
//       });
    
//     if (!user) {
//       throw new Error('User not found');
//     }
    
//     return user;
//   }

//   async updateProfile(userId, profileData) {
//     const allowedUpdates = [
//       'name',
//       'email',
//       'phone',
//       'location',
//       'bio',
//       'skills',
//       'experience',
//       'education'
//     ];
    
//     const sanitizedData = Object.keys(profileData)
//       .filter(key => allowedUpdates.includes(key))
//       .reduce((obj, key) => {
//         obj[key] = profileData[key];
//         return obj;
//       }, {});

//     const user = await User.findByIdAndUpdate(
//       userId,
//       sanitizedData,
//       { new: true, runValidators: true }
//     ).select('-password');
    
//     return user;
//   }

//   async saveJob(userId, jobId) {
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { $addToSet: { savedJobs: jobId } },
//       { new: true }
//     ).populate({
//       path: 'savedJobs',
//       populate: {
//         path: 'category',
//         select: 'name icon color'
//       }
//     });
//     return user.savedJobs;
//   }

//   async unsaveJob(userId, jobId) {
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { $pull: { savedJobs: jobId } },
//       { new: true }
//     ).populate({
//       path: 'savedJobs',
//       populate: {
//         path: 'category',
//         select: 'name icon color'
//       }
//     });
//     return user.savedJobs;
//   }

//   async deleteUser(id) {
//     await User.findByIdAndDelete(id);
//     return true;
//   }

//   _generateToken(user) {
//     return jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '30d' }
//     );
//   }

//   _sanitizeUser(user) {
//     const userObject = user.toObject();
//     delete userObject.password;
//     return userObject;
//   }
// }

// module.exports = new UserService();


const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
  async createOrUpdateRegistration(userId, userData, step) {
    try {
      let user;
      
      if (!userId) {
        // Create new user for step 2
        user = new User({
          ...userData,
          registrationStep: step
        });
      } else {
        // Update existing user for steps 2-3
        user = await User.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
        
        Object.assign(user, userData);
        user.registrationStep = step;
      }
  
      await user.save();
      console.log(`Step ${step} completed:`, user);
  
      return {
        userId: user._id,
        registrationStep: user.registrationStep
      };
    } catch (error) {
      console.error(`Step ${step} failed:`, error);
      throw error;
    }
  }
  
  async completeRegistration(userId, password) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Registration not found');
      }

      // Validate required fields
      if (!user.name || !user.email || !user.phone) {
        throw new Error('Required fields are missing');
      }

      // Hash password and complete registration
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.registrationStep = 4;
      user.registrationComplete = true;
      
      await user.save();

      // Generate token and return user data
      const token = this._generateToken(user);
      return {
        token,
        user: this._sanitizeUser(user)
      };
    } catch (error) {
      throw new Error(`Registration completion failed: ${error.message}`);
    }
  }

  async getAllUsers() {
    return await User.find().select('-password').sort({ createdAt: -1 });
  }

  async getUserById(id) {
    return await User.findById(id).select('-password');
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

  async deleteUser(id) {
    await User.findByIdAndDelete(id);
    return true;
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
