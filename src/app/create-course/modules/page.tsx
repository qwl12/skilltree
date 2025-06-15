'use client';
import { ModuleForm } from '@/components/ModuleForm';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';


const CreateModulePage = () => {
  const router = useRouter();
  const [courseId, setCourseId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('courseId');
    if (!id) router.push('/create-course');
    setCourseId(id);
  }, [router]);

  if (!courseId) return null;



  return (
    <div className="max-w-3xl mx-auto p-6">
      <Suspense fallback={<div>Loading...</div>}>
      <ModuleForm courseId={courseId}  />
      </Suspense>
    </div>
  );
};

export default CreateModulePage;
