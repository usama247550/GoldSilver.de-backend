import mongoose from "mongoose";

const connectDataBase = async () => {
  const url = process.env.MONGODB_URL 
  // const url = "mongodb+srv://Usama:usama12345@cluster0.eow2fes.mongodb.net/GoldSilver-de?retryWrites=true&w=majority"
// const url = "mongodb://Usama:usama12345@cluster0-shard-00-00.eow2fes.mongodb.net:27017,cluster0-shard-00-01.eow2fes.mongodb.net:27017,cluster0-shard-00-02.eow2fes.mongodb.net:27017/GoldSilver-de?ssl=true&replicaSet=atlas-xxxxxx-shard-0&authSource=admin&retryWrites=true&w=majority"


  try {
    await mongoose.connect(url);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("DB Connection Error:", error);
  }
};

export default connectDataBase;