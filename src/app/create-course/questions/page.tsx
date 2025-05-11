'use client';
import { useEffect, useState } from 'react';
import QuestionForm from '@/components/QuestionForm';
import { useRouter } from 'next/navigation';

const CreateQuestionsPage = () => {
  const router = useRouter();
  const [testId, setTestId] = useState<string | null>(null);

  useEffect(() => {
    const storedTestId = localStorage.getItem('testId');

    // Если testId нет в localStorage, перенаправляем на страницу создания теста
    if (!storedTestId) {
      router.push('/create-course/tests');
      return;
    }

    // Обновляем состояние только если testId в localStorage отличается от текущего состояния
    if (storedTestId !== testId) {
      setTestId(storedTestId);
    }
  }, [testId, router]); // Добавляем testId в зависимости, чтобы избежать цикличности

  // Пока нет testId, не отображаем форму
  if (!testId) return null;

  const handleNext = (testId: string) => {
    console.log('Test ID:', testId);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold">Создание вопросов для теста</h2>
      <QuestionForm testId={testId} onNext={handleNext} />
    </div>
  );
};

export default CreateQuestionsPage;
