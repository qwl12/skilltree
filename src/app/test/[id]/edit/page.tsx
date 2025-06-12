'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
type PageProps = {
  params:  Promise<{
    id: string;
  }>;
};
export default function EditTestPage({ params }: PageProps) {
  const testId = params;
  const router = useRouter();
  const [test, setTest] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/test/${testId}`)
      .then(res => res.json())
      .then(setTest);
  }, [testId]);

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updatedQuestions = [...test.questions];
    updatedQuestions[index][field] = value;
    setTest({ ...test, questions: updatedQuestions });
  };

  const handleAnswerChange = (qIdx: number, aIdx: number, field: string, value: any) => {
    const questions = [...test.questions];
    questions[qIdx].answers[aIdx][field] = value;
    setTest({ ...test, questions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/test/${testId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(test),
    });
    router.push(`/test/${testId}/result`);
  };

  if (!test) return <p>Загрузка...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Редактировать тест: {test.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {test.questions.map((q: any, qIdx: number) => (
          <div key={q.id} className="border p-4 rounded">
            <input
              type="text"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qIdx, 'questionText', e.target.value)}
              className="w-full border px-2 py-1 mb-2"
              placeholder="Текст вопроса"
            />
            <select
              value={q.questionType}
              onChange={(e) => handleQuestionChange(qIdx, 'questionType', e.target.value)}
              className="w-full border px-2 py-1 mb-2"
            >
              <option value="single">Один вариант</option>
              <option value="multiple">Несколько вариантов</option>
              <option value="text">Свободный ответ</option>
            </select>
            {q.answers.map((a: any, aIdx: number) => (
              <div key={a.id} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={a.text}
                  onChange={(e) => handleAnswerChange(qIdx, aIdx, 'text', e.target.value)}
                  className="border px-2 py-1 flex-1"
                />
                <label>
                  <input
                    type="checkbox"
                    checked={a.isCorrect}
                    onChange={(e) => handleAnswerChange(qIdx, aIdx, 'isCorrect', e.target.checked)}
                    className="mr-1"
                  /> Правильный
                </label>
              </div>
            ))}
          </div>
        ))}
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Сохранить
        </button>
      </form>
    </div>
  );
}
