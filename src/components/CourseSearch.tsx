"use client";
import { makeErroringExoticSearchParamsForUseCache } from "next/dist/server/request/search-params";
import { useState, useEffect } from "react";

interface Course {
  id: string;
  title: string;
  description: string;
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
    <div className="p-4 max-w-xl mx-auto">
      <input
        type="text"
        placeholder="Поиск по названию или преподавателю"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded-lg mb-4"
      />

      {loading && <p className="text-gray-600">Загрузка...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <ul className="space-y-3">
        {results.map((course) => (
          <li key={course.id} className="border p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <p className="text-sm text-gray-700">{course.description}</p>
            {course.teacher?.name && (
              <p className="text-sm text-gray-500">Преподаватель: {course.teacher.name}</p>
            )}
          
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseSearch;
