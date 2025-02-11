const { URL } = require('url');

exports.sanitizeUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    // Only allow specific protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Invalid protocol');
    }
    return url.toString();
  } catch (error) {
    throw new Error('Invalid URL provided');
  }
};

exports.validateImageUrl = (url) => {
  const validImageTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const lowercaseUrl = url.toLowerCase();
  return validImageTypes.some(type => lowercaseUrl.endsWith(type));
};