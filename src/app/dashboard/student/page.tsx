
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "user") {
    redirect("/login");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Панель студента</h1>
      <p>Добро пожаловать, {session.user.name}!</p>
      <p>Здесь вы можете просматривать свои курсы, прогресс и материалы.</p>
    </div>
  );
}
