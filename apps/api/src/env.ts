import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(8000),
  HOST: z.string().default("0.0.0.0"),
  DATABASE_URL: z.string().default("postgres://palceblud:palceblud@localhost:5432/palceblud"),
  JWT_SECRET: z.string().default("dev-secret-change-in-production"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
});

export const env = envSchema.parse(process.env);
