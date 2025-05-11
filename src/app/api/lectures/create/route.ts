import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const lecture = await prisma.lecture.create({
      data: {
        title: body.title,
        content: body.content,
        moduleId: body.moduleId,
        order: 0,
      },
    });

    return NextResponse.json(lecture);
  } catch (error: any) {
    return NextResponse.json({ error: 'Ошибка создания лекции' }, { status: 500 });
  }
}
