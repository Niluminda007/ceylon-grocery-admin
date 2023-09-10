import mongoose, { ConnectOptions, mongo } from "mongoose";
import { reduceEachTrailingCommentRange } from "typescript";

let isConnected = false;

export const connectToDB = async (): Promise<void> => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("MongoDB is already connected");
    reduceEachTrailingCommentRange;
  }
  try {
    const options: ConnectOptions = {
      dbName: "ceylong_grocery",
    };
    await mongoose.connect(process.env.MONGODB_URI as string, options);
    isConnected = true;
    console.log("Mongodb connected");
  } catch (error) {
    console.log(error);
  }
};
