import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!params.id) {
    return new Response('Missing course ID', { status: 400 });
  }

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      teacher: { select: { name: true } },
      modules: {
        include: {
          lectures: true,
        },
      },
      enrollments: true, // Получаем список записей на курс
    },
  });

  if (!course) {
    return new Response('Course not found', { status: 404 });
  }

const isSubscribed = course.enrollments.some((s: { userId: string }) => s.userId === userId);
const subscribers = course.enrollments.length;
  return Response.json({
    ...course,
    isSubscribed,
    subscribers,
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { title, description, aboutCourse, image, difficulty } = body;

    const updated = await prisma.course.update({
      where: { id: params.id },
      data: {
        title,
        description,
        aboutCourse,
        image,
        difficulty,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[COURSE_PUT_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
