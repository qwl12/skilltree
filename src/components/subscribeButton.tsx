import { useState } from 'react';

export default function SubscribeButton({
  courseId,
  isSubscribed,
  onSubscribe,
  onUnsubscribe,
}: {
  courseId: string;
  isSubscribed: boolean;
  onSubscribe: () => void;
  onUnsubscribe: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/courses/${courseId}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка подписки');
      }

      onSubscribe();
    } catch (err: any) {
      setError(err.message || 'Ошибка подписки');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!confirm('Вы уверены, что хотите отписаться от курса?')) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/courses/${courseId}/subscribe`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка отписки');
      }

      onUnsubscribe();
    } catch (err: any) {
      setError(err.message || 'Ошибка отписки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {isSubscribed ? (
        <button
          onClick={handleUnsubscribe}
          disabled={loading}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
        >
          {loading ? 'Отписка...' : 'Отписаться'}
        </button>
      ) : (
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          {loading ? 'Подписка...' : 'Подписаться'}
        </button>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
