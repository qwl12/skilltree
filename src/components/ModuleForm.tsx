// src/components/ModuleForm.tsx
'use client';
import { useState } from 'react';

interface Props {
  courseId: string;
  onNext: (id: string) => void;
}

export default function ModuleForm({ courseId, onNext }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/modules/create', {
      method: 'POST',
      body: JSON.stringify({ title, description, courseId }),
    });

    const data = await res.json();
    if (res.ok) onNext(data.id);
    else alert(data.error);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Название модуля"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Описание модуля"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Далее
      </button>
    </form>
  );
}