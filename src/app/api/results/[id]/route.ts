// /app/api/results/[resultId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { resultId: string } }
) {
  const { resultId } = params;

  try {
    const result = await prisma.testResult.findUnique({
      where: { id: resultId },
      include: {
        user: { select: { name: true, email: true } },
        test: { select: { title: true } },
      },
    });

    if (!result) {
      return NextResponse.json({ error: 'Результат не найден' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при загрузке результата' }, { status: 500 });
  }
}
