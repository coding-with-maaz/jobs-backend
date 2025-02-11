const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token');
const { generateToken } = require('../utils/token.utils');
const { sendVerificationEmail, sendPasswordResetEmail } = require('./email.service');
const AppError = require('../utils/appError');

class AuthService {
  async register(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const user = new User(userData);
    const verificationToken = generateToken();
    user.verificationToken = verificationToken;
    await user.save();

    await sendVerificationEmail(user.email, verificationToken);
    return user;
  }

  async login(email, password) {
    const user = await User.findOne({ email }).select('+loginAttempts +lockUntil');
    
    // Check account lockout
    if (user?.lockUntil && user.lockUntil > Date.now()) {
      throw new AppError('Account is temporarily locked. Try again later', 423);
    }

    if (!user || !(await user.comparePassword(password))) {
      if (user) {
        await this.handleFailedLogin(user);
      }
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.verified) {
      throw new AppError('Please verify your email first', 401);
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      user.loginAttempts = 0;
      user.lockUntil = null;
      await user.save();
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(user),
      this.createRefreshToken(user._id)
    ]);

    return { accessToken, refreshToken, user };
  }

  async refreshToken(refreshToken) {
    const tokenDoc = await Token.findOne({ 
      token: refreshToken,
      type: 'refresh',
      expires: { $gt: Date.now() }
    }).populate('userId');

    if (!tokenDoc) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const accessToken = await this.createAccessToken(tokenDoc.userId);
    return { accessToken };
  }

  async handleFailedLogin(user) {
    user.loginAttempts = (user.loginAttempts || 0) + 1;
    
    if (user.loginAttempts >= 5) {
      user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes lockout
    }
    
    await user.save();
  }

  async createAccessToken(user) {
    return jwt.sign(
      { 
        userId: user._id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }

  async createRefreshToken(userId) {
    const token = generateToken();
    
    await Token.create({
      userId,
      token,
      type: 'refresh',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    return token;
  }

  async verifyEmail(token) {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      throw new AppError('Invalid verification token', 400);
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();
    return user;
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal user existence
      return;
    }

    const resetToken = generateToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(email, resetToken);
  }

  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Invalidate all existing sessions
    await Token.deleteMany({ userId: user._id });
  }

  async logout(userId, refreshToken) {
    await Token.deleteOne({ userId, token: refreshToken, type: 'refresh' });
  }

  async logoutAll(userId) {
    await Token.deleteMany({ userId });
  }
}

module.exports = new AuthService();