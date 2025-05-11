'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import CourseCard from '@/components/PopularCourses/CourseCard';


interface Course {
  id: string;
  title: string;
  image: string;
  description: string;
  subscribers: string;
  duration?: number;
  teacher: {
    name: string;
  };

}
interface Subscription {
  course: Course;
}
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [lastCourse, setLastCourse] = useState<Course | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (status === 'authenticated') {
      // СДЕЛАТЬ АПИ
      const fetchSubscriptions = async () => {
        try {
          const response = await fetch('/api/subscriptions');
          if (!response.ok) {
            throw new Error('Не удалось загрузить подписки');
          }
          const data = await response.json();
          setSubscriptions(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchSubscriptions();
      fetchRecommendedCourses();
      fetchLastCourse();
    }
  }, [status]);

  const fetchMyCourses = async () => {

    const courses: Course[] = [
      {
        id: '2',
        title: 'Python основы',
        description: 'Изучите основы React',
        image: '/ones.svg',
        subscribers: '100',
        teacher: {name: 'teacher nastya'},
        duration: 10,
      },

    ];
    setMyCourses(courses);
  };

  const fetchRecommendedCourses = async () => {
    const courses: Course[] = [
      {
        id: '2',
        title: '1С для начинающих',
        description: 'Изучите основы React',
        image: '/ones.svg',
        subscribers: '100',
        teacher: {name: 'teacher nastya'},
        duration: 10,
      },

    ];
    setRecommendedCourses(courses);
  };

  const fetchLastCourse = async () => {
    const course: Course = {
        id: '2',
        title: 'React для начинающих',
        description: 'Изучите основы React',
        image: '/Python.svg',
        subscribers: '100',
        teacher: {name: 'teacher nastya'},
        duration: 10,

    };
    setLastCourse(course);
  };

  if (status === 'loading') {
    return <p className="text-center mt-10">Загрузка...</p>;
  }

  if (status === 'unauthenticated') {
    return <p className="text-center mt-10">Пожалуйста, войдите в систему, чтобы просмотреть дашборд.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 ">
      <h1 className="text-3xl font-bold mb-6">Добро пожаловать, {session?.user.name}!</h1>
    <div className='flex flex-wrap'>
      {lastCourse && (
        <div className="mb-8">
          <h2 className='text-2xl font-bold mb-4'>Продолжить обучение</h2>
          <CourseCard course={lastCourse} />
        </div>
      )}
  </div>
      <div className="mb-8">
      <h1 className='text-2xl font-bold mb-6'>Мои подписки</h1>
      {subscriptions.length === 0 ? (
        <p>У вас нет подписок.</p>
      ) : (
        <div className="flex gap-4 flex-wrap">
          {subscriptions.map(({ course }) => (
            <CourseCard key={course.id} course={course}  />
          ))}
        </div>
      )}
      </div>

      <div >

        <h2 className='text-2xl font-bold mb-4'>Рекомендуемые курсы</h2>
        <div className="flex gap-6">
          {recommendedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
 
  );
}
