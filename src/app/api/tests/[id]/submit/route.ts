import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Неавторизован' }, { status: 401 });
    }

    const testId = params.id;
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    const { answers, startedAt, finishedAt } = await req.json();

    if (!answers || !startedAt || !finishedAt) {
      return NextResponse.json({ error: 'Отсутствуют необходимые данные' }, { status: 400 });
    }

    const questions = await prisma.question.findMany({
      where: { testId },
      include: { answers: true },
    });

    let score = 0;

    const normalizeType = (type: string) => {
      if (type === 'multiple-choice') return 'multiple';
      if (type === 'single-choice') return 'single';
      return type;
    };

    for (const question of questions) {
      const userAnswer = answers.find((a: any) => a.questionId === question.id);
      if (!userAnswer) continue;

      const questionType = normalizeType(question.questionType);

      const correctAnswers = question.answers
        .filter((a) => a.isCorrect)
        .map((a) => a.text.trim().toLowerCase());

      if (questionType === 'input') {
        if (
          correctAnswers.length &&
          userAnswer.value?.trim().toLowerCase() === correctAnswers[0]
        ) {
          score++;
        }
      } else if (questionType === 'single') {
        const selectedAnswer = question.answers.find((a) => a.id === userAnswer.value);
        if (selectedAnswer && selectedAnswer.isCorrect) {
          score++;
        }
      } else if (questionType === 'multiple') {
        const selectedAnswers = question.answers.filter((a) =>
          userAnswer.values?.includes(a.id)
        );
        const isCorrect =
          selectedAnswers.length === correctAnswers.length &&
          selectedAnswers.every((a) => a.isCorrect);
        if (isCorrect) {
          score++;
        }
      }
    }

    const totalQuestions = questions.length;
    const duration = new Date(finishedAt).getTime() - new Date(startedAt).getTime();
    const passed = score >= Math.ceil(totalQuestions * 0.6); // проходной балл 60%

    const result = await prisma.testResult.create({
      data: {
        testId,
        userId: user.id,
        score,
        startedAt: new Date(startedAt),
        finishedAt: new Date(finishedAt),
        duration,
        passed,
      },
    });
console.log(answers, startedAt, finishedAt)
console.log(testId, user)
    return NextResponse.json({ message: 'Результат сохранён', result });
  } catch (error) {
    console.error('Ошибка при сохранении результата теста:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
