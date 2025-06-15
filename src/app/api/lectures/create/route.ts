import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, content, moduleId } = body;

    // Проверка обязательных полей
    if (!title || !moduleId) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля: title или moduleId' },
        { status: 400 }
      );
    }

    const lecture = await prisma.lecture.create({
      data: {
        title,
        content: content || '',
        moduleId,
        order: 0,
      },
    });

    return NextResponse.json(lecture);
  } catch (error: any) {
    console.error('Ошибка создания лекции:', error); // Логируем ошибку в консоль сервера
    return NextResponse.json({ error: 'Ошибка создания лекции' }, { status: 500 });
  }
}
