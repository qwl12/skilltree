
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const test = await prisma.test.findUnique({
      where: { id: params.id },
      include: {
        questions: {
          include: { answers: true },
        },
        module: {
          include: { course: true },
        },
      },
    });

    if (!test) return NextResponse.json({ error: 'Test not found' }, { status: 404 });

    return NextResponse.json(test);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const testId = params.id;
    const { title, duration, questions } = await req.json();

    const updateData: any = {
      title,
      duration,
      questions: {
        deleteMany: {}, 
        create: questions.map((q: any) => ({
          questionText: q.questionText,
          questionType: q.questionType,
          answers: {
            create: q.answers.map((a: any) => ({
              text: a.text,
              isCorrect: a.isCorrect,
            })),
          },
        })),
      },
    };

    const updatedTest = await prisma.test.update({
      where: { id: testId },
      data: updateData,
      include: { questions: { include: { answers: true } } },
    });

    return NextResponse.json(updatedTest);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update test' }, { status: 500 });
  }
}