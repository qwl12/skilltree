import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return new Response('Unauthorized', { status: 403 });
  }

  const { id } = params;

  await prisma.course.update({
    where: { id },
    data: { approved: true },
  });

  return Response.json({ success: true });
}
