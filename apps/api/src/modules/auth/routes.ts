import { FastifyInstance } from "fastify";
import { registerSchema, loginSchema, updateProfileSchema } from "@palceblud/shared";
import { db, schema } from "../db";
import { eq } from "drizzle-orm";

// Simple JWT sign/verify (in production use jose or similar)
// For now, using a simple base64-encoded JSON token
function signToken(userId: string): string {
  const payload = { sub: userId, iat: Date.now() };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function verifyToken(token: string): { sub: string } | null {
  try {
    const json = Buffer.from(token, "base64url").toString("utf-8");
    return JSON.parse(json) as { sub: string };
  } catch {
    return null;
  }
}

// Inline bcrypt (browser-compatible)
async function hashPassword(password: string): Promise<string> {
  // Simple sha256-based hash for now — replace with bcrypt/argon2 in production
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "palceblud-salt");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const hashed = await hashPassword(password);
  return hashed === storedHash;
}

export async function authRoutes(app: FastifyInstance) {
  // Register
  app.post("/api/auth/register", async (req, reply) => {
    const body = registerSchema.parse(req.body);

    // Check existing
    const existing = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, body.email))
      .limit(1);

    if (existing.length > 0) {
      return reply.status(409).send({ error: "Email already registered" });
    }

    const passwordHash = await hashPassword(body.password);
    const [user] = await db
      .insert(schema.users)
      .values({
        username: body.username,
        email: body.email,
        passwordHash,
      })
      .returning();

    const token = signToken(user.id);

    return reply.status(201).send({
      token,
      user: {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        country: user.country,
        createdAt: user.createdAt.toISOString(),
      },
    });
  });

  // Login
  app.post("/api/auth/login", async (req, reply) => {
    const body = loginSchema.parse(req.body);

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, body.email))
      .limit(1);

    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const token = signToken(user.id);

    return reply.send({
      token,
      user: {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        country: user.country,
        createdAt: user.createdAt.toISOString(),
      },
    });
  });

  // Get current user
  app.get("/api/auth/me", async (req) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) throw { statusCode: 401, message: "Unauthorized" };

    const decoded = verifyToken(token);
    if (!decoded) throw { statusCode: 401, message: "Invalid token" };

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, decoded.sub))
      .limit(1);

    if (!user) throw { statusCode: 404, message: "User not found" };

    return {
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      country: user.country,
      createdAt: user.createdAt.toISOString(),
    };
  });
}
