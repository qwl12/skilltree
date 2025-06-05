'use client';

import { useState } from 'react';
import SubscribeButton from '@/components/subscribeButton';

import Link from 'next/link';
import MDEditor from '@uiw/react-md-editor';
import Markdown from '@uiw/react-markdown-preview';
import { CommentList } from '@/components/comments/CommentList';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


interface Lecture {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lectures: Lecture[];
}

interface Course {
  id: string;
  title: string;
  image: string;
  description: string;
  aboutCourse: string | null;
  difficulty: string | null;
  categoryId: string | null;
  subcategoryId: string | null;
  subscribers: number;
  teacherId: string;
  duration: number | null;
  createdAt: Date;
  updatedAt: Date;
  modules: Module[];
  isSubscribed: boolean;

  teacher: { name: string };
}

interface CourseDetailClientProps {
  course: Course;
    currentUserId: string | null;
}

export default function CourseDetailClient({ course, currentUserId }: CourseDetailClientProps) {
  const [isSubscribed, setIsSubscribed] = useState(course.isSubscribed);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedCourse, setUpdatedCourse] = useState(course);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };


  const handleImageUpdate = async () => {
    if (!selectedImage) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedImage);

    const res = await fetch(`/api/courses/${course.id}/update-image`, {
      method: 'PUT',
      body: formData,
    });

    if (res.ok) {
      router.refresh(); 
    } else {
      const error = await res.text();
      console.error('Ошибка загрузки изображения:', error);
    }

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const res = await fetch(`/api/courses/${updatedCourse.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCourse),
    });

    if (res.ok) {
      setIsEditing(false);
    } else {
      console.error('Ошибка при обновлении курса');
    }
  };

    const handleMarkdownChange = (value: string | undefined) => {
    setUpdatedCourse((prev) => ({
        ...prev,
        aboutCourse: value || '',  
    }));
    };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUpdatedCourse((prev) => ({
      ...prev,
      difficulty: e.target.value,
    }));
  };

  const getDifficultyColor = () => {
    switch (updatedCourse.difficulty?.toLowerCase()) {
      case 'beginner':
        return 'text-green-600';
      case 'intermediate':
        return 'text-yellow-600';
      case 'advanced':
        return 'text-red-600';
      default:
        return 'text-gray-700';
    }
  };

  const {
    title,
    image,
    description,
    aboutCourse,
    difficulty,
    teacher,
    teacherId,
    modules,
  } = updatedCourse;
 const isAuthor = currentUserId === teacherId;
  return (
    <div >
      <div className="max-w-2xl mx-auto p-6 mt-10 mb-36 flex gap-10">
      <div className='shadow-xl rounded-2xl  p-6 min-w-85'>
        {isEditing ? (
          <>
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
              className="text-2xl font-bold mb-2 p-2 border rounded-md"
            />

          <div className="max-w-3xl mx-auto p-6 space-y-6">

      
        <p className="mb-2 font-medium">Текущее изображение:</p>
        {course.image ? (
          <Image
            src={course.image}
            alt="Изображение курса"
            width={400}
            height={250}
            className="rounded-xl object-cover"
          />
        ) : (
          <p className="text-gray-500">Изображение не загружено</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Обновить изображение курса
        </label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        {preview && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-1">Предпросмотр:</p>
            <Image
              src={preview}
              alt="Предпросмотр"
              width={400}
              height={250}
              className="rounded-xl object-cover"
            />
          </div>
        )}

        <button
          onClick={handleImageUpdate}
          disabled={loading || !selectedImage}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          {loading ? 'Загрузка...' : 'Обновить изображение'}
        </button>
      </div>

            <div className="mb-4">
              <label htmlFor="difficulty" className="font-semibold">
                Сложность:
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={difficulty || ''}
                onChange={handleDifficultyChange}
                className="mb-4 p-2 border rounded-md w-full"
              >
                <option value="beginner">Начинающий</option>
                <option value="intermediate">Средний</option>
                <option value="advanced">Продвинутый</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="font-semibold">
                Описание курса:
              </label>
              <textarea
                name="description"
                value={description}
                onChange={handleChange}
                className="mb-4 p-2 border rounded-md w-full"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="aboutCourse" className="font-semibold">
                О курсе:
              </label>
              <MDEditor 
                style={{

                    padding: '1.5rem',
                    borderRadius: '8px',
         
                }}

                className="rounded-md shadow"
                value={aboutCourse || ''} onChange={handleMarkdownChange} />
            </div>

            <button
              onClick={handleSave}
              className="bg-blue-500 text-white p-2 rounded-md mt-4"
            >
              Сохранить изменения
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>

            <div className="mb-4">
              <img
                src={image || '/placeholderCourse.png'}
                alt="Course"
                className="w-full h-40 object-cover rounded-xl"
              />
            </div>

            <div className={`mb-4 font-semibold ${getDifficultyColor()}`}>
              Сложность: {difficulty}
            </div>
            <p className="mb-2 text-gray-600">Подписчиков: {course.subscribers}</p>
            <p className="mb-2">{description}</p>
            <p className="mb-2">Преподаватель: {teacher?.name}</p>

            <SubscribeButton
                
              courseId={course.id}
              isSubscribed={isSubscribed}
              onSubscribe={() => setIsSubscribed(true)}
            />
            {isAuthor && (
                <button
                onClick={handleEdit}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md mt-4 w-full "
                >
              Редактировать
            </button> )}
             
          </>
        )}
      </div>

      {/* Правая часть */}
      <div className='w-full min-w-200'>
        <h2 className="text-2xl font-semibold mb-2">О курсе</h2>
        <div className="p-4 bg-gray-50 rounded-xl max-w-128">
          <Markdown 
              style={{

                backgroundColor: '#f9f9f9',
                color: '#333',
              }}
              wrapperElement={{
                'data-color-mode': 'light',
              }}
          source={aboutCourse || ''} />
        </div>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Содержание</h2>
        {modules.map((module) => (
          <div key={module.id} className="mb-4">
            <Link href={`/modules/${module.id}`} className="text-xl font-medium text-blue-600 hover:text-blue-700">
              {module.title}
            </Link>
            <ul className="list-disc list-inside ml-4">
              {module.lectures.map((lecture) => (
                <li key={lecture.id}>
                  <Link href={`/lectures/${lecture.id}`} className="text-blue-600 hover:underline">
                    {lecture.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
     
    </div>
   
    </div>
    
  );
}
