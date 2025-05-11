'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ModuleForm from '@/components/ModuleForm';

const CreateModulePage = () => {
  const router = useRouter();
  const [courseId, setCourseId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('courseId');
    if (!id) router.push('/create-course');
    setCourseId(id);
  }, [router]);

  if (!courseId) return null;

  const handleNext = (moduleId: string) => {
    localStorage.setItem('moduleId', moduleId);
    router.push('/create-course/lectures');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <ModuleForm courseId={courseId} onNext={handleNext} />
    </div>
  );
};

export default CreateModulePage;
