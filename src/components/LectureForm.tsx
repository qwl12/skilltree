'use client';
import { useState } from 'react';

interface Props {
  moduleId: string;
  onNext: () => void;
}

export default function LectureForm({ moduleId, onNext }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/lectures/create', {
      method: 'POST',
      body: JSON.stringify({ title, content, moduleId }),
    });

    if (res.ok) onNext();
    else alert('Ошибка при создании лекции');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Название лекции"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Содержимое лекции"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Далее
      </button>
    </form>
  );
}