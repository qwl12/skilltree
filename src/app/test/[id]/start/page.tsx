// app/tests/[id]/start/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TestStartPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/');

  // Ждём промис params
  const { id: testId } = await params;
  const userId = session.user.id;

  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      testResults: {
        where: { userId },
        select: { id: true },
      },
    },
  });

  if (!test) return notFound();

  const hasAttempt = test.testResults.length > 0;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">{test.title}</h1>

      <div className="text-gray-700 mb-4">
        <p className="mb-2">
          <strong>Длительность:</strong>{' '}
          {test.duration ? `${test.duration} секунд` : 'Не указана'}
        </p>
        <p>
          <strong>Попыток:</strong>{' '}
          {hasAttempt ? '1 (уже проходили)' : '0 (ещё не проходили)'}
        </p>
      </div>

      <Link
        href={`/test/${testId}/solve`}
        className="inline-block px-6 py-3 mt-4 rounded-md font-medium transition bg-blue-600 hover:bg-blue-700 text-white"
      >
        Начать тест
      </Link>
    </div>
  );
}
