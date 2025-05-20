const mongoose = require('mongoose');

/**
 * @description Initializes connection to MongoDB using the URI from environment variables
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  }
  catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Export database connection function
module.exports = connectDB;  