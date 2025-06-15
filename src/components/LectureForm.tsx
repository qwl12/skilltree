'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

import Markdown from '@uiw/react-markdown-preview';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface LectureFormProps {
  moduleId: string;
}
export const LectureForm: React.FC<LectureFormProps> = ({ moduleId }) => {
  const router = useRouter();
  const { id: lectureId } = useParams();

  const [lecture, setLecture] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(!lectureId);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!lectureId) return;

    async function fetchLecture() {
      const res = await fetch(`/api/lectures/${lectureId}`);
      if (!res.ok) return;

      const data = await res.json();
      setLecture(data);
      setTitle(data.title);
      setContent(data.content);
    }

    fetchLecture();
  }, [lectureId]);

  const handleSave = async () => {
  const method = lectureId ? 'PUT' : 'POST';
  const url = lectureId ? `/api/lectures/${lectureId}` : '/api/lectures/create';

  const bodyData = {
    title,
    content,
    ...(lectureId ? {} : { moduleId }), // важное исправление
  };

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyData),
  });

  if (res.ok) {
    const savedLecture = await res.json();
    setLecture(savedLecture);
    setIsEditing(false);

    if (!lectureId) {
      router.push(`/lectures/${savedLecture.id}`);
    }
  } else {
    alert('Ошибка при сохранении лекции');
  }
};


  if (lectureId && !lecture) return <p>Загрузка...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">{lectureId ? 'Лекция' : 'Создать лекцию'}</h1>

      {isEditing ? (
        <>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Название лекции"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label className="block mb-1 font-medium mt-4">Содержимое лекции</label>
          <div className="border rounded">
            <MDEditor
              value={content}
              onChange={(val = '') => setContent(val)}
              height={400}
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
          <h2 className="text-xl font-semibold">{lecture.title}</h2>
          <div className="prose max-w-none">
            <Markdown
              source={lecture.content}
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
