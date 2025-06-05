import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { courseId } = await req.json();
  const userId = session.user.id;

  const existing = await prisma.enrollment.findFirst({
    where: { courseId, userId },
  });

  if (existing) {
    // Отписка
    await prisma.enrollment.delete({ where: { id: existing.id } });
    return NextResponse.json({ status: 'unsubscribed' });
  } else {
    // Подписка
    await prisma.enrollment.create({
      data: {
        courseId,
        userId,
      },
    });
    return NextResponse.json({ status: 'subscribed' });
  }
}
