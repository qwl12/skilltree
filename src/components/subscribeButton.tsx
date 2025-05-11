'use client';

import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';
import axios from 'axios';

interface SubscribeButtonProps {
  courseId: string;
}

export default function SubscribeButton({ courseId }: SubscribeButtonProps) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (!session) {
      signIn(); 
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('/api/subscribe', {
        courseId,
      });

      if (res.status === 200) {
        setSubscribed(true);
        alert('Вы успешно подписались на курс!');
      } else {
        alert('Ошибка при подписке на курс.');
      }
    } catch (error) {
      console.error('Ошибка при подписке:', error);
      alert('Произошла ошибка. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <p>Загрузка...</p>;
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading || subscribed}
      className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${
        subscribed ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {subscribed ? 'Вы подписаны' : 'Подписаться'}
    </button>
  );
}
