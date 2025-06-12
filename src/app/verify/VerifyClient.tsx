'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyClient() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const currentToken = searchParams.get('token');
    if (currentToken) {
      setToken(currentToken);
      fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: currentToken }),
      })
        .then((res) => res.json())
        .then((data) => {
          // обработка
        });
    }
  }, [searchParams]);

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex flex-col justify-center items-center w-200 shadow-md p-6 rounded-xl ml-10 mt-8 mb-73 '>
        <h1 className='text-bold text-2xl mb-5'>Подтверждение электронной почты</h1>
        <p>Вы успешно подтвердили электронную почту</p>
        <Link href='/profile/student' className='hover:text-blue-600 mt-3 text-bold'>
          В профиль
        </Link>
      </div>
    </div>
  );
}
