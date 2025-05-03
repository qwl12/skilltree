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
    },
  });

  const sortedAuthors = popularAuthors
    .map(author => ({
      id: author.id,
      name: author.name,
      image: author.image,
      followersCount: author.followers.length,
    }))
    .sort((a, b) => b.followersCount - a.followersCount);

  return NextResponse.json(sortedAuthors);
}
