import { notFound } from 'next/navigation';

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

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
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
          <p>{course.description}</p>
          <h2 className='font-bold mb-2 text-2xl mt-4'>Содержание</h2>
       
        </div>
      </div>

      <div className='max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10 space-y-6 mb-36 flex justify-center flex-col'>
        <button className='bg-green-600 hover:bg-green-700 text-white font-bold py-2  rounded  '>Подписаться</button>
        <img
          src={course.image}
          alt={course.title}
          className="w-20 h-20 object-cover rounded-xl"
        />
        <h1 className='font-bold mb-2 text-2xl mt-4'>{course.title}</h1>

        <p>Преподаватель: {course.teacher?.name}</p>
        <div className='flex gap-2'><img src="/countFollowers.svg" alt="" /> <p>{course.subscribers}</p></div>
        <div className='flex gap-2'><img src="/timeClock.svg" alt="" /> <p>{course.duration} ч.</p></div>
       
      </div>
    </div>
  );
}
