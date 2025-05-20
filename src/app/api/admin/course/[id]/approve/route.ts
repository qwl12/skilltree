import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    return new Response('Unauthorized', { status: 403 });
  }

  const courseId = params.id;

  await prisma.course.update({
    where: { id: courseId },
    data: { approved: true },
  });

  return new Response('Course approved', { status: 200 });
}
