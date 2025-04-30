// src/lib/auth.ts
import { PrismaClient } from "@prisma/client";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email и пароль обязательны");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Пользователь не найден");
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Неверный email или пароль");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.roleId,
        };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "credentials" && user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.provider = account.provider;
      }

      if (account?.provider === "github" && profile) {
        const githubProfile = profile as {
          login?: string;
          name?: string;
          email?: string;
          avatar_url?: string;
        };

        const githubEmail = githubProfile.email || user?.email;

        let existingUser = await prisma.user.findUnique({
          where: { email: githubEmail ?? "" },
        });

        if (!existingUser) {
   
          existingUser = await prisma.user.create({
            data: {
              email: githubEmail!,
              name: profile.name ?? githubProfile.login ?? "GitHub User",
              image: githubProfile.avatar_url,
              password: "", 
              roleId: "user", 
              emailVerified: new Date(),
            },
          });
        }

        token.id = existingUser.id;
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.image = existingUser.image ?? undefined;
        token.role = existingUser.roleId;
        token.provider = account.provider;
      }

      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      return baseUrl; 
    },
  },

  pages: {
    signIn: "/login", 
    error: "/login?error=auth", 
  },

  session: {
    strategy: "jwt", 
  },

  secret: process.env.NEXTAUTH_SECRET, 
};
