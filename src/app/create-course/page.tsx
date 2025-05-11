'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CourseForm from '@/components/CourseForm';
import Link from 'next/link';

const CreateCoursePage = () => {
  const router = useRouter();
  const [courseId, setCourseId] = useState<string | null>(null);

  const handleNext = (id: string) => {
    setCourseId(id);
    localStorage.setItem('courseId', id);
    router.push('/create-course/modules');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <CourseForm onNext={handleNext} />
          <Link href={'/create-course/Modules'}>модули</Link>
          <Link href={'/create-course/lectures'}>лекции</Link>
          <Link href={'/create-course/tests'}>тесты</Link>
          <Link href={'/create-course/questions'}>вопросы</Link>
    </div>

  );
};

export default CreateCoursePage;
