import Link from 'next/link';
import '../../styles/tailwind.css';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    image: string;
    description: string;
    subscribers: string;
    duration?: number;
    teacher: {
      name: string;
    };
  };
}

export default function PopularCourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`}>
    <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl/10 transition max-w-md w-90 flex flex-col inset-shadow-sm  ">
    <div className="flex justify-between items-start w-80">
        <h3 className="text-xl text-black font-semibold">
          {course.title}
        </h3>
        <img
          src={course.image}
          alt={course.title}
          className="w-20 h-20 object-cover rounded-xl "
        />
        </div>
    <div className='flex flex-col gap-2 justify-between'>
    <p className="text-gray-600 text-sm mb-1">
      <span className="font-medium">{course.teacher?.name}</span>
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
       
      </div>
 
  </Link>
  );
}
