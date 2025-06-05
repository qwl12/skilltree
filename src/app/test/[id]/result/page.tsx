'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface AnswerOption {
  id: string;
  text: string;
}

interface AnswerResult {
  questionId: string;
  questionText: string;
  questionType: 'single' | 'multiple' | 'input';
  correctAnswers: string[];
  userAnswers: string[];
  answerOptions?: AnswerOption[];
}

interface TestResult {
  testTitle: string;
  score: number;
  total: number;
  answers: AnswerResult[];
}

export default function TestResultPage() {
  const searchParams = useSearchParams();
  const resultId = searchParams.get('resultId');

  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!resultId) return;

    const fetchResult = async () => {
      const res = await fetch(`/api/test/result/${resultId}`);
      const data = await res.json();
      setResult(data);
      setLoading(false);
    };

    fetchResult();
  }, [resultId]);

  const isCorrect = (user: string[], correct: string[]) => {
    return (
      user.length === correct.length &&
      user.every((ans) => correct.includes(ans))
    );
  };
console.log('результат',result)
  if (!result) return <p className="p-4 text-red-600">Результат не найден</p>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-3xl font-bold mb-4">{result.testTitle}</h1>
      <p className="text-lg">
        Ваш результат: <span className="font-semibold">{result.score} / {result.total}</span>
      </p>

      {result.answers.map((ans, index) => {
        const correct = isCorrect(ans.userAnswers, ans.correctAnswers);

        return (
          <div
            key={ans.questionId}
            className={`border p-4 rounded-xl shadow-sm bg-white ${
              correct ? 'border-green-400' : 'border-red-400'
            }`}
          >
            <p className="font-semibold mb-2">
              {index + 1}. {ans.questionText}
            </p>

            <div className="mb-1 text-sm">
              <span className="font-medium">Ваш ответ:</span>{' '}
              {ans.questionType === 'input'
                ? ans.userAnswers[0] || '—'
                : ans.userAnswers
                    .map((id) => ans.answerOptions?.find((a) => a.id === id)?.text || '—')
                    .join(', ')}
            </div>

            <div className="text-sm text-gray-600">
              <span className="font-medium">Правильный ответ:</span>{' '}
              {ans.questionType === 'input'
                ? ans.correctAnswers[0]
                : ans.correctAnswers
                    .map((id) => ans.answerOptions?.find((a) => a.id === id)?.text || '—')
                    .join(', ')}
            </div>

            <div
              className={`mt-2 text-sm font-semibold ${
                correct ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {correct ? 'Верно ✅' : 'Неверно ❌'}
            </div>
          </div>
        );
      })}
    </div>
  );
}
