import { auth } from "./config";
import type { FastifyInstance } from "fastify";

/**
 * Mount better-auth handler on Fastify.
 * Handles all /api/auth/* routes including OAuth callbacks.
 */
export async function authPlugin(app: FastifyInstance) {
  // better-auth handler catches all /api/auth/* routes
  app.all("/api/auth/*", async (req, reply) => {
    // Convert Fastify request to Web Request for better-auth
    const url = `${req.protocol}://${req.hostname}${req.url}`;
    const webReq = new Request(url, {
      method: req.method,
      headers: new Headers(Object.entries(req.headers).map(([k, v]) => [k, String(v ?? "")])),
      body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
    });

    const response = await auth.handler(webReq);
    return reply.status(response.status).send(await response.json());
  });
}
