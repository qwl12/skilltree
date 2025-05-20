'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

const PopularTags = () => {
  const [tags, setTags] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    fetch('/api/popular-tags')
      .then((res) => res.json())
      .then((data) => setTags(data.slice(0, 12)));
  }, []);

  return (
    <section className="py-8 px-17">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12">Часто ищут</h2>

        <div
          className="
            grid gap-6
            grid-cols-2 
            sm:grid-cols-3 
            md:grid-cols-4 
            auto-rows-[120px]
          "
        >
          {tags.map((tag, index) => {

            let cardClasses = 'bg-blue-50 text-blue-800';

            if (index === 0) {
              cardClasses = 'bg-blue-600 text-white font-bold text-xl';
            }

            else if (index < 4) {
              cardClasses = 'bg-blue-100 text-blue-800 font-semibold';
            }

            else if (index === 4 || index === 7) {
              cardClasses = 'bg-blue-50 text-blue-800 col-span-2 row-span-2';
            }
            else if (index === 5 || index === 8 || index === 10) {
              cardClasses = 'bg-blue-100 text-blue-800 col-span-2';
            }
            else {
              cardClasses = 'bg-blue-50 text-blue-800';
            }

            return (
              <Link
                key={tag.name}
                href={`/search?tags=${encodeURIComponent(tag.name)}`}
                className={clsx(
                  'rounded-xl p-4 flex flex-col justify-between transition-transform hover:-translate-y-1 r',
                  cardClasses
                )}
              >
                <div className="truncate text-lg sm:text-xl">{tag.name}</div>
                <div className="text-sm sm:text-base mt-1">{tag.count} курсов</div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PopularTags;
