import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { commentId, value } = await req.json(); // value: 1 (like), -1 (dislike)

  const existing = await prisma.commentVote.findUnique({
    where: {
      userId_commentId: {
        userId: session.user.id,
        commentId,
      },
    },
  });

  if (existing) {
    // toggle
    await prisma.commentVote.update({
      where: { userId_commentId: { userId: session.user.id, commentId } },
      data: { value },
    });
  } else {
    await prisma.commentVote.create({
      data: { userId: session.user.id, commentId, value },
    });
  }

  return NextResponse.json({ success: true });
}
