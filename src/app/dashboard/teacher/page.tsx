// app/dashboard/teacher/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TeacherDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "teacher") {
    redirect("/");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Панель преподавателя</h1>
      <p>Здравствуйте, {session.user.name}!</p>
      <p>Здесь вы можете управлять курсами, загружать материалы и отслеживать успеваемость студентов.</p>
    </div>
  );
}
