import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import type {} from "next-auth/jwt";

// Type extensions for NextAuth
declare module "next-auth" {
  interface User {
    access?: string;
    expiry?: number;
    cookies?: string | null;
  }

  interface Session {
    access?: string;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access?: string;
    expiry?: number;
    error?: string;
    cookies?: string | null;
  }
}

const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: "include",
          },
        );

        const setCookieHeader = res.headers.get("set-cookie");
        const data = await res.json();

        if (!res.ok) {
          const errorMessage =
            data.detail ||
            data.error ||
            data.non_field_errors?.[0] ||
            "Invalid credentials";
          throw new Error(errorMessage);
        }

        return {
          id: email,
          email,
          access: data.access,
          expiry: Date.now() + 28 * 60 * 1000,
          cookies: setCookieHeader,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        access: token.access,
        error: token.error,
      };
    },
    async jwt({ token, user }) {
      //debugging logs
      if (token.expiry) {
        const currentTime = new Date();
        const expiryTime = new Date(token.expiry);
        const minutesRemaining = Math.floor(
          (expiryTime.getTime() - currentTime.getTime()) / 60000,
        );
        const secondsRemaining = Math.floor(
          ((expiryTime.getTime() - currentTime.getTime()) % 60000) / 1000,
        );

        console.log(
          `Token expires in ${minutesRemaining}m ${secondsRemaining}s`,
        );
      }

      // New user sign-in
      if (user) {
        return {
          ...token,
          access: user.access,
          expiry: user.expiry,
          cookies: user.cookies,
        };
      }

      // Check token expiration
      const isExpired =
        !token.expiry ||
        typeof token.expiry !== "number" ||
        Date.now() >= token.expiry;

      // Return current token if still valid
      if (!isExpired) {
        return token;
      }

      // Handle token refresh
      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (token.cookies) {
          headers["Cookie"] = token.cookies;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/token/refresh/`,
          {
            method: "POST",
            headers,
            credentials: "include",
          },
        );

        const newCookieHeader = res.headers.get("set-cookie");

        if (!res.ok) {
          return {
            ...token,
            error: "RefreshFailed",
          };
        }

        const data = await res.json();

        return {
          ...token,
          access: data.access,
          expiry: Date.now() + 28 * 60 * 1000,
          cookies: newCookieHeader ?? token.cookies,
          error: undefined,
        };
      } catch (error) {
        console.error("Token refresh error:", error);
        return {
          ...token,
          error: "RefreshError",
        };
      }
    },
    async authorized({ auth }) {
      return !!auth;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
