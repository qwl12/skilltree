import { prisma } from '@/lib/prisma';

export async function GET() {
  const tagsWithCount = await prisma.tag.findMany({
    select: {
      name: true,
      courses: {
        select: { courseId: true },
      },
    },
  });

  const result = tagsWithCount
    .map(tag => ({
      name: tag.name,
      count: tag.courses.length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return Response.json(result);
}
