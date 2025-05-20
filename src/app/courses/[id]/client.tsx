'use client';

import { useState } from 'react';
import SubscribeButton from '@/components/subscribeButton';

import Link from 'next/link';
import MDEditor from '@uiw/react-md-editor';
import Markdown from '@uiw/react-markdown-preview';


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


  const handleEdit = () => {
    setIsEditing(true);
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
    <div className="max-w-5xl mx-auto p-6 mt-10 mb-36 flex gap-10 ">
  
      <div className='shadow-xl rounded-2xl  p-6'>
        {isEditing ? (
          <>
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
              className="text-3xl font-bold mb-2 p-2 border rounded-md"
            />

         

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
                    backgroundColor: '#f9f9f9',  
                    padding: '1.5rem',
                    borderRadius: '8px',
                    color: '#333',
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
                src={image || '/defaultCourseImage.png'}
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
      <div className='w-full'>
        <h2 className="text-2xl font-semibold mb-2">О курсе</h2>
        <div className="p-4 bg-gray-50 rounded-xl">
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
  );
}
