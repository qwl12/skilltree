'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import VerifyEmailButton from '@/components/VerifyButton';
import { useRouter } from 'next/navigation';
import UploadFile from '@/components/UploadFile';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [name, setName] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmailVerified(!!session.user.emailVerified);
      setAvatarUrl(session.user.image || '');
    }
  }, [session]);

const handleAvatarUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetch("/api/profile/avatar", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (data.avatarUrl) {
    await update();
    setAvatarUrl(data.avatarUrl);
  } else {
    alert("Ошибка загрузки");
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
      console.error('Ошибка при обновлении имени:', error);
      alert('Ошибка при обновлении имени');
    }
  };

  if (status === 'loading') {
    return <p className=" text-gray-500">Загрузка профиля...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6  rounded-2xl mt-10 mb-36 ">
      <h1 className="text-3xl font-bold text-gray-800 py-8">Профиль</h1>
      <div className='flex justify-center'>
        <div className="flex flex-col gap-4">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-45 h-45 rounded-full object-cover shadow-md"
            />
          )}
       <UploadFile
          onUpload={handleAvatarUpload}
          previewUrl={avatarUrl}
          label="Загрузить аватар"
        />
      </div>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-2xl  space-y-8">  
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Отображаемое имя:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleNameUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Сохранить имя
        </button>
      </div>
      <div className="space-y-2">
        <p className="text-gray-700 font-semibold">
          Электронная почта: <span className="font-normal">{session?.user?.email}</span>
        </p>

        {emailVerified ? (
          <p className="text-green-600 font-medium">Почта подтверждена ✅</p>
        ) : (
          <>

            <VerifyEmailButton email={session?.user?.email ?? ''}  />
          </>
        )}
      </div>

      <div className="space-y-1">

       <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Смена пароля:</label>
        <button
          onClick={async () => {
            try {
              const response = await axios.post('/api/auth/reset-request', {
                email: session?.user?.email,
              });
              if (response.status === 200) {
                alert('Письмо для сброса пароля отправлено');
              } else {
                alert('Ошибка при отправке письма');
              }
            } catch (err) {
              console.error(err);
              alert('Ошибка при отправке запроса');
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Отправить письмо для сброса пароля
        </button>
      </div>
      </div>
    </div>
  </div>
  </div>
  );
}
