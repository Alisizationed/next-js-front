// src/env.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string() // Required in production
        : z.string().optional(), // Optional in development/test
    AUTH_KEYCLOAK_ID: z.string(),
    AUTH_KEYCLOAK_SECRET: z.string(),
    AUTH_KEYCLOAK_ISSUER: z.string(),
    AUTH_KEYCLOAK_API: z.string().url(), // Assuming this is a URL
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    OLLAMA_URL: z.string().url(), // Assuming this is a URL

    // NODE_TLS_REJECT_UNAUTHORIZED is a Node.js runtime flag, not typically validated here.
    // It's usually set directly in the environment where Node.js runs.
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_API_BASE_URL: z.string().url(), // Assuming this is a URL
    NEXT_PUBLIC_API_ACCOUNTS_BASE_URL: z.string().url(), // Assuming this is a URL
    NEXT_PUBLIC_API_URL: z.string().url(), // Assuming this is a URL
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_KEYCLOAK_ID: process.env.AUTH_KEYCLOAK_ID,
    AUTH_KEYCLOAK_SECRET: process.env.AUTH_KEYCLOAK_SECRET,
    AUTH_KEYCLOAK_ISSUER: process.env.AUTH_KEYCLOAK_ISSUER,
    AUTH_KEYCLOAK_API: process.env.AUTH_KEYCLOAK_API, // Add new server variable
    NODE_ENV: process.env.NODE_ENV,
    OLLAMA_URL: process.env.OLLAMA_URL, // Add new server variable
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_API_ACCOUNTS_BASE_URL: process.env.NEXT_PUBLIC_API_ACCOUNTS_BASE_URL, // Add new client variable
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // Add new client variable
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});