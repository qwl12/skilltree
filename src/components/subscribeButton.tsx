import { useState } from "react";

export default function SubscribeButton({
  courseId,
  isSubscribed,
  onSubscribe,
  onUnsubscribe,
  onCountChange,
}: {
  courseId: string;
  isSubscribed: boolean;
  onSubscribe: () => void;
  onUnsubscribe: () => void;
  onCountChange: (count: number) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hover, setHover] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/courses/${courseId}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка подписки');

      onSubscribe();
      onCountChange(data.count);
    } catch (err: any) {
      setError(err.message || 'Ошибка подписки');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/courses/${courseId}/subscribe`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка отписки');

      onUnsubscribe();
      onCountChange(data.count);
    } catch (err: any) {
      setError(err.message || 'Ошибка отписки');
    } finally {
      setLoading(false);
    }
  };

  const baseClasses = 'px-10 py-2 font-semibold rounded-md transition-all duration-300';
  const buttonClasses = isSubscribed
    ? hover
      ? 'bg-red-600 text-white'
      : 'bg-gray-200 text-black hover:bg-red-600 hover:text-white'
    : 'bg-green-600 text-white hover:bg-green-700';

  return (
    <div className="inline-block">
      <button
        onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
        disabled={loading}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`${baseClasses} ${buttonClasses}`}
      >
        {loading
          ? isSubscribed
            ? 'Обработка...'
            : 'Подписка...'
          : isSubscribed
          ? hover
            ? 'Отписаться'
            : 'Вы подписаны'
          : 'Подписаться'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
