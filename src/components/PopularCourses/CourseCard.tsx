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
    <div className="bg-white rounded-xl shadow-xl/30 hover:bg-gray-100">
    <div className="flex justify-between items-start">
        <h3 className="text-xl text-black font-semibold max-w-[70%]">
          {course.title}
        </h3>
        <img
          src={course.image}
          alt={course.title}
          className="w-20 h-20 object-cover rounded-xl ml-3"
        />
      </div>
    <p className="text-gray-600 text-sm mb-1">
      👨‍🏫 Преподаватель: <span className="font-medium">{course.teacher.name}</span>
    </p>
    <p className="text-gray-600 text-sm mb-1">
      👥 Подписчиков: {course.subscribers}
    </p>
    {course.duration !== undefined && (
      <p className="text-gray-600 text-sm">Длительность: {course.duration} ч.</p>
    )}
  </div>
  );
}
