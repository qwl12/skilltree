import SubscribeButton from '@/components/subscribeButton';
import { notFound } from 'next/navigation';


interface Lecture {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface Module {
  id: string;
  description: string;
  order: number;
  lectures: Lecture[];
}

interface Course {
  id: string;
  title: string;
  image: string;
  description: string;
  aboutCourse: string;
  subscribers: string;
  duration?: number;
  difficulty: string;
  teacher: {
    name: string;
  };
  modules: Module[];
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
          <p>{course.aboutCourse}</p>
          <h2 className='font-bold mb-2 text-2xl mt-4'>Содержание</h2>
          {course.modules.map((module) => (
            <div key={module.id} className='mb-4'>
              <h3 className='text-xl font-medium'>{module.description}</h3>
              <ul className='list-disc list-inside ml-4'>
                {module.lectures.map((lecture) => (
                  <li key={lecture.id}>{lecture.title}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className='max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl space-y-6 mb-36 flex justify-center flex-col'>
        <SubscribeButton courseId={id}/>
        <img
          src={course.image}
          alt={course.title}
          className="w-20 h-20 object-cover rounded-xl"
        />
        <h1 className='font-bold mb-2 text-2xl mt-4'>{course.title}</h1>
        {/* сделать реколор!!!!! */}
        
        <p className='mb-2 text-xl'>{course.difficulty} уровень</p>
        
        <p className='mb-1'>{course.description}</p>
       

        <p>{course.teacher?.name}</p>

        <div className='flex gap-2'><img src="/countFollowers.svg" alt="" /> <p>{course.subscribers}</p></div>
        <div className='flex gap-2'><img src="/timeClock.svg" alt="" /> <p>{course.duration} ч.</p></div>
       
      </div>
    </div>
  );
}
