import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    const courseId = (await context.params).id;

    if (!courseId) {
      return NextResponse.json({ error: 'Не указан идентификатор курса' }, { status: 400 });
    }

    await prisma.enrollment.deleteMany({
      where: {
        userId: user.id,
        courseId,
      },
    });

    return NextResponse.json({ message: 'Вы отписались от курса' }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при отписке:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    const courseId = (await context.params).id; 

    if (!courseId) {
      return NextResponse.json({ error: 'Не указан идентификатор курса' }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        courseId,
      },
    });

    return NextResponse.json({ message: 'Подписка успешна', enrollment }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при подписке:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
