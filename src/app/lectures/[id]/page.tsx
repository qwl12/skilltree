'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

import Markdown from '@uiw/react-markdown-preview';
import { CommentList } from '@/components/comments/CommentList';


const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export default function LecturePage() {
  const { id: lectureId } = useParams();
  const { data: session } = useSession();

  const [lecture, setLecture] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!lectureId) return;

    const fetchLecture = async () => {
      const res = await fetch(`/api/lectures/${lectureId}`);
      const data = await res.json();
      setLecture(data);
      setTitle(data.title);
      setContent(data.content);
    };

    fetchLecture();
  }, [lectureId]);

  const handleSave = async () => {
    const res = await fetch(`/api/lectures/${lectureId}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      const updated = await res.json();
      setLecture(updated);
      setIsEditing(false);
    } else {
      alert('Ошибка при сохранении');
    }
  };

  if (!lecture) return <p>Загрузка...</p>;

  const isAuthor = session?.user?.id === lecture.module?.course?.teacherId;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('lectureId', lectureId as string);

  const res = await fetch('/api/upload/lecture', {
    method: 'POST',
    body: formData,
  });

  if (res.ok) {
    const updated = await res.json();
    setLecture(updated); 
  } else {
    alert('Ошибка при загрузке файла');
  }
};



  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Лекция</h1>

      {isEditing ? (
        <>
          <input
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
            {isEditing && (
            <div className="mt-4">
              <label className="block mb-1 font-medium">Прикрепить файл:</label>
              <input type="file" onChange={handleFileUpload} />
            </div>
          )}
          <label className="block mb-1 font-medium">Текст лекции</label>
          <div className="border rounded">
            
            <MDEditor
              value={content}
              onChange={(val = '') => setContent(val)}
              height={500}
               style={{
                backgroundColor: '#f9f9f9', 
                padding: '1.5rem',
                borderRadius: '8px',
                color: '#333',
              }}
              className="rounded-md shadow"
            />
          </div>
        
          <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
            Сохранить
          </button>
          

          </>
      ) : (
        <>
          {lecture.fileUrl && (
            <div className="mt-4">
              <a
                href={lecture.fileUrl}
                download
                className="text-blue-600 underline hover:text-blue-800"
              >
                Скачать файл к лекции
              </a>
            </div>
            
          )}
          
          <h2 className="text-xl font-semibold">{lecture.title}</h2>
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
            
              source={lecture.content} />
          </div>
          {isAuthor && (
            <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
              Редактировать
            </button>
          )}

           <div className='max-w-2xl mx-auto p-6 '>
              <CommentList courseId={lecture.module?.course?.id} lectureId={lecture.id} />
              </div>
        </>
      )}
    </div>
  );
}
