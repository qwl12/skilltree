'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CourseForm from '@/components/CourseForm';

const CreateCoursePage = () => {
  const router = useRouter();
  const [courseId, setCourseId] = useState<string | null>(null);

  const handleNext = (id: string) => {
    setCourseId(id);
    router.push(`/courses/${id}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <CourseForm onNext={handleNext} />
    </div>
  );
};

export default CreateCoursePage;
