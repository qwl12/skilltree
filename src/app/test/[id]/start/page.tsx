'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Answer = {
  id: string;
  text: string;
};

type Question = {
  id: string;
  questionText: string;
  questionType: string; // может быть 'single-choice', 'multiple-choice', 'input'
  answers: Answer[];
};

export default function TestStartPage({ params }: { params: { testId: string } }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [startedAt] = useState(new Date().toISOString());
  const router = useRouter();

  const { testId } = params;

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch(`/api/tests/${testId}/questions`);
      const data = await res.json();
      setQuestions(data);
    };

    fetchQuestions();
  }, [testId]);

  const handleChange = (questionId: string, answer: any) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    const finishedAt = new Date().toISOString();

    // 🔧 Преобразуем ответы в массив
    const formattedAnswers = Object.entries(userAnswers).map(([questionId, answer]) => {
      if (Array.isArray(answer)) {
        return { questionId, values: answer };
      } else {
        return { questionId, value: answer };
      }
    });

    const res = await fetch(`/api/tests/${testId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: formattedAnswers,
        startedAt,
        finishedAt,
      }),
    });

    const result = await res.json();
    router.push(`/test/${testId}/result?resultId=${result.result.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Прохождение теста</h1>
      {questions.map((q) => (
        <div key={q.id}>
          <p className="font-semibold">{q.questionText}</p>

          {(q.questionType === 'single' || q.questionType === 'single-choice') &&
            q.answers.map((a) => (
              <label key={a.id} className="block">
                <input
                  type="radio"
                  name={q.id}
                  value={a.id}
                  checked={userAnswers[q.id] === a.id}
                  onChange={() => handleChange(q.id, a.id)}
                />{' '}
                {a.text}
              </label>
            ))}

          {(q.questionType === 'multiple' || q.questionType === 'multiple-choice') &&
            q.answers.map((a) => (
              <label key={a.id} className="block">
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
                />{' '}
                {a.text}
              </label>
            ))}

          {q.questionType === 'input' && (
            <input
              type="text"
              value={userAnswers[q.id] || ''}
              onChange={(e) => handleChange(q.id, e.target.value)}
              className="border p-1 mt-1"
            />
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Завершить тест
      </button>
    </div>
  );
}
