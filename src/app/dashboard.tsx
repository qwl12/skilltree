// src/pages/dashboard.tsx
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

const DashboardRedirect = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Ждем, пока сессия загрузится

    if (!session) {
      router.push("/login"); // Если нет сессии, перенаправляем на страницу входа
    } else {
      // Перенаправляем в зависимости от роли
      if (session.user.role === "teacher") {
        router.push("/teacher/profile");
      } else if (session.user.role === "user") {
        router.push("/student/profile");
      }
    }
  }, [session, status, router]);

  return <div>Загрузка...</div>;
};

export default DashboardRedirect;
