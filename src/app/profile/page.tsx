// pages/profile.tsx
'use client'
import { useSession, getSession } from "next-auth/react";


const Profile = () => {
  const { data: session } = useSession();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Профиль пользователя</h1>
      <p>Имя: {session?.user?.name}</p>
      <p>Email: {session?.user?.email}</p>
    </div>
  );
};

export default Profile;
