"use client";

import { useEffect, useState } from "react";
import PopularCourseCard from "./CourseCard";

interface Course {
  id: string;
  title: string;
  image: string;
  description: string;
  subscribers: string;
  duration?: number; 
  teacher: {
    name: string;
  };
}

export default function PopularCourses() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch("/api/popular-courses");
      const data = await res.json();
      console.log("дата:", data); 
      setCourses(data);
    };
    fetchCourses();
  }, []);
  

  return (
    <section className="py-8 px-17 flex flex-col items-center">
      <div>
        <h2 className="text-4xl text-black font-bold mb-8">Популярные курсы</h2>
        <div className="flex flex-wrap justify-center gap-7">
          {courses.map((course) => (
            
            <PopularCourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
