import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  if (!courseId) {
    return new NextResponse("Missing courseId", { status: 400 });
  }

  try {
    await prisma.enrollment.deleteMany({
      where: {
        courseId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: "Unsubscribed successfully" });
  } catch (error) {
    console.error("[UNSUBSCRIBE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
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
