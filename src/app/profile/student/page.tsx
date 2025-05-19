'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import VerifyEmailButton from '@/components/VerifyButton';


export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [name, setName] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmailVerified(!!session.user.emailVerified);
      setAvatarUrl(session.user.image || '');
    }
  }, [session]);

const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetch("/api/profile/avatar", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (data.avatarUrl) {
  await update();
  console.log(session?.user)
  setAvatarUrl(data.avatarUrl);
  }
};

  const handleNameUpdate = async () => {
    try {
      const response = await axios.post('/api/profile/update', { name });
      if (response.status === 200) {
        alert('Имя успешно обновлено');
        await update();
      } else {
        alert('Ошибка при обновлении имени');
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса на обновление имени:', error);
      alert('Ошибка при обновлении имени');
    }
  };

  if (status === 'loading') return <p className="text-center text-gray-500">Загрузка...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10 space-y-6 mb-36">
      <h1 className="text-2xl font-bold text-center">Профиль студента</h1>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Имя:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none"
        />
        <button
          onClick={handleNameUpdate}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Сохранить
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Аватар:</label>

       {avatarUrl && (
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full mb-4" />
        )}

        <input type="file" accept="image/*" onChange={handleUpload} />
      </div>

      <div className="space-y-1">
        <p>Электронная почта: {session?.user?.email}</p>
        {emailVerified ? (
          <p className="text-green-600">Почта подтверждена</p>
        ) : (
          <VerifyEmailButton email={session?.user?.email ?? ''} />
        )}
      </div>
    </div>
  );
}
