import { Redis } from "ioredis";
import env from "#configs/env.js";
import logger from "#configs/logger.js";

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  retryStrategy: (times: number) => Math.min(times * 50, 2000),
});

redis.on("error", (err: Error) => {
  logger.error("Redis error", err);
});

redis.on("end", () => {
  logger.warn("Redis connection closed");
});

export const checkRedis = async () => {
  try {
    const pong = await redis.ping();

    if (pong !== "PONG") {
      throw new Error("Invalid Redis ping response");
    }

    logger.info("Redis ping successful");
  } catch (err) {
    logger.error("Redis health check failed", err);
    throw err;
  }
};

export const disconnectRedis = async () => {
  await redis.disconnect();
};

export default redis;
