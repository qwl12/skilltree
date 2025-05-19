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
          include: { role: true },
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
          role: user.role.type,
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
  // Если пользователь логинится через Credentials
  if (account?.provider === "credentials" && user) {
    token.id = user.id;
    token.email = user.email;
    token.name = user.name;
    token.role = user.role;
    token.provider = account.provider;
  }

  // Если пользователь логинится через GitHub
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
          password: "", // пустой пароль
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

  // 🔥 ВСЕГДА подтягиваем актуальные данные, если есть ID
  if (token.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: token.id as string },
    });

    if (dbUser) {
      token.name = dbUser.name;
      token.email = dbUser.email;
      token.image = dbUser.image ?? undefined;
      token.role = dbUser.roleId;
    }
  }

  return token;
},

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;

        session.user.name = token.name as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },

   async redirect({ url, baseUrl }) {
  const sessionUrl = new URL(url, baseUrl);

  // Если пользователь переходит после логина
  if (url === baseUrl || url === `${baseUrl}/login`) {
    // Пробуем получить токен из cookies (в jwt ты уже положил роль)
    const role = sessionUrl.searchParams.get("role");

  
    if (role === "teacher") {
      return `${baseUrl}/teacher/profile`;
    }

    if (role === "user") {
      return `${baseUrl}/student/profile`;
    }

    return `${baseUrl}/dashboard`; // fallback
  }

  return url;
}
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
