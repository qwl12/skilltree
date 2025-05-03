"use client";

import { div } from "framer-motion/client";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  subscribers: string;
  duration: string;
  teacher: {
    name: string;
  };
}

const CourseSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 0) {
        handleSearch(query);
      } else {
        setResults([]);
        setError(null);
      }
    }, 500); 

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSearch = async (q: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/courses/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError("Произошла ошибка при поиске");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <input
        type="text"
        placeholder="Поиск по названию или преподавателю"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded-lg mb-4"
      />
      <div>

      </div>
      {loading && <p className="text-gray-600">Загрузка...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <ul className="space-y-3">
        {results.map((course) => (
          <li key={course.id} className=" p-4 rounded-lg shadow bg-gray-50">
            <div className="flex gap-6">
              <img
                  src={course.image}
                  alt={course.title}
                  className="w-30 h-30 object-cover rounded-xl"
                />
                <div className="flex flex-col gap-2 justify-center">
                  <h3 className="text-2xl font-semibold">{course.title}</h3>
                  {course.teacher?.name && (
                    <p className="text- text-gray-600"> {course.teacher.name}</p>
                  )}
                  <p className="text-sm text-gray-700">{course.description}</p>
                  <div className="flex gap-1 items-center">
                  <img
                    src={'/countFollowers.svg'}
                    alt="logo"
                    width={16}
                    height={16}
                  />
                  <p className="text-gray-600 text-sm ">
                     {course.subscribers}
                  </p>
               
                   {course.duration !== undefined && ( <div className="flex gap-1 items-center">
                    <img
                    src={'/countCourses.svg'}
                    alt="logo"
                    width={16}
                    height={16}
                    />
                    <p className="text-gray-600 text-sm"> {course.duration} ч.</p>
                    
                     </div>
                    
                 
                  )}
                  </div>
                   
                 
                </div>
               
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseSearch;
