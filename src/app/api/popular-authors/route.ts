// /pages/api/popular-authors.ts
import { prisma } from "@/lib/prisma"; // или откуда ты импортируешь prisma
import { NextResponse } from "next/server";

export async function GET() {
  // Найти id роли TEACHER
  const teacherRole = await prisma.role.findUnique({
    where: { type: "teacher" },
  });

  if (!teacherRole) {
    return NextResponse.json({ error: "Teacher role not found" }, { status: 404 });
  }

  // Теперь найдем пользователей-учителей с подсчетом подписчиков
  const popularAuthors = await prisma.user.findMany({
    where: {
      roleId: teacherRole.id,
    },
    include: {
      followers: true, // чтобы потом посчитать длину
    },
  });

  // Сортируем по количеству подписчиков
  const sortedAuthors = popularAuthors
    .map(author => ({
      id: author.id,
      name: author.name,
      avatarUrl: author.avatarUrl,
      followersCount: author.followers.length,
    }))
    .sort((a, b) => b.followersCount - a.followersCount);

  return NextResponse.json(sortedAuthors);
}
