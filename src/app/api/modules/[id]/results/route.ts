// /app/api/modules/[moduleId]/results/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: { moduleId: string } }
) {
  const { moduleId } = params;

  try {
    const results = await prisma.testResult.findMany({
      where: {
        test: {
          module: {
            id: moduleId,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        test: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        finishedAt: 'desc',
      },
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Ошибка получения результатов:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
