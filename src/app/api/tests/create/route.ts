import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { title, moduleId, questions } = await req.json();

    if (!title || !moduleId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const data: any = {
      title,
      module: {
        connect: { id: moduleId },
      },
    };

    // Добавляем вопросы, только если они есть и это массив
    if (Array.isArray(questions) && questions.length > 0) {
      data.questions = {
        create: questions.map((q) => ({
          questionText: q.questionText,
          correctAnswer: q.correctAnswer,
        })),
      };
    }

    const test = await prisma.test.create({ data });

    return NextResponse.json(test, { status: 201 });
  } catch (error: any) {
    console.error('Error creating test:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
