'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Markdown from '@uiw/react-markdown-preview';
import Link from 'next/link';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface Test {
  id: string;
  title: string;
  description: string;
  duration: number;
}

export default function ModulePage() {
  const { id: moduleId } = useParams();
  const { data: session } = useSession();

  const [module, setModule] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!moduleId) return;

    const fetchModule = async () => {
      const res = await fetch(`/api/modules/${moduleId}`);
      const data = await res.json();
      console.log('Fetched module data:', data);
      setModule(data);
      setTitle(data.title);
      setDescription(data.description);
    };

    fetchModule();
  }, [moduleId]);

  const handleSave = async () => {
    const res = await fetch(`/api/modules/${moduleId}`, {
      method: 'PUT',
      body: JSON.stringify({ title, description }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      const updated = await res.json();
      setModule(updated);
      setIsEditing(false);
    } else {
      alert('Ошибка при сохранении');
    }
  };

  if (!module) return <p>Загрузка...</p>;

  const isAuthor = session?.user?.id === module.course?.teacherId;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Модуль</h1>

      {isEditing ? (
        <>
          <input
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="border rounded">
            <MDEditor
              style={{
                backgroundColor: '#f9f9f9',
                padding: '1.5rem',
                borderRadius: '8px',
                color: '#333',
              }}
              className="rounded-md shadow"
              value={description}
              onChange={(val = '') => setDescription(val)}
              height={600}
            />
          </div>
          <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
            Сохранить
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold">{module.title}</h2>
          <div className="prose max-w-none">
            <Markdown
              style={{
                backgroundColor: '#f9f9f9',
                padding: '1.5rem',
                borderRadius: '8px',
                color: '#333',
              }}
              className="rounded-md shadow"
              wrapperElement={{
                'data-color-mode': 'light',
              }}
              source={module.description}
            />
          </div>
          {isAuthor && (
            <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
              Редактировать
            </button>
          )}
        </>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Лекции</h3>
        <ul className="list-disc pl-6 space-y-2">
          {module.lectures?.map((lecture: any) => (
            <li key={lecture.id}>
              <Link href={`/lectures/${lecture.id}`} className="text-blue-600 hover:underline">
                {lecture.title || 'Без названия'}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Тесты</h2>
        {module.tests && module.tests.length > 0 ? (
          <ul className="list-disc pl-6 space-y-2">
            {module.tests.map((test: Test) => (
              <li key={test.id}>
                <Link
                  href={`/test/${test.id}/start`}
                  className="text-blue-500 hover:underline"
                >
                  {test.title || 'Без названия'}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">Нет доступных тестов.</p>
        )}
      </div>
    </div>
  );
}
