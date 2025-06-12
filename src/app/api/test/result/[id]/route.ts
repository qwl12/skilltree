import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
   req: NextRequest,
  context: { params: Promise<{ resultId: string }>}
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resultId = (await context.params).resultId;
  if (!resultId) {
    return NextResponse.json({ error: 'Result ID is required' }, { status: 400 });
  }

  const result = await prisma.testResult.findUnique({
    where: { id: resultId },
    include: {
      test: true,
      answers: {
        include: {
          question: {
            include: {
              answers: true,
            },
          },
        },
      },
    },
  });

  if (!result) {
    return NextResponse.json({ error: 'Result not found' }, { status: 404 });
  }

  if (result.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

const answerResults = result.answers.map((answer) => {
  const question = answer.question;

  const correctAnswers =
    question.questionType === 'input'
      ? [] 
      : question.answers.filter((a) => a.isCorrect).map((a) => a.id);

  return {
    questionId: question.id,
    questionText: question.questionText,
    questionType: question.questionType,
    correctAnswers,
    userAnswers:
      question.questionType === 'input'
        ? [answer.inputAnswer || '']
        : answer.selectedIds,
    answerOptions:
      question.questionType === 'input'
        ? undefined
        : question.answers.map((a) => ({ id: a.id, text: a.text })),
  };
});

  return NextResponse.json({
    testTitle: result.test.title,
    score: result.score,
    total: result.answers.length,
    answers: answerResults,
  });
}
