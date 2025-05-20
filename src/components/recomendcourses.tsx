'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';


type Tag = {
  tag: {
    name: string;
  };
};

type Course = {
  id: string;
  title: string;
  image: string;
  tags: Tag[];
  subscribers: number;
  duration: number;
};

const RecommendedCourses = ({ userId }: { userId: string }) => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/recommended-courses?userId=${userId}`)
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error('Ошибка загрузки рекомендованных курсов:', err));
  }, [userId]);

  return (
    <div className="py-8 px-17">
      <h2 className="text-3xl font-bold mb-8">Рекомендуемые курсы</h2>
      <div className="flex flex-wrap justify-center gap-7">
        {courses.map(course => (
          <Link
            href={`/courses/${course.id}`}
            key={course.id}
            className="p-4  rounded-xl hover:shadow-md min-w-90  gap-4 shadow-lg hover:shadow-xl/10 transition w-60 flex inset-shadow-sm"
          >
            <img
              src={course.image || '/placeholderCourse.png'}
        
              alt={course.title}
              className="max-w-40 h-40 object-fit rounded-xl mb-2"
            />
            <div className='flex flex-col gap-2 w-60'>
              <h3 className="font-semibold">{course.title}</h3>
              <p className="text-sm text-gray-500">
                {course.tags.map((t) => `#${t.tag.name}`).join(' ')}
              </p>
              <div className="flex gap-2">
        <img
        src={'/countFollowers.svg'}
        alt="logo"
        width={16}
        height={16}
        />
        <p className="text-gray-600 text-sm ">
         {course.subscribers}
        </p>
  
        <img
        src={'/timeClock.svg'}
        alt="logo"
        width={16}
        height={16}
        />
        <p className="text-gray-600 text-sm ">
         {course.duration} ч.
        </p>
    </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedCourses;
