import React from "react";

type Course = {
  id: string;
  title: string;
  teacher: {
    name: string;
  };
};

type Props = {
  results: Course[];
};

const SearchResults: React.FC<Props> = ({ results }) => {
  if (results.length === 0) {
    return <p className="text-gray-500">Ничего не найдено</p>;
  }

  return (
    <ul className="space-y-4">
      {results.map((course) => (
        <li key={course.id} className="border p-4 rounded shadow">
          <h3 className="text-lg font-semibold">{course.title}</h3>
          <p className="text-sm text-gray-600">Преподаватель: {course.teacher.name}</p>
        </li>
      ))}
    </ul>
  );
};

export default SearchResults;
