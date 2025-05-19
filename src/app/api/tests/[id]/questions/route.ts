// /app/api/tests/[testId]/questions/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { testId: string } }
) {
  const { testId } = params;

  try {
    const questions = await prisma.question.findMany({
      where: { testId },
      include: { answers: true },
    });

    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка загрузки вопросов' }, { status: 500 });
  }
}
