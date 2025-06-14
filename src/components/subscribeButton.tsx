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

  const handleUnsubscribe = async () => {
    if (!confirm("Вы уверены, что хотите отписаться от курса?")) return;

      const res = await fetch(`/api/courses/${courseId}/subscribe`, {
        method: 'DELETE',
      });
    if (res.ok) {
      alert("Вы успешно отписались от курса");
    } else {
      alert("Ошибка при отписке");
    }
  };
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
          onClick={handleUnsubscribe}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Отписаться
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
