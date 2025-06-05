// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import {prisma} from '@/lib/prisma';

// export async function POST(req: NextRequest, { params }: { params: { testId: string } }) {
//   const session = await getServerSession(authOptions);
//   if (!session || !session.user?.id) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   const { testId } = params;
//   const { answers, startedAt, finishedAt } = await req.json();
//   const userId = session.user.id;

//   const test = await prisma.test.findUnique({
//     where: { id: testId },
//     include: {
//       questions: {
//         include: {
//           answers: true,
//         },
//       },
//     },
//   });

//   if (!test) {
//     return NextResponse.json({ error: 'Test not found' }, { status: 404 });
//   }

//   // Проверка времени прохождения
//   if (test.duration) {
//     const start = new Date(startedAt).getTime();
//     const finish = new Date(finishedAt).getTime();
//     const passedMinutes = (finish - start) / 1000 / 60;
//     if (passedMinutes > test.duration) {
//       return NextResponse.json({ error: 'Time exceeded' }, { status: 400 });
//     }
//   }

//   let correct = 0;
//   const total = test.questions.length;

//   for (const question of test.questions) {
//     const userAnswer = answers.find((a: any) => a.questionId === question.id);
//     const correctAnswers = question.answers.filter((a) => a.isCorrect);

//     if (!userAnswer) continue;

//     if (question.questionType === 'single-choice') {
//       if (userAnswer.value && correctAnswers[0]?.id === userAnswer.value) {
//         correct++;
//       }
//     }

//     if (question.questionType === 'multiple-choice') {
//       const userValues: string[] = userAnswer.values || [];
//       const correctIds = correctAnswers.map((a) => a.id).sort();
//       const userIds = [...userValues].sort();
//       if (
//         correctIds.length === userIds.length &&
//         correctIds.every((id, idx) => id === userIds[idx])
//       ) {
//         correct++;
//       }
//     }

//     if (question.questionType === 'input') {
//       const correctText = correctAnswers[0]?.text.trim().toLowerCase();
//       const userText = userAnswer.value?.trim().toLowerCase();
//       if (userText === correctText) {
//         correct++;
//       }
//     }
//   }

//   const score = Math.round((correct / total) * 100);

//   const result = await prisma.testResult.upsert({
//     where: {
//       userId_testId: {
//         userId,
//         testId,
//       },
//     },
//     create: {
//       userId,
//       testId,
//       score,
//       passed: score >= 50,
//       startedAt: new Date(startedAt),
//       finishedAt: new Date(finishedAt),
//       duration: test.duration ?? Math.floor((new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 1000 / 60),
//     },
//     update: {
//       score,
//       passed: score >= 50,
//       startedAt: new Date(startedAt),
//       finishedAt: new Date(finishedAt),
//       duration: test.duration ?? Math.floor((new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 1000 / 60),
//     },
//   });

//   return NextResponse.json({ result });
// }
