const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');

exports.protect = async (req, res, next) => {
  try {
    // 1. Check token existence
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    // 4. Check if user changed password after token was issued
    if (user.lastPasswordChange) {
      const tokenIssuedAt = decoded.iat * 1000;
      if (user.lastPasswordChange > tokenIssuedAt) {
        throw new AppError('Password was recently changed. Please log in again', 401);
      }
    }

    // 5. Check if user is still active
    if (!user.active) {
      throw new AppError('User account is deactivated', 401);
    }

    // 6. Check if user is verified
    if (!user.verified) {
      throw new AppError('Email not verified', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Permission denied', 403));
    }
    next();
  };
};

exports.isVerified = (req, res, next) => {
  if (!req.user.verified) {
    return next(new AppError('Email not verified', 403));
  }
  next();
};