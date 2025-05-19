'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type ResultData = {
  score: number;
  startedAt: string;
  finishedAt: string;
  test: { title: string };
  user: { name: string; email: string };
};

export default function TestResultPage({ params }: { params: { testId: string } }) {
  const [result, setResult] = useState<ResultData | null>(null);
  const searchParams = useSearchParams();
  const resultId = searchParams.get('resultId');

  useEffect(() => {
    if (!resultId) return;

    const fetchResult = async () => {
      const res = await fetch(`/api/results/${resultId}`);
      const data = await res.json();
      setResult(data);
    };

    fetchResult();
  }, [resultId]);

  if (!result) return <p>Загрузка...</p>;

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-4">
      <h1 className="text-2xl font-bold">Результат теста: {result.test.title}</h1>
      <p><strong>Пользователь:</strong> {result.user.name}</p>
      <p><strong>Email:</strong> {result.user.email}</p>
      <p><strong>Начало:</strong> {new Date(result.startedAt).toLocaleString()}</p>
      <p><strong>Завершение:</strong> {new Date(result.finishedAt).toLocaleString()}</p>
      <p><strong>Итог:</strong> {result.score} баллов</p>
    </div>
  );
}
