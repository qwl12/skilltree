import { prisma } from '@/lib/prisma';
import { Tag } from '@prisma/client';


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) return new Response('Missing userId', { status: 400 });

  const enrolledCourses = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          tags: {
            select: {
              tag: {
                select: { name: true },
              },
            },
          },
        },
      },
    },
  });

  const tagNames = [
    ...new Set(
      enrolledCourses.flatMap((enrollment) =>
        enrollment.course.tags.map((t: { tag: { name: string } }) => t.tag.name)
      )
    ),
  ];

type RecommendedCourse = {
  id: string;
  title: string;
  image: string | null;
  tags: { tag: Tag }[];
};

let recommendedCourses: RecommendedCourse[] = [];

  if (tagNames.length > 0) {

    recommendedCourses = await prisma.course.findMany({
      where: {
        tags: {
          some: {
            tag: {
              name: { in: tagNames },
            },
          },
        },
        enrollments: {
          none: {
            userId,
          },
        },
      },
      take: 6,
      select: {
        id: true,
        title: true,
        image: true,
        tags: { select: { tag: true } },
      },
    });
  }

  if (recommendedCourses.length === 0) {
    recommendedCourses = await prisma.course.findMany({
      where: {
        enrollments: {
          none: {
            userId,
          },
        },
      },
      orderBy: {
        enrollments: {
          _count: 'desc',
        },
      },
      take: 10,
      select: {
        id: true,
        title: true,
        image: true,
        tags: { select: { tag: true } },
      },
    });
  }

  return Response.json(recommendedCourses);
}
