import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      take: 6,
      where: {
        approved: true
      },
      include: {
        teacher: {
          select: { name: true },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: {
        enrollments: {
          _count: 'desc',
        },
        
      },
    });

    const formattedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      image: course.image,
      description: course.description,
      duration: course.duration,
      teacher: course.teacher,
      subscribers: course._count.enrollments, // вот тут!
    }));

    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Ошибка при получении курсов" }, { status: 500 });
  }
}
