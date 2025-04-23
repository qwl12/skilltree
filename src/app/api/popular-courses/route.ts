import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { subscribers: "desc" },
      take: 6,
      include: {
        teacher: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Ошибка при получении курсов" }, { status: 500 });
  }
}
