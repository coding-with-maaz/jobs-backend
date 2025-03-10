const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AdminService {
  async register({ name, email, password, adminCode }) {
    console.log('Provided adminCode:', adminCode);
    console.log('Loaded from ENV:', process.env.ADMIN_REGISTRATION_CODE);

    if (adminCode !== process.env.ADMIN_REGISTRATION_CODE) {
      throw new Error('Invalid admin registration code');
    }

    const existingAdmin = await User.findOne({ 'personalInformation.email': email, role: 'admin' });
    if (existingAdmin) {
      throw new Error('Admin already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({
      personalInformation: {
        firstName: name,
        email
      },
      password: hashedPassword,
      role: 'admin',
      registrationStep: 4,
      registrationComplete: true
    });

    await admin.save();

    const token = this._generateToken(admin);
    return {
      token,
      admin: this._sanitizeAdmin(admin)
    };
  }

  async login(email, password) {
    const admin = await User.findOne({ 'personalInformation.email': email, role: 'admin' });
    if (!admin) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = this._generateToken(admin);
    return {
      token,
      admin: this._sanitizeAdmin(admin)
    };
  }

  async getProfile(adminId) {
    const admin = await User.findOne({ _id: adminId, role: 'admin' })
      .select('-password');
    
    if (!admin) {
      throw new Error('Admin not found');
    }
    
    return admin;
  }

  async updateProfile(adminId, profileData) {
    const allowedUpdates = [
      'name',
      'email'
    ];
    
    const sanitizedData = Object.keys(profileData)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = profileData[key];
        return obj;
      }, {});

    const admin = await User.findOneAndUpdate(
      { _id: adminId, role: 'admin' },
      sanitizedData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!admin) {
      throw new Error('Admin not found');
    }
    
    return admin;
  }

  _generateToken(admin) {
    return jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Shorter expiration for admin tokens
    );
  }

  _sanitizeAdmin(admin) {
    const adminObject = admin.toObject();
    delete adminObject.password;
    return adminObject;
  }
}

module.exports = new AdminService();
