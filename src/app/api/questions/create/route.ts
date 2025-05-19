import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { questionText, correctAnswer, testId, questionType } = await req.json();

    if (!questionText || !testId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let formattedAnswers = [];

    if (questionType === 'single' || questionType === 'multiple') {
      if (!correctAnswer || correctAnswer.length === 0) {
        return NextResponse.json({ error: 'At least one correct answer is required' }, { status: 400 });
      }

      formattedAnswers = correctAnswer.map((answer: { text: string; isCorrect: boolean }) => ({
        text: answer.text,
        isCorrect: answer.isCorrect,
      }));
    } else if (questionType === 'input') {
      formattedAnswers = [{ text: correctAnswer[0]?.text, isCorrect: true }];
    }

    const question = await prisma.question.create({
      data: {
        questionText,
        questionType, 
        test: {
          connect: { id: testId },
        },
        answers: {
          create: formattedAnswers,
        },
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
