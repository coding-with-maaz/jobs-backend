const nodemailer = require('nodemailer');
const logger = require('../config/logger');

exports.createTransport = () => {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    pool: true, // Use pooled connections
    maxConnections: 5,
    maxMessages: 100,
    rateLimit: 5, // Max 5 messages per second
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production'
    }
  });

  transport.verify((error) => {
    if (error) {
      logger.error('SMTP Connection Error:', error);
    } else {
      logger.info('SMTP Server is ready to send emails');
    }
  });

  return transport;
};