import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { prisma } from './prisma';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { role: true }, 
  });

  return user
    ? {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role?.type, 
      }
    : null;
}
