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

export async function connectDB(opts?: { timeoutMS?: number }): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const timeoutMS = opts?.timeoutMS ?? 5000;
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: timeoutMS,
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}
