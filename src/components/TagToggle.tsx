'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface TagToggleProps {
  tag: string;
  active: boolean;
}

export default function TagToggle({ tag, active }: TagToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    const tags = params.get('tags')?.split(',').filter(Boolean) || [];

    if (active) {

      const newTags = tags.filter((t) => t !== tag);
      if (newTags.length > 0) {
        params.set('tags', newTags.join(','));
      } else {
        params.delete('tags');
      }
    } else {

      tags.push(tag);
      const uniqueTags = [...new Set(tags)];
      params.set('tags', uniqueTags.join(','));
    }

    params.set('page', '1');

    router.push(`/search?${params.toString()}`);
  }, [searchParams, tag, active, router]);

  return (
    <button
      onClick={handleClick}
      className={`px-2 py-0.5 rounded-full text-sm transition ${
        active
          ? 'bg-green-600 text-white hover:bg-green-700'
          : 'bg-green-100 text-green-700 hover:bg-green-200'
      }`}
    >
      #{tag}
    </button>
  );
}
