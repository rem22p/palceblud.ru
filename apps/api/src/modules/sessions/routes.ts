import { FastifyInstance } from "fastify";
import { createSessionSchema, paginationSchema } from "@palceblud/shared";
import { db, schema } from "../../db";
import { eq, desc, and } from "drizzle-orm";

// Simple JWT decode (mirrors auth routes)
function getUserId(req: any): string | null {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return null;
  try {
    const payload = JSON.parse(Buffer.from(token, "base64url").toString("utf-8"));
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

export async function sessionRoutes(app: FastifyInstance) {
  // Save session result
  app.post("/api/sessions", async (req, reply) => {
    const userId = getUserId(req);

    const body = createSessionSchema.parse(req.body);

    const [session] = await db
      .insert(schema.typingSessions)
      .values({
        userId: userId ?? "00000000-0000-0000-0000-000000000000", // anonymous
        mode: body.mode,
        duration: body.duration,
        wpm: body.wpm,
        accuracy: body.accuracy,
        rawWpm: body.rawWpm,
        consistency: body.consistency,
        correctKeystrokes: body.correctKeystrokes,
        totalKeystrokes: body.totalKeystrokes,
        language: body.language,
        textSnippet: body.textSnippet ?? null,
        lessonId: body.lessonId ?? null,
      })
      .returning();

    return reply.status(201).send(session);
  });

  // Get session history
  app.get("/api/sessions", async (req) => {
    const query = paginationSchema.parse(req.query);
    const userId = getUserId(req);

    const where = userId
      ? eq(schema.typingSessions.userId, userId)
      : undefined;

    const [items, total] = await Promise.all([
      db
        .select()
        .from(schema.typingSessions)
        .where(where)
        .orderBy(desc(schema.typingSessions.createdAt))
        .limit(query.limit)
        .offset((query.page - 1) * query.limit),
      db.$count(schema.typingSessions, where),
    ]);

    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
    };
  });
}
