import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return NextResponse.json({ error: 'Курс не найден' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Ошибка при получении курса:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при получении курса' },
      { status: 500 }
    );
  }
}
