// src/components/profile/teacher/TeacherProfile.tsx
import { useSession } from "next-auth/react";
import Link from "next/link";

const TeacherProfile = () => {
  const { data: session } = useSession();

  if (!session) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold">Профиль преподавателя: {session.user.name}</h1>

      <div className="mt-6">
        <h2 className="text-xl font-medium">Мои курсы</h2>
        <ul className="list-disc pl-6">
          {/* Здесь будут курсы преподавателя */}
          <li>Курс 1</li>
          <li>Курс 2</li>
          <li>Курс 3</li>
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-medium">Личная информация</h2>
        <p>Электронная почта: {session.user.email}</p>
        <p>Роль: Преподаватель</p>
        <Link href="/teacher/dashboard">
          <a className="text-green-600 hover:underline">Перейти к Dashboard</a>
        </Link>
      </div>
    </div>
  );
};

export default TeacherProfile;
