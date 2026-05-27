import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "../db";
import { env } from "../env";
import * as schema from "../db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID || "github_client_id_placeholder",
      clientSecret: env.GITHUB_CLIENT_SECRET || "github_client_secret_placeholder",
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID || "google_client_id_placeholder",
      clientSecret: env.GOOGLE_CLIENT_SECRET || "google_client_secret_placeholder",
    },
  },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: false,
      },
      avatarUrl: {
        type: "string",
        required: false,
      },
      bio: {
        type: "string",
        required: false,
      },
      country: {
        type: "string",
        required: false,
      },
    },
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
});
