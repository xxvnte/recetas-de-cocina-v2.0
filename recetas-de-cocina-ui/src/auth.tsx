import { config } from "@/config";
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser } from "./network/api/user/login-user";

export const AuthConfig = {
    providers: [
      CredentialsProvider({
        name: "credentials",
        credentials: {
          nombre: { label: "Nombre", type: "string" },
          telefono: { label: "Telefono", type: "string" },
          email: { label: "Email", type: "email" },
        },
        async authorize(credentials) {
          try {
            const response = await loginUser({
              nombre: credentials?.nombre!,
              telefono: credentials?.telefono!,
            });
  
            return {
              id: credentials?.nombre!,
              nombre: credentials?.nombre!,
              email: credentials?.email!,
            };
          } catch (error) {
            console.log("Error authorizing credentials", error);
            return null;
          }
        },
      }),
    ],
    callbacks: {
      async signIn({ user, account }: { user: any; account: any }) {
        if (account?.provider === "credentials") {
          user.provider = "credentials";
          return true;
        }

        return true;
      },
      async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
        if (url.startsWith(baseUrl)) {
          return url;
        } else if (url.startsWith("/")) {
          return `${baseUrl}${url}`;
        }
        return baseUrl;
      },
      async jwt({ token, user }: { token: any; user?: any }) {
        if (user) {
          token.id = user.id;
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
          token.provider = user.provider;
  
          return token;
        } else if (Date.now() < token.expiresAt * 1000) {
          return token;
        } else {
          if (!token.refreshToken) throw new TypeError("Missing refreshToken");
  
          try {
            const response = await loginUser({ nombre: "", telefono: ""}!);
  
            return {
              ...token,
            };
          } catch (error) {
            // If we fail to refresh the token, return an error so we can handle it on the page
            console.error("Error refreshing accessToken", error);
            token.error = "RefreshTokenError";
            return token;
          }
        }
      },
      async session({ session, token }: { session: any; token: any }) {
        session.user = {
          id: token.id,
          email: token.email,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          provider: token.provider,
        };
        return session;
      },
    },
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, // 1 month
    },
    jwt: {
      // maxAge: 1 * 60 * 60, // 1 hour
      maxAge: 1 * 60, // 1 min
    },
    pages: {
      signIn: "/login",
      signOut: "/logout",
      error: "/auth/error",
    },
  } satisfies NextAuthOptions;
  
  export function auth(
    ...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []
  ) {
    return getServerSession(...args, AuthConfig);
  }