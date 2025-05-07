import { DefaultSession } from "next-auth";
import { DateTime } from "next-auth/providers/kakao";

export interface Course {
  id: string;
  title: string;
  image: string;
  description: string;
  fullDescription: string;
  subscribers: string;
  duration?: number;
  difficulty: 'Начальный' | 'Средний' | 'Продвинутый';
  teacher: {
    name: string;
  };
}

declare module "next-auth" {
  
  interface Session extends DefaultSession {
    user: {
      id: string;
      image?: string;
      role?: string;
      email?: string;
      emailVerified: DateTime;
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
  