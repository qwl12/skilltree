// /api/admin/unapproved-courses/route.ts
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
  const user = await getCurrentUser();


  const unapprovedCourses = await prisma.course.findMany({
    where: { approved: false },
    include: {
      teacher: { select: { name: true, email: true } },
      tags: { select: { tag: true } },
    },
  });

  return Response.json(unapprovedCourses);
}
