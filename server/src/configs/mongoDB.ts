import mongoose, { type ConnectOptions } from "mongoose";
import env from "#configs/env.js";
import logger from "#configs/logger.js";

mongoose.connection.on("connected", () => {
  logger.info("Connected to MongoDB");
});

mongoose.connection.on("disconnected", () => {
  logger.info("Disconnected from MongoDB");
});

mongoose.connection.on("error", (error) => {
  logger.error("MongoDB connection error:", error);
});

const mongoOptions: ConnectOptions = {
  minPoolSize: 5,
  maxPoolSize: 20,

  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  heartbeatFrequencyMS: 10000,

  retryWrites: true,
};

const connectDB = async (
  retries: number = 5,
  delay: number = 2000,
): Promise<void> => {
  const MONGODB_URI = env.MONGODB_URI;

  try {
    await mongoose.connect(MONGODB_URI, mongoOptions);
  } catch (error) {
    if (retries === 0) {
      logger.error("MongoDB connection failed. No retries left.");
      process.exit(1);
    }

    logger.warn(
      `Retrying MongoDB connection in ${delay / 1000}s (${retries} retries left)...`,
    );
    logger.error(error);

    await new Promise((resolve) => setTimeout(resolve, delay));
    await connectDB(retries - 1, delay);
  }
};

export const disconnectDB = async () => await mongoose.disconnect();

export default connectDB;
