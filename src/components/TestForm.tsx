'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';  // Импортируем useRouter

type Props = {
  moduleId: string;
  onNext: (moduleId: string) => void;
};

export default function TestForm({ moduleId, onNext }: Props) {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState<number | ''>('');
  const router = useRouter(); // Инициализация useRouter

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/tests/create', {
      method: 'POST',
      body: JSON.stringify({ title, duration: Number(duration), moduleId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Ошибка при создании теста');
      return;
    }

    const test = await res.json(); // Получаем данные о созданном тесте (если нужно)
    
    // Сохраняем testId в localStorage
    localStorage.setItem('testId', test.id);

    // Теперь перенаправляем на страницу создания вопросов
    console.log('Тест создан успешно:', test);
    onNext(moduleId); // Вызываем onNext, чтобы передать управление родительскому компоненту

    // Используем router.push для перехода на страницу создания вопросов
    router.push('/create-course/questions');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Название теста"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Длительность (мин)"
        value={duration}
        onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Создать тест
      </button>
    </form>
  );
}
