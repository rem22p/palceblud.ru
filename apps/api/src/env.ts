import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(8000),
  HOST: z.string().default("0.0.0.0"),
  DATABASE_URL: z.string().default("postgres://neon_placeholder"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  // OAuth
  GITHUB_CLIENT_ID: z.string().default(""),
  GITHUB_CLIENT_SECRET: z.string().default(""),
  GOOGLE_CLIENT_ID: z.string().default(""),
  GOOGLE_CLIENT_SECRET: z.string().default(""),
  // Auth
  BETTER_AUTH_SECRET: z.string().default("dev-secret-change-in-production"),
  BETTER_AUTH_URL: z.string().default("http://localhost:8000"),
});

export const env = envSchema.parse(process.env);
