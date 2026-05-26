import { z } from "zod";

// ─── Auth ───
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Минимум 3 символа")
    .max(24, "Максимум 24 символа")
    .regex(/^[a-zA-Z0-9_]+$/, "Только латиница, цифры и _"),
  email: z.string().email("Некорректный email").max(255),
  password: z.string().min(8, "Минимум 8 символов").max(128),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Пароль обязателен"),
});

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(24).regex(/^[a-zA-Z0-9_]+$/).optional(),
  bio: z.string().max(500).optional(),
  country: z.string().max(100).optional(),
});

// ─── Sessions ───
export const createSessionSchema = z.object({
  mode: z.enum(["practice", "lesson", "multiplayer"]),
  duration: z.number().int().min(1).max(3600),
  wpm: z.number().min(0).max(300),
  accuracy: z.number().min(0).max(100),
  rawWpm: z.number().min(0).max(300),
  consistency: z.number().min(0).max(100),
  correctKeystrokes: z.number().int().min(0),
  totalKeystrokes: z.number().int().min(0),
  language: z.enum(["ru", "en", "code"]),
  textSnippet: z.string().max(500).optional(),
  lessonId: z.string().uuid().optional(),
});

// ─── Query ───
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
