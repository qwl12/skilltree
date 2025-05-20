// /api/popular-authors.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const teacherRole = await prisma.role.findUnique({
    where: { type: "teacher" },
  });

  if (!teacherRole) {
    return NextResponse.json({ error: "Teacher role not found" }, { status: 404 });
  }

  const popularAuthors = await prisma.user.findMany({
    where: {
      roleId: teacherRole.id,
    },
    include: {
      followers: true,
      courses: true,
    },
    orderBy: {
      followers: {
        _count: "desc",
      },
    },
    take: 6,
  });

  const result = popularAuthors.map((author) => ({
    id: author.id,
    name: author.name,
    avatarUrl: author.image ?? "/userProfile.png",
    followersCount: author.followers.length,
    coursesCount: author.courses.length,
  }));

  return NextResponse.json(result);
}
