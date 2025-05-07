"use client"
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  useEffect(() => {
    if (token) {
      fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Обработка ответа
        });
    }
  }, [token]);
  
  return (
    <div>
      <h1>Подтверждение электронной почты</h1>
      <p>Ваш токен: {token}</p>
    </div>
  );
}
