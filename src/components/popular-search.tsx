'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const PopularTags = () => {
  const [tags, setTags] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    fetch('/api/popular-tags')
      .then(res => res.json())
      .then(setTags);
  }, []);

  return (
  
      
       <section className="py-8  flex flex-col items-center-safe">
            <div>
              <h2 className="text-4xl text-black font-bold mb-8">Часто ищут</h2>
              <div className="flex flex-wrap justify-center gap-7">
                {tags.map(tag => (
                  <Link
                    key={tag.name}
                    href={`/search?tags=${encodeURIComponent(tag.name)}`}
                    className="px-3 py-1 border rounded-full bg-gray-100 hover:bg-green-100 transition"
                  >
                    #{tag.name} ({tag.count})
                  </Link>
                ))}
              </div>
            </div>
          </section>
   
  );
};

export default PopularTags;
