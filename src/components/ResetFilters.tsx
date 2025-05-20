'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasFilters =
    searchParams.has('q') ||
    searchParams.has('tags') ||
    searchParams.has('sort') ||
    searchParams.has('page');

  const handleReset = () => {
    router.push('/search');
  };

  if (!hasFilters) return null;

  return (
    <button
      onClick={handleReset}
      className="text-sm px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition"
    >
      Сбросить фильтры
    </button>
  );
}
