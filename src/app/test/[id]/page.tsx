'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: testId } = use(params); // используем use для извлечения параметра
  const { data: session, status } = useSession();
  const router = useRouter();
  const [test, setTest] = useState<any>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {


      // Получаем тест по ID
      const testRes = await prisma.test.findUnique({
        where: { id: testId },
        include: { testResults: true, questions: true },
      });

      if (!testRes) {
        router.push('/404'); // перенаправляем на страницу 404, если тест не найден
        return;
      }

      setTest(testRes);

      // Проверка результата пользователя
      const currentUserResult = testRes.testResults.find((r) => r.userId === session?.user.id);
      setResult(currentUserResult);
    };

   
  }, [testId, session, status, router]);



  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{test.title}</h1>

      <Link
        href={`/test/${testId}/attempt`}
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Начать тест
      </Link>

      {result && (
        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 p-4 rounded">
          <p>Ваш результат: <strong>{result.score}</strong> из {test.questions.length}</p>
        </div>
      )}
    </div>
  );
}
