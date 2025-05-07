import SubscribeButton from '@/components/subscribeButton';
import { notFound } from 'next/navigation';


interface Course {
  id: string;
  title: string;
  image: string;
  description: string;
  fullDescription: string;
  subscribers: string;
  duration?: number;
  difficulty: 'Начальный' | 'Средний' | 'Продвинутый';
  teacher: {
    name: string;
  };
}

interface CourseDetailPageProps {
  params: { id: string };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${id}`);
  if (!res.ok) {
    notFound();
  }

  const course: Course = await res.json();

  return (
    <div className='max-w-3xl mx-auto p-6 bg-white mt-10 mb-36 flex'>
      <div>
        <div>
          <h1 className='font-bold mb-2 text-2xl'>О курсе</h1>
          <p>{course.fullDescription}</p>
          <h2 className='font-bold mb-2 text-2xl mt-4'>Содержание</h2>
       
        </div>
      </div>

      <div className='max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10 space-y-6 mb-36 flex justify-center flex-col'>
        <SubscribeButton courseId={id}/>
        <img
          src={course.image}
          alt={course.title}
          className="w-20 h-20 object-cover rounded-xl"
        />
        <p className='m-0'>{course.description}</p>
        <h1 className='font-bold mb-2 text-2xl mt-4'>{course.title}</h1>

        <p>Преподаватель: {course.teacher?.name}</p>
        <div className='flex gap-2'> <p className='text-green text-2xl'>{course.difficulty}</p></div>
        <div className='flex gap-2'><img src="/countFollowers.svg" alt="" /> <p>{course.subscribers}</p></div>
        <div className='flex gap-2'><img src="/timeClock.svg" alt="" /> <p>{course.duration} ч.</p></div>
       
      </div>
    </div>
  );
}
