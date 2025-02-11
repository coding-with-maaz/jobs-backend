const cloudinary = require('cloudinary').v2;
const AppError = require('../utils/appError');

class ImageService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  }

  async uploadImage(file, folder = 'profiles') {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto:good' }
        ]
      });

      return {
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (error) {
      throw new AppError('Image upload failed', 500);
    }
  }

  async deleteImage(publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new AppError('Image deletion failed', 500);
    }
  }
}

module.exports = new ImageService();