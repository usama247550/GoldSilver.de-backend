import mongoose from "mongoose";

// Reuse the connection across warm serverless invocations
let cached = global._mongooseConn;

if (!cached) {
  cached = global._mongooseConn = {
    conn: null,
    promise: null,
  };
}

const connectDataBase = async () => {
  const MONGODB_URL = process.env.MONGODB_URL;

  if (!MONGODB_URL) {
    throw new Error("MONGODB_URL environment variable is not set!");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URL, {
        serverSelectionTimeoutMS: 10000,
        bufferCommands: false,
      })
      .then((m) => {
        console.log("MongoDB Connected");
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        console.error("DB Connection Error:", err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDataBase;