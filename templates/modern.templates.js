const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .content {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: #4F46E5;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      font-size: 0.875rem;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="email-container">
    ${content}
  </div>
</body>
</html>
`;

exports.newsletterTemplate = (content, unsubscribeUrl) => ({
  html: baseTemplate(`
    <div class="header">
      <h1 style="color: #4F46E5; margin: 0;">Newsletter</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>
        You received this email because you subscribed to our newsletter.
        <br>
        <a href="${unsubscribeUrl}" style="color: #666;">Unsubscribe</a>
      </p>
    </div>
  `),
  text: `
${content.replace(/<[^>]*>/g, '')}

To unsubscribe, visit: ${unsubscribeUrl}
  `
});

exports.announcementTemplate = (title, message, ctaText, ctaUrl) => ({
  html: baseTemplate(`
    <div class="header">
      <h1 style="color: #4F46E5; margin: 0;">${title}</h1>
    </div>
    <div class="content">
      ${message}
      ${ctaUrl ? `<div style="text-align: center;">
        <a href="${ctaUrl}" class="button">${ctaText}</a>
      </div>` : ''}
    </div>
  `),
  text: `
${title}

${message.replace(/<[^>]*>/g, '')}

${ctaUrl ? `${ctaText}: ${ctaUrl}` : ''}
  `
});