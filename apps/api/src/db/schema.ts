import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  integer,
  real,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";

// ─── Enums ───
export const modeEnum = pgEnum("mode", ["practice", "lesson", "multiplayer"]);
export const languageEnum = pgEnum("language", ["ru", "en", "code"]);
export const roomStatusEnum = pgEnum("room_status", ["waiting", "playing", "finished"]);
export const difficultyEnum = pgEnum("difficulty", ["beginner", "intermediate", "advanced"]);

// ─── Users (compatible with better-auth) ───
export const users = pgTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: varchar("image", { length: 512 }),
  username: varchar("username", { length: 24 }).unique(),
  bio: text("bio"),
  country: varchar("country", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Sessions (better-auth managed) ───
export const sessions = pgTable("session", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  token: varchar("token", { length: 255 }).unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Accounts (better-auth OAuth) ───
export const accounts = pgTable("account", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  accountId: varchar("account_id", { length: 255 }).notNull(),
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: varchar("password", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Verifications ───
export const verifications = pgTable("verification", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Typing Sessions ───
export const typingSessions = pgTable("typing_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 36 })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  mode: modeEnum("mode").notNull(),
  duration: integer("duration").notNull(),
  wpm: real("wpm").notNull(),
  accuracy: real("accuracy").notNull(),
  rawWpm: real("raw_wpm").notNull(),
  consistency: real("consistency").notNull(),
  correctKeystrokes: integer("correct_keystrokes").notNull(),
  totalKeystrokes: integer("total_keystrokes").notNull(),
  language: languageEnum("language").notNull(),
  textSnippet: text("text_snippet"),
  lessonId: uuid("lesson_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Multiplayer Rooms ───
export const multiplayerRooms = pgTable("multiplayer_rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 6 }).unique().notNull(),
  hostUserId: varchar("host_user_id", { length: 36 })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  status: roomStatusEnum("status").default("waiting").notNull(),
  textContent: text("text_content"),
  duration: integer("duration").notNull(),
  maxPlayers: integer("max_players").default(8).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Multiplayer Results ───
export const multiplayerResults = pgTable("multiplayer_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: uuid("room_id")
    .references(() => multiplayerRooms.id, { onDelete: "cascade" })
    .notNull(),
  userId: varchar("user_id", { length: 36 })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  wpm: real("wpm").notNull(),
  accuracy: real("accuracy").notNull(),
  placement: integer("placement").notNull(),
  finishedAt: timestamp("finished_at").defaultNow().notNull(),
});

// ─── Lessons ───
export const lessons = pgTable("lessons", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  difficulty: difficultyEnum("difficulty").default("beginner").notNull(),
  steps: text("steps").notNull(),
});

// ─── User Lesson Progress ───
export const userLessonProgress = pgTable("user_lesson_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 36 })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  lessonId: uuid("lesson_id")
    .references(() => lessons.id, { onDelete: "cascade" })
    .notNull(),
  completed: boolean("completed").default(false).notNull(),
  bestWpm: real("best_wpm").default(0).notNull(),
  bestAccuracy: real("best_accuracy").default(0).notNull(),
  attempts: integer("attempts").default(0).notNull(),
});
