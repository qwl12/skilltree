// CourseForm.tsx
'use client';
import { useState } from 'react';

type Props = {
  onNext: (courseId: string) => void;
};

const CourseForm = ({ onNext }: Props) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    difficulty: '',
    teacherId: '', // Подставляется из текущего пользователя
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await fetch('/api/courses/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const text = await res.text(); // вместо res.json() — читаем как текст
      console.error('Ошибка при создании курса:', text);
      return;
    }

    const data = await res.json();
    onNext(data.id);
  } catch (error) {
    console.error('Ошибка сети или сервера:', error);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md shadow-md">
      <h2 className="text-xl font-bold">Создание курса</h2>
      <input
        name="title"
        placeholder="Название"
        onChange={handleChange}
        className="input"
        required
      />
      <textarea
        name="description"
        placeholder="Описание"
        onChange={handleChange}
        className="input"
      />
      <input
        name="image"
        placeholder="URL изображения"
        onChange={handleChange}
        className="input"
      />
      <input
        name="difficulty"
        placeholder="Сложность"
        onChange={handleChange}
        className="input"
      />
      <button type="submit" className="btn">Создать курс</button>
    </form>
  );
};

export default CourseForm;
