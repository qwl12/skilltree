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

  const handleSubscribe = async () => {
    setLoading(true);
    await fetch(`/api/courses/${courseId}/subscribe`, {
      method: 'POST',
    });
    setLoading(false);
    onSubscribe();
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
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
    >
      {loading ? 'Подписываемся' : 'Подписаться'}
    </button>
  );
}
