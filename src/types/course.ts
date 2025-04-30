import { DefaultSession } from "next-auth";

export interface Course {
    id: string;
    title: string;
    image: string;
    author: string;
    duration?: number; 
    subscribers: number;
    
  }
declare module "next-auth" {
  
  interface Session extends DefaultSession {
    user: {
      id: string;
      image?: string;
      role?: string;
      email?: string;
      provider?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    picture?: string;
    role?: string;
    email?: string;
  }
}
  