const AuthService = require('../services/auth.service');
const TokenService = require('../services/token.service');
const EmailService = require('../services/email.service');
const logger = require('../config/logger');
const AppError = require('../utils/appError');

exports.register = async (req, res, next) => {
  try {
    const user = await AuthService.register(req.body);
    const verificationToken = await TokenService.createVerificationToken(user._id);
    await EmailService.sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      status: 'success',
      message: 'Registration successful. Please check your email to verify your account.'
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const tokenDoc = await TokenService.verifyToken(token, 'verification');
    
    if (!tokenDoc) {
      throw new AppError('Invalid or expired verification token', 400);
    }

    await AuthService.verifyEmail(tokenDoc.userId);
    await TokenService.invalidateTokens(tokenDoc.userId, 'verification');

    res.json({
      status: 'success',
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await AuthService.findUserByEmail(email);
    
    if (user) {
      const resetToken = await TokenService.createPasswordResetToken(user._id);
      await EmailService.sendPasswordResetEmail(email, resetToken);
      
      logger.info(`Password reset requested for user: ${user._id}`);
    }

    // Always return success to prevent email enumeration
    res.json({
      status: 'success',
      message: 'If an account exists with that email, a password reset link will be sent.'
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const tokenDoc = await TokenService.verifyToken(token, 'reset');
    if (!tokenDoc) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    await AuthService.resetPassword(tokenDoc.userId, password);
    await TokenService.invalidateTokens(tokenDoc.userId, 'reset');
    await TokenService.invalidateTokens(tokenDoc.userId, 'refresh');

    logger.info(`Password reset successful for user: ${tokenDoc.userId}`);

    res.json({
      status: 'success',
      message: 'Password reset successful. Please log in with your new password.'
    });
  } catch (error) {
    next(error);
  }
};