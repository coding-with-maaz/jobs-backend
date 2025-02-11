const crypto = require('crypto');
const Token = require('../models/Token');
const { hashToken } = require('../utils/crypto.utils');
const logger = require('../config/logger');

class TokenService {
  async createVerificationToken(userId) {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = hashToken(token);
    
    await Token.create({
      userId,
      token: hashedToken,
      type: 'verification',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    return token;
  }

  async createPasswordResetToken(userId) {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = hashToken(token);
    
    await Token.create({
      userId,
      token: hashedToken,
      type: 'reset',
      expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    });

    return token;
  }

  async verifyToken(token, type) {
    const hashedToken = hashToken(token);
    const tokenDoc = await Token.findOne({
      token: hashedToken,
      type,
      expires: { $gt: new Date() }
    });

    if (!tokenDoc) {
      logger.warn(`Invalid or expired ${type} token attempt`);
      return null;
    }

    return tokenDoc;
  }

  async invalidateTokens(userId, type) {
    await Token.deleteMany({ userId, type });
  }
}

module.exports = new TokenService();