import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(  req: NextRequest,
  context: { params: Promise<{ id: string }> }) {
  const lecture = await prisma.lecture.findUnique({
    where: { id: (await context.params).id },
    include: {
      module: {
        include: {
          course: {
            select: { teacherId: true },
          },
        },
      },
    },
  });

  return Response.json(lecture);
}

export async function PUT(req: NextRequest,
  context: { params: Promise<{ id: string }>}) {
  const body = await req.json();

  const updated = await prisma.lecture.update({
    where: { id: (await context.params).id },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return Response.json(updated);
}
