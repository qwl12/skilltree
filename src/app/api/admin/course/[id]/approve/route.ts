import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  const params = await context.params;
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return new Response("Unauthorized", { status: 403 });
  }

  const id = params.id;

  await prisma.course.update({
    where: { id },
    data: { approved: true },
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
