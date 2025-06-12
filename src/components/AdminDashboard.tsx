'use client';

import { useEffect, useState } from 'react';

type Course = {
  id: string;
  title: string;
  approved: boolean;
  teacher: {
    name: string;
  };
  tags: { tag: { name: string } }[];
};

export default function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch('/api/admin/unapproved-courses')
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Ошибка ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then(data => setCourses(data))
      .catch(err => console.error('Ошибка загрузки:', err));
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/course/${id}/approve`, {
        method: 'POST',
      });
      if (res.ok) {
        setCourses(prev => prev.filter(course => course.id !== id));
      } else {
        const text = await res.text();
        throw new Error(`Ошибка ${res.status}: ${text}`);
      }
    } catch (err) {
      console.error('Ошибка при одобрении курса:', err);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/course/${id}/delete`, {
  method: 'DELETE',
});
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 ml-200">Неодобренные курсы</h1>
      {courses.length === 0 ? (
        <p>Нет курсов на модерации.</p>
      ) : (
        <ul className="space-y-4 flex flex-col flex-wrap min-w-100">
          {courses.map(course => (
            <li
              key={course.id}
              className="border p-4 mx-auto max-w-300 min-w-150 rounded-xl shadow-md bg-white"
            >
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-sm text-gray-500">
                Автор: {course.teacher?.name || 'Неизвестно'}
              </p>
              <p className="text-sm text-gray-500">
                Теги: {course.tags.map(t => `#${t.tag.name}`).join(' ')}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleApprove(course.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Одобрить
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
