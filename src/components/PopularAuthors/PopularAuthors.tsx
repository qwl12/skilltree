"use client";

import { useEffect, useState } from "react";
import PopularAuthorCard from "./AuthorCard";

interface Author {
  id: string;
  name: string;
  avatarUrl: string;
  followersCount: number;
}

export default function PopularAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      const res = await fetch("/api/popular-authors");
      const data = await res.json();
      console.log("Авторы:", data);
      setAuthors(data);
    };
    fetchAuthors();
  }, []);

  return (
    <section className="py-8 px-3 flex flex-col items-center">
      <h2 className="text-4xl text-black font-bold mb-8">Популярные авторы</h2>
      <div className="flex flex-wrap justify-center gap-7">
        {authors.map((author) => (
          <PopularAuthorCard key={author.id} author={author} />
        ))}
      </div>
    </section>
  );
}
