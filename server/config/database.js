const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority',
      retryReads: true,
      maxPoolSize: 10,
      connectTimeoutMS: 5000
    };

    if (process.env.MONGODB_USER && process.env.MONGODB_PASSWORD) {
      options.user = process.env.MONGODB_USER;
      options.pass = process.env.MONGODB_PASSWORD;
    }

    await mongoose.connect(process.env.DATABASE_URL, options);
    console.log('MongoDB connected successfully');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });

    return true;

  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Please make sure MongoDB is running and accessible at:', process.env.DATABASE_URL);

    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      console.log('Running in development mode - continuing without MongoDB');
      return false;
    }

    throw error;
  }
};

module.exports = { connectDB };