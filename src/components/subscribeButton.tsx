'use client';

import { useState } from 'react';

export default function SubscribeButton({
  courseId,
  isSubscribed,
  onSubscribe,
}: {
  courseId: string;
  isSubscribed: boolean;
  onSubscribe: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/courses/${courseId}/subscribe`, {
        method: 'POST',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка подписки');
      }

      onSubscribe();
    } catch (err: any) {
      setError(err.message || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <button
        className="bg-gray-300 text-gray-700 px-4 py-2 rounded w-full"
        disabled
      >
        Вы уже подписаны
      </button>
    );
  }

  return (
    <div className="w-full">
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        {loading ? 'Подписываемся...' : 'Подписаться'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
