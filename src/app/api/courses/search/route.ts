
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.trim();

  if (!query) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const courses = await prisma.course.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          {
            teacher: {
              name: { contains: query, mode: 'insensitive' },
            },
          },
        ],
      },
      include: {
        teacher: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error('Ошибка при поиске курсов:', error);
    return NextResponse.json(
      { error: 'Ошибка при выполнении поиска' },
      { status: 500 }
    );
  }
}
