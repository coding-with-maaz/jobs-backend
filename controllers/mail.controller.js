const MailerService = require('../services/mailer.service');
const { newsletterTemplate, announcementTemplate } = require('../templates/modern.templates');
const logger = require('../config/logger');

exports.sendNewsletter = async (req, res, next) => {
  try {
    const { recipients, subject, content } = req.body;
    const template = newsletterTemplate(
      content,
      `${process.env.APP_URL}/unsubscribe`
    );

    await MailerService.sendBulkEmail(recipients, subject, template);

    res.json({
      status: 'success',
      message: `Newsletter sent to ${recipients.length} recipients`
    });
  } catch (error) {
    next(error);
  }
};

exports.sendAnnouncement = async (req, res, next) => {
  try {
    const { recipients, title, message, ctaText, ctaUrl } = req.body;
    const template = announcementTemplate(title, message, ctaText, ctaUrl);

    await MailerService.sendBulkEmail(recipients, title, template);

    res.json({
      status: 'success',
      message: `Announcement sent to ${recipients.length} recipients`
    });
  } catch (error) {
    next(error);
  }
};