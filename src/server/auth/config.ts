import { type DefaultSession, type NextAuthConfig } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

/**
 * Extend the session type to include user ID
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
    accessToken?: string;
  }
}

/**
 * NextAuth configuration
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
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },

      session: ({ session, token }) => {
    if (!token.sub) {
      console.warn('No user ID found in token');
    }  
    return {
      ...session,
      user: {
        ...session.user,
        id: token.sub ?? token.id ?? '',
      },
      accessToken: token.accessToken,
    };
  },
  },
} satisfies NextAuthConfig;
