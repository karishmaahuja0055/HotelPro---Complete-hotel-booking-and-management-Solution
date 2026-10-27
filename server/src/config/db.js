import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotelpro', {
      autoIndex: true,
    });
    console.log(`[MongoDB] Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection Failure: ${error.message}`);
    // Fallback notice for developer environment
    console.log('[Notice] For local execution without MongoDB, set MONGODB_URI in server/.env or MongoDB Atlas.');
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
