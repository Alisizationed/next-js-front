/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

/**
 * Extend the session and JWT token types to include additional fields.
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
    accessToken?: string;
    error?: string;
  }

  interface JWT {
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
    sub?: string;
    error?: string;
  }
}

/**
 * NextAuth configuration with Keycloak and refresh token handling.
 */
export const authConfig = {
  providers: [
    KeycloakProvider({
      clientId: process.env.AUTH_KEYCLOAK_ID!,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET!,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER!,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, account }) {
      // On initial login
      if (account) {
        return {
          ...token,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at: account.expires_at, // Keycloak returns seconds
        };
      }

      // If token is still valid, return it
      if (Date.now() < (token.expires_at ?? 0) * 1000) {
        return token;
      }

      // If no refresh token available
      if (!token.refresh_token) {
        console.warn("Missing refresh token, cannot refresh access_token");
        return { ...token, error: "RefreshTokenMissing" };
      }

      // Refresh token logic
      try {
        const response = await fetch(
          `${process.env.AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              client_id: process.env.AUTH_KEYCLOAK_ID!,
              client_secret: process.env.AUTH_KEYCLOAK_SECRET!,
              grant_type: "refresh_token",
              refresh_token: token.refresh_token,
            }),
          }
        );

        const refreshedTokens = await response.json();

        if (!response.ok) {
          throw new Error(refreshedTokens.error_description ?? "Token refresh failed");
        }

        return {
          ...token,
          access_token: refreshedTokens.access_token,
          expires_at: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
          refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
        };
      } catch (error) {
        console.error("Error refreshing token:", error);
        return { ...token, error: "RefreshTokenError" };
      }
    },

    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub ?? "",
        },
        accessToken: token.access_token,
        error: token.error,
      };
    },
  },
} satisfies NextAuthConfig;
