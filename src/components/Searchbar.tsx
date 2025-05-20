'use client'

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';


export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className=" flex items-center gap-10 justify-center ">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Введите запрос..."
        className="w-full border p-2 rounded"
      />
      
      <button
        onClick={handleSearch}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Найти
      </button>
    </div>
  );
}
