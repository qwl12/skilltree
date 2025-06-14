import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
// Отписка
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  if (!courseId) {
    return NextResponse.json({ error: 'Не указан идентификатор курса' }, { status: 400 });
  }

  try {
    const deleted = await prisma.enrollment.deleteMany({
      where: {
        userId: session.user.id,
        courseId: courseId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ message: 'Подписка не найдена' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Отписка успешна' }, { status: 200 });
  } catch (error) {
    console.error('[UNSUBSCRIBE_ERROR]', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}