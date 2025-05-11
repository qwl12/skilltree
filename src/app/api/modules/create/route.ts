import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const module = await prisma.module.create({
      data: {
        title: body.title,
        description: body.description,
        courseId: body.courseId,
        order: 0,
      },
    });

    return NextResponse.json(module);
  } catch (error: any) {
    return NextResponse.json({ error: 'Ошибка создания модуля' }, { status: 500 });
  }
}