"use client";

import { useState } from "react";
import CourseCard from "@/components/PopularCourses/CourseCard";

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  subscribers: number;
  duration?: number;
  teacher: {
    name: string;
  };
}

export default function CourseListClient({ courses }: { courses: Course[] }) {
  const [search, setSearch] = useState("");

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Поиск по курсам"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded-md max-w-md min-w-2xs"
      />
      <div className="flex gap-y-7 gap-x-9 flex-wrap">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
