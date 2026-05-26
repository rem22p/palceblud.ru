import Fastify from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import { env } from "./env";
import { authRoutes } from "./modules/auth/routes";

const app = Fastify({
  logger: true,
});

// Plugins
await app.register(cors, {
  origin: env.CORS_ORIGIN,
  credentials: true,
});
await app.register(websocket);

// Routes
await app.register(authRoutes);

// Health check
app.get("/api/health", () => ({ status: "ok", timestamp: new Date().toISOString() }));

// Start
try {
  await app.listen({ port: env.PORT, host: env.HOST });
  console.log(`🚀 API running at http://${env.HOST}:${env.PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
