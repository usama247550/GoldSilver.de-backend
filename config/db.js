import mongoose from "mongoose";

const connectDataBase = async () => {
  const url = process.env.MONGODB_URL;

  try {
    await mongoose.connect(url);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("DB Connection Error:", error);
  }
};

export default connectDataBase;