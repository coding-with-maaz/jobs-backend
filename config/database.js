const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    // Retry logic
    setTimeout(connectDB, 5000);
  }

  mongoose.connection.on('error', err => {
    logger.error(`MongoDB connection error: ${err}`);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected. Attempting to reconnect...');
    setTimeout(connectDB, 5000);
  });
};

module.exports = connectDB;