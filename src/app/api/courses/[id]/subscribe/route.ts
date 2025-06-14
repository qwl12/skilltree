import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Подписка на курс
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const { id: courseId } = params;

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

    return NextResponse.json({ message: 'Подписка успешна', enrollment });
  } catch (error) {
    console.error('[SUBSCRIBE_ERROR]', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const { id: courseId } = params;

    const deleted = await prisma.enrollment.deleteMany({
       where: {
          userId: session.user.id, 
          courseId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ message: 'Подписка не найдена' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Отписка успешна' });
  } catch (error) {
    console.error('[UNSUBSCRIBE_ERROR]', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
