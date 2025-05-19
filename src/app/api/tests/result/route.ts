// app/api/test/[id]/result/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.redirect('/auth/signin');

  const { answers } = await req.json();

  const test = await prisma.test.findUnique({
    where: { id: params.id },
    include: { questions: { include: { answers: true } } },
  });

  if (!test) return NextResponse.json({ error: 'Test not found' }, { status: 404 });

  let correctCount = 0;

  test.questions.forEach((q) => {
    const selectedAnswerId = answers[q.id];
    const correctAnswer = q.answers.find(a => a.isCorrect);
    if (correctAnswer?.id === selectedAnswerId) {
      correctCount++;
    }
  });

const now = new Date();
await prisma.testResult.upsert({
  where: {
    userId_testId: {
      userId: session.user.id,
      testId: test.id,
    },
  },
  create: {
    userId: session.user.id,
    testId: test.id,
    score: correctCount,
    passed: correctCount >= Math.floor(test.questions.length / 2), // или твоя логика прохождения
    duration: test.duration || 0,
    startedAt: now,
    finishedAt: now,
  },
  update: {
    score: correctCount,
    passed: correctCount >= Math.floor(test.questions.length / 2),
    finishedAt: now,
  },
});

  return NextResponse.json({ success: true });
}
