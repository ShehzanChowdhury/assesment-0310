import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}

interface MongooseConnectionCache {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use global cache in dev to prevent creating multiple connections during HMR
const globalWithMongoose = global as unknown as { __mongooseCache?: MongooseConnectionCache };

const cached: MongooseConnectionCache = globalWithMongoose.__mongooseCache || {
  connection: null,
  promise: null,
};

globalWithMongoose.__mongooseCache = cached;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      // Mongoose 8 uses stable defaults; no need for legacy options
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
      dbName: process.env.MONGODB_DB_NAME || undefined,
    });
  }

  cached.connection = await cached.promise;
  return cached.connection;
}


