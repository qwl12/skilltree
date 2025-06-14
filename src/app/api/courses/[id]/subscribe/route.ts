import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';


// Подписка
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'Не указан идентификатор курса' }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        courseId,
      },
    });

    return NextResponse.json({ message: 'Подписка успешна', enrollment }, { status: 200 });
  } catch (error) {
    console.error('[SUBSCRIBE_ERROR]', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
