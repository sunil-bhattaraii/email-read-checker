import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not set. Add it to your .env file.");
}
const MONGODB_URI: string = process.env.MONGODB_URI;

declare global {
  var __mongooseCache:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

const cached = globalThis.__mongooseCache ?? { conn: null, promise: null };

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
