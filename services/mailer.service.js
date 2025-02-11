const nodemailer = require('nodemailer');
const logger = require('../config/logger');
const AppError = require('../utils/appError');
const { createTransport } = require('../utils/smtp.utils');
const { chunkArray } = require('../utils/array.utils');

class MailerService {
  constructor() {
    this.transporter = createTransport();
    this.batchSize = 50; // Send emails in batches of 50
    this.delayBetweenBatches = 1000; // 1 second delay between batches
  }

  async sendBulkEmail(recipients, subject, template) {
    try {
      const chunks = chunkArray(recipients, this.batchSize);
      
      for (const chunk of chunks) {
        await Promise.all(
          chunk.map(recipient => this.sendEmail(recipient, subject, template))
        );
        
        if (chunks.indexOf(chunk) < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, this.delayBetweenBatches));
        }
      }
      
      logger.info(`Bulk email sent successfully to ${recipients.length} recipients`);
    } catch (error) {
      logger.error('Bulk email sending failed:', error);
      throw new AppError('Failed to send bulk email', 500);
    }
  }

  async sendEmail(to, subject, { html, text }) {
    try {
      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
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
      logger.error(`Email sending failed for ${to}:`, error);
      throw new AppError('Failed to send email', 500);
    }
  }
}

module.exports = new MailerService();