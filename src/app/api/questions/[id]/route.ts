// /app/api/questions/[questionId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: { questionId: string } }
) {
  const { questionId } = params;

  try {
    const body = await req.json();
    const { questionText, correctAnswer, questionType } = body;

    if (!questionText || !questionType) {
      return NextResponse.json({ error: 'Все поля обязательны' }, { status: 400 });
    }

    // Удалим старые ответы
    await prisma.answer.deleteMany({
      where: { questionId },
    });

    // Обновим вопрос
    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: {
        questionText,
        questionType,
        answers: {
          create: correctAnswer.map((a: { text: string; isCorrect: boolean }) => ({
            text: a.text,
            isCorrect: a.isCorrect,
          })),
        },
      },
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error('Ошибка при обновлении вопроса:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
