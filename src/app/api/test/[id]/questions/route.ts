// src/app/api/test/[id]/questions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const testId = params.id;

  if (!testId) {
    return NextResponse.json({ error: 'Test ID is required' }, { status: 400 });
  }

  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      questions: {
        include: {
          answers: true,
        },
      },
    },
  });

  if (!test) {
    return NextResponse.json({ error: 'Test not found' }, { status: 404 });
  }

  const questions = test.questions.map((q) => ({
    id: q.id,
    questionText: q.questionText,
    questionType: q.questionType,
    answers: q.answers.map((a) => ({
      id: a.id,
      text: a.text,
    })),
  }));

  return NextResponse.json({
    questions,
    duration: test.duration,
  });
}
