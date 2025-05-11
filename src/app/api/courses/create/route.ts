import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  // ПРОВЕРКА НА МЕЙЛ
  // if (!session?.user?.emailVerified) {
  //   return NextResponse.json({ error: 'Email не подтвержден' }, { status: 403 });
  // }

  const body = await req.json();
  const user = await prisma.user.findUnique({
    where: { email: session?.user.email! },
  });

  if (!user) {
    return NextResponse.json({ error: 'Пользователь не найден' }, { status: 401 });
  }

  try {
    const course = await prisma.course.create({
      data: {
        title: body.title,
        description: body.description,
        image: body.image,
        difficulty: body.difficulty,
        teacherId: user.id,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Ошибка Prisma:', error);
    return NextResponse.json({ error: 'Ошибка при создании курса' }, { status: 500 });
  }
}
