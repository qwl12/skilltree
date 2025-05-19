import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get('q')?.trim() || '';
  const tagsParam = searchParams.get('tags')?.trim() || '';
  const tags = tagsParam
    ? tagsParam.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  try {
    const orConditions: any[] = [];

    if (query) {
      orConditions.push(
        { title: { contains: query, mode: 'insensitive' as const } },
        { description: { contains: query, mode: 'insensitive' as const} },
        {
          teacher: {
            name: { contains: query,  mode: 'insensitive' as const},
          },
        },
        {
          tags: {
            some: {
              tag: {
                name: { contains: query, mode: 'insensitive' as const },
              },
            },
          },
        }
      );
    }

    const andConditions: any[] = [];

    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }

    if (tags.length > 0) {
      andConditions.push({
        tags: {
          some: {
            tag: {
              name: { in: tags },
            },
          },
        },
      });
    }

    const courses = await prisma.course.findMany({
      where: andConditions.length > 0 ? { AND: andConditions } : undefined,
      include: {
        teacher: { select: { name: true } },
        tags: {
          include: {
            tag: true,
          },
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
