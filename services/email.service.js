const nodemailer = require('nodemailer');
const logger = require('../config/logger');
const AppError = require('../utils/appError');
const { verificationTemplate, resetPasswordTemplate } = require('../templates/email.templates');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production'
      }
    });

    // Verify connection
    this.transporter.verify((error) => {
      if (error) {
        logger.error('SMTP Connection Error:', error);
      } else {
        logger.info('SMTP Server is ready to send emails');
      }
    });
  }

  async sendEmail(to, subject, html, text) {
    try {
      const mailOptions = {
        from: `"Security" <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        html,
        text,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High'
        }
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${to}`);
    } catch (error) {
      logger.error('Email sending failed:', error);
      throw new AppError('Failed to send email', 500);
    }
  }

  async sendVerificationEmail(to, token) {
    const verificationUrl = `${process.env.APP_URL}/verify-email/${token}`;
    const { html, text } = verificationTemplate(verificationUrl);
    await this.sendEmail(
      to,
      'Verify Your Email Address',
      html,
      text
    );
  }

  async sendPasswordResetEmail(to, token) {
    const resetUrl = `${process.env.APP_URL}/reset-password/${token}`;
    const { html, text } = resetPasswordTemplate(resetUrl);
    await this.sendEmail(
      to,
      'Password Reset Request',
      html,
      text
    );
  }
}

module.exports = new EmailService();