// import mongoose from "mongoose";

// const connectDataBase = async () => {
//   const url = process.env.MONGODB_URL;
// console.log(MONGODB_URL);

//   if (!url) {
//     console.error("FATAL: MONGODB_URL environment variable is not set!");
//     process.exit(1);
//   }

//   try {
//     await mongoose.connect(url, {
//       serverSelectionTimeoutMS: 10000, // fail fast if Atlas unreachable
//     });
//     console.log("MongoDB Connected");
//   } catch (error) {
//     console.error("DB Connection Error:", error.message);
//     process.exit(1); // crash so Railway shows a failed deployment
//   }
// };

// export default connectDataBase;





// import mongoose from "mongoose";

// const connectDataBase = async () => {
//   const url = process.env.MONGODB_URL;
// console.log(url);

//   try {
//     await mongoose.connect(url);
//     console.log("MongoDB Connected");
//   } catch (error) {
//     console.log("DB Connection Error:", error);
//   }
// };

// export default connectDataBase;















// import mongoose from "mongoose";

// const MONGODB_URL = process.env.MONGODB_URL;
// console.log(MONGODB_URL);

// if (!MONGODB_URL) {
//   throw new Error("MONGODB_URL environment variable is not set!");
// }

// // Reuse the connection across warm serverless invocations instead of
// // reconnecting on every request.
// let cached = global._mongooseConn;
// if (!cached) {
//   cached = global._mongooseConn = { conn: null, promise: null };
// }

// const connectDataBase = async () => {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise = mongoose
//       .connect(MONGODB_URL, {
//         serverSelectionTimeoutMS: 10000,
//         bufferCommands: false, // fail immediately instead of queueing queries
//       })
//       .then((m) => {
//         console.log("MongoDB Connected");
//         return m;
//       })
//       .catch((err) => {
//         cached.promise = null; // allow the next call to retry
//         console.error("DB Connection Error:", err.message);
//         throw err;
//       });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// };

// export default connectDataBase;



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