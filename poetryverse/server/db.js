import mongoose from 'mongoose';

// Local MongoDB Community Server (also usable from MongoDB Compass).
export const LOCAL_MONGODB_URI = 'mongodb://127.0.0.1:27017/poetryverse';

export function connectDatabase(uri = process.env.MONGODB_URI?.trim() || LOCAL_MONGODB_URI, options = {}) {
  return mongoose.connect(uri, { serverSelectionTimeoutMS: 10000, ...options });
}
