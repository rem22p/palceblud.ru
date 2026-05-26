// ─── User ───
export type User = {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  country: string | null;
  createdAt: string;
};

export type UserPublic = Omit<User, "email">;

// ─── Auth ───
export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: UserPublic;
};

export type UpdateProfileRequest = {
  username?: string;
  bio?: string;
  country?: string;
};

// ─── Typing Session ───
export type TypingMode = "practice" | "lesson" | "multiplayer";
export type Language = "ru" | "en" | "code";

export type CreateSessionRequest = {
  mode: TypingMode;
  duration: number; // seconds
  wpm: number;
  accuracy: number; // 0..100
  rawWpm: number;
  consistency: number; // 0..100
  correctKeystrokes: number;
  totalKeystrokes: number;
  language: Language;
  textSnippet?: string; // first 200 chars of typed text
  lessonId?: string;
};

export type SessionResult = {
  id: string;
  userId: string;
  mode: TypingMode;
  duration: number;
  wpm: number;
  accuracy: number;
  rawWpm: number;
  consistency: number;
  correctKeystrokes: number;
  totalKeystrokes: number;
  language: Language;
  createdAt: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

// ─── Leaderboard ───
export type LeaderboardPeriod = "daily" | "weekly" | "monthly" | "all";

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  avatarUrl: string | null;
  wpm: number;
  accuracy: number;
  sessions: number;
};

// ─── Stats ───
export type StatsOverview = {
  totalSessions: number;
  bestWpm: number;
  avgWpm: number;
  avgAccuracy: number;
  totalTimeMinutes: number;
};

export type DailyStats = {
  date: string; // YYYY-MM-DD
  sessions: number;
  avgWpm: number;
  bestWpm: number;
  avgAccuracy: number;
};

// ─── Lessons ───
export type LessonDifficulty = "beginner" | "intermediate" | "advanced";

export type LessonStep = {
  title: string;
  description: string;
  text: string; // text to type
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  order: number;
  difficulty: LessonDifficulty;
  steps: LessonStep[];
};

export type LessonProgress = {
  lessonId: string;
  title: string;
  completed: boolean;
  bestWpm: number;
  bestAccuracy: number;
  attempts: number;
};

// ─── Multiplayer ───
export type RoomStatus = "waiting" | "playing" | "finished";

export type RoomInfo = {
  code: string;
  hostUsername: string;
  status: RoomStatus;
  playerCount: number;
  maxPlayers: number;
  duration: number;
  createdAt: string;
};

export type RoomResult = {
  userId: string;
  username: string;
  wpm: number;
  accuracy: number;
  placement: number;
};
