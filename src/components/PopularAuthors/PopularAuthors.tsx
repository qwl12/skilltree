'use client';

import { useEffect, useState } from "react";
import PopularAuthorCard from "./AuthorCard";

interface Author {
  id: string;
  name: string;
  avatarUrl: string;
  followersCount: number;
  coursesCount: number;
}

export default function PopularAuthorsList() {
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await fetch("/api/popular-authors");
        const data = await res.json();
        setAuthors(data);
      } catch (error) {
        console.error("Ошибка при загрузке авторов", error);
      }
    };

    fetchAuthors();
  }, []);

  return (
 
   <section className="py-8 px-17 flex flex-col items-center">
        <div>
          <h2 className="text-4xl text-black font-bold mb-8">Популярные авторы</h2>
          <div className="flex flex-wrap justify-center gap-7">
            {authors.map((author) => (
          <PopularAuthorCard key={author.id} author={author} />
        ))}
          </div>
        </div>
      </section>
     );
}
