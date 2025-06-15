'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

import Markdown from '@uiw/react-markdown-preview';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface ModuleFormProps {
  courseId: string;
}
export const ModuleForm: React.FC<ModuleFormProps> = ({ courseId }) => {
  const router = useRouter();
  const { id: moduleId } = useParams();

  const [moduleData, setModuleData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(!moduleId); // если нет id — сразу режим создания
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!moduleId) return;

    async function fetchModule() {
      const res = await fetch(`/api/modules/${moduleId}`);
      if (!res.ok) return;

      const data = await res.json();
      setModuleData(data);
      setTitle(data.title);
      setDescription(data.description);
    }

    fetchModule();
  }, [moduleId]);

  const handleSave = async () => {
    const method = moduleId ? 'PUT' : 'POST';
    const url = moduleId ? `/api/modules/${moduleId}` : '/api/modules/create';

  const bodyData = {
    title,
    description,
    ...(moduleId ? {} : { courseId }), // при создании передаем courseId
  };

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
    });

    if (res.ok) {
      const savedModule = await res.json();
      setModuleData(savedModule);
      setIsEditing(false);

      if (!moduleId) {
        // при создании перенаправим на страницу редактирования этого модуля
        router.push(`/modules/${savedModule.id}`);
      }
    } else {
      alert('Ошибка при сохранении модуля');
    }
  };

  if (moduleId && !moduleData) return <p>Загрузка...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">{moduleId ? 'Модуль' : 'Создать модуль'}</h1>

      {isEditing ? (
        <>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Название модуля"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label className="block mb-1 font-medium mt-4">Описание модуля</label>
          <div className="border rounded">
            <MDEditor
              value={description}
              onChange={(val = '') => setDescription(val)}
              height={300}
              style={{

                padding: '1rem',
                borderRadius: '8px',
 
              }}
              className="rounded-md shadow"
            />
          </div>

          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
          >
            Сохранить
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold">{moduleData.title}</h2>
          <div className="prose max-w-none">
            <Markdown
              source={moduleData.description}
              style={{
                backgroundColor: '#f9f9f9',
                padding: '1rem',
                borderRadius: '8px',
                color: '#333',
              }}
              className="rounded-md shadow"
              wrapperElement={{ 'data-color-mode': 'light' }}
            />
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Редактировать
          </button>
        </>
      )}
    </div>
  );
}
