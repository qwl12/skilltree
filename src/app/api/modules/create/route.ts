import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Получено тело запроса:', body);

    const { title, description, courseId } = body;

    if (!title || !courseId || !description) {
      console.warn('Не указаны обязательные поля:', { title, courseId, description });
      return NextResponse.json({ error: 'Не указаны обязательные поля' }, { status: 400 });
    }

    const module = await prisma.module.create({
      data: {
        title,
        description,
        courseId,
        order: 0,
      },
    });

    return NextResponse.json(module);
  } catch (error) {
    console.error('Ошибка при создании модуля:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
