// app/api/comments/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from 'next';


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId, lectureId, parentId, content } = await req.json();

  // Проверка подписки
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id, courseId },
  });
  if (!enrollment)
    return NextResponse.json({ error: "You must be enrolled to comment" }, { status: 403 });


const comment = await prisma.comment.create({
  data: {
    content,
    lectureId,
    userId: session.user.id,
    ...(courseId && { courseId }), // передаём только если есть
    ...(parentId && { parentId }),
  },
  include: {
    user: true,
    votes: true,
  },
});

  return NextResponse.json(comment);
}


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId")!;
  const lectureId = searchParams.get("lectureId");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "5");

const totalCount = await prisma.comment.count({
  where: {
    courseId,
    lectureId: lectureId || null,
    parentId: null,
  },
});
  const comments = await prisma.comment.findMany({
    where: {
      courseId,
      lectureId: lectureId || null,
      parentId: null,
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      user: true,
      replies: {
        include: { user: true },
        orderBy: { createdAt: "asc" },
      },
      votes: true,
    },
  });

  return NextResponse.json({comments, totalCount});
}
