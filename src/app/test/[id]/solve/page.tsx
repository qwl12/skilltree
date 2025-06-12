// src/app/test/[id]/solve/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Answer {
  id: string;
  text: string;
}

interface Answer {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface Question {
  id: string;
  questionText: string;
  questionType: 'single-choice' | 'multiple-choice' | 'input-choice';
  answers: Answer[];
}



export default function SolveTestPage() {
  const { id } = useParams<{ id: string }>(); 

  const [questions, setQuestions] = useState<Question[]>([]);
  const [duration, setDuration] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [startedAt] = useState(new Date().toISOString());
  const router = useRouter();
useEffect(() => {
  const fetchQuestions = async () => {
    const res = await fetch(`/api/test/${id}/questions`);
    const text = await res.text();

    try {
      const data = JSON.parse(text);
      console.log('Полученные данные:', data);

      if (!data.questions || !Array.isArray(data.questions)) {
        console.error('Неверная структура:', data);
        return;
      }

      setQuestions(data.questions);
      setDuration(data.duration);
      setTimeLeft(data.duration);
    } catch (e) {
      console.error('Ошибка парсинга JSON:', e);
    }
  };

  if (id) {
    fetchQuestions();
  }
}, [id]);


  useEffect(() => {
    if (!timeLeft) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (timeLeft === 0) {
      handleSubmit();
    }

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleChange = (questionId: string, answer: any) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    const finishedAt = new Date().toISOString();

    const formattedAnswers = Object.entries(userAnswers).map(([questionId, answer]) => {
      if (Array.isArray(answer)) {
        return { questionId, values: answer };
      } else {
        return { questionId, value: answer };
      }
    });

    const res = await fetch(`/api/test/${id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: formattedAnswers,
        startedAt,
        finishedAt,
      }),
    });

    const result = await res.json();
    router.push(`/test/${id}/result?resultId=${result.result.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Прохождение теста</h1>
        {duration && (
          <div className="text-lg font-semibold text-red-600 bg-red-100 px-4 py-1 rounded">
            Осталось: {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {questions.map((q, index) => (
        <div key={q.id} className="border p-4 rounded-xl shadow-sm bg-white">
          <p className="font-semibold mb-2">
            {index + 1}. {q.questionText}
          </p>

          {(q.questionType === 'single-choice' ) &&
            q.answers.map((a) => (
              <label key={a.id} className="flex items-center gap-2 mb-1 cursor-pointer">
                <input
                  type="radio"
                  name={q.id}
                  value={a.id}
                  checked={userAnswers[q.id] === a.id}
                  onChange={() => handleChange(q.id, a.id)}
                  className="accent-blue-600"
                />
                {a.text}
              </label>
            ))}

          {(q.questionType === 'multiple-choice' ) &&
            q.answers.map((a) => (
              <label key={a.id} className="flex items-center gap-2 mb-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userAnswers[q.id]?.includes(a.id) || false}
                  onChange={() => {
                    const selected = userAnswers[q.id] || [];
                    handleChange(
                      q.id,
                      selected.includes(a.id)
                        ? selected.filter((id: string) => id !== a.id)
                        : [...selected, a.id]
                    );
                  }}
                  className="accent-blue-600"
                />
                {a.text}
              </label>
            ))}

          {q.questionType === 'input-choice' && (
            <input
              type="text"
              value={userAnswers[q.id] || ''}
              onChange={(e) => handleChange(q.id, e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Введите ответ..."
            />
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition"
      >
        Завершить тест
      </button>
    </div>
  );
}
