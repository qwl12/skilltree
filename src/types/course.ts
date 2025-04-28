import NextAuth from "next-auth";

export interface Course {
    id: string;
    title: string;
    image: string;
    author: string;
    duration?: number; 
    subscribers: number;
    
  }

  declare module "next-auth" {
    interface Session {
      user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
      };
    }
  
    interface User {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
  