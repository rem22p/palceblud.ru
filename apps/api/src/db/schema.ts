import { pgTable, uuid, varchar, timestamp, text, integer, real, pgEnum } from "drizzle-orm/pg-core";

// ─── Enums ───
export const modeEnum = pgEnum("mode", ["practice", "lesson", "multiplayer"]);
export const languageEnum = pgEnum("language", ["ru", "en", "code"]);
export const roomStatusEnum = pgEnum("room_status", ["waiting", "playing", "finished"]);
export const difficultyEnum = pgEnum("difficulty", ["beginner", "intermediate", "advanced"]);

// ─── Users ───
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 24 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  avatarUrl: varchar("avatar_url", { length: 512 }),
  bio: text("bio"),
  country: varchar("country", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Typing Sessions ───
export const typingSessions = pgTable("typing_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  mode: modeEnum("mode").notNull(),
  duration: integer("duration").notNull(), // seconds
  wpm: real("wpm").notNull(),
  accuracy: real("accuracy").notNull(), // 0..100
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
  hostUserId: uuid("host_user_id")
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
  userId: uuid("user_id")
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
  steps: text("steps").notNull(), // JSON array of LessonStep
});

// ─── User Lesson Progress ───
export const userLessonProgress = pgTable("user_lesson_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
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
