
import { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { prisma }from "@/lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter";



export const nextAuthConfig:AuthOptions = {
    providers: [
        GitHubProvider({
          clientId: process.env.GITHUB_CLIENT_ID ?? '',
          clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
        }),
      ],
      adapter: PrismaAdapter(prisma),
     
    };