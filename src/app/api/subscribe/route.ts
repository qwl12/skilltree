import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Убедитесь, что путь к authOptions корректен
import { prisma } from '@/lib/prisma'; // Убедитесь, что путь к Prisma клиенту корректен
import { getToken } from 'next-auth/jwt';
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json({ error: 'Не указан идентификатор курса' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        courseId: courseId,
      },
    });

    return NextResponse.json({ message: 'Подписка успешна', enrollment }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при подписке:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
