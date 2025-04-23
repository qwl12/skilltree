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
    <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl/10 transition max-w-md w-90 flex flex-col inset-shadow-sm gap-2">
    <div className="flex justify-between items-start w-80">
        <h3 className="text-xl text-black font-semibold max-w-[70%] ">
          {course.title}
        </h3>
        <img
          src={course.image}
          alt={course.title}
          className="w-20 h-20 object-cover rounded-xl "
        />
      </div>
    <p className="text-gray-600 text-sm mb-1">
      Преподаватель: <span className="font-medium">{course.teacher.name}</span>
    </p>
    <p className="text-gray-600 text-sm mb-1">
      Подписчиков: {course.subscribers}
    </p>
    {course.duration !== undefined && (
      <p className="text-gray-600 text-sm">Длительность: {course.duration} ч.</p>
    )}
  </div>
  );
}
