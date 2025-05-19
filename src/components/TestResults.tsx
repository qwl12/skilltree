// components/TestResults.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface TestResult {
  id: string;
  score: number;
  startedAt: string;
  finishedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  test: {
    title: string;
  };
}

export default function TestResults({ moduleId }: { moduleId: string }) {
  const [results, setResults] = useState<TestResult[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchResults = async () => {
      const res = await fetch(`/api/modules/${moduleId}/results`);
      const data = await res.json();
      setResults(data);
    };

    fetchResults();
  }, [moduleId]);

  if (results.length === 0) {
    return <p className="text-gray-500">Результаты прохождения тестов пока отсутствуют.</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Результаты тестов</h2>
      <div className="overflow-auto rounded-lg shadow border">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-2 px-4 text-left">Пользователь</th>
              <th className="py-2 px-4 text-left">Тест</th>
              <th className="py-2 px-4 text-left">Баллы</th>
              <th className="py-2 px-4 text-left">Начал</th>
              <th className="py-2 px-4 text-left">Завершил</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr
                key={result.id}
                className={
                  session?.user?.email === result.user.email
                    ? 'bg-green-50'
                    : 'hover:bg-gray-50'
                }
              >
                <td className="py-2 px-4">{result.user.name}</td>
                <td className="py-2 px-4">{result.test.title}</td>
                <td className="py-2 px-4">{result.score}</td>
                <td className="py-2 px-4">
                  {new Date(result.startedAt).toLocaleString()}
                </td>
                <td className="py-2 px-4">
                  {new Date(result.finishedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
