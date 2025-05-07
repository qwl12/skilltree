// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const role = session.user.role;

  if (role === "user") {
    redirect("/profile/student");
  } else if (role === "teacher") {
    redirect("/profile/teacher");
  }
  
}
