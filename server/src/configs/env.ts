import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(8080),

  NODE_ENV: z.enum(["development", "production"]).default("development"),

  ORIGIN: z
    .string()
    .min(1, "ORIGIN is required")
    .default("http://localhost:5173"),

  JWT_SECRET_KEY: z.string().min(1, "JWT_SECRET_KEY is required"),

  REDIS_URL: z
    .string()
    .min(1, "REDIS_URL is required")
    .default("redis://127.0.0.1:6379"),

  GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is required"),

  BREVO_API_KEY: z.string().min(1, "BREVO_API_KEY is required"),

  MONGODB_URI: z
    .string()
    .min(1, "MONGODB_URI is required")
    .default("mongodb://127.0.0.1:27017/note-book"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables");
  console.error(parsed.error.message);
  process.exit(1);
}

const env = {
  ...parsed.data,
  isProd: parsed.data.NODE_ENV === "production",
};

export default env;
