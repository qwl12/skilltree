'use client';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { LectureForm } from '@/components/LectureForm';

const CreateLecturePage = () => {
  const router = useRouter();
  const [moduleId, setModuleId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('moduleId');
    if (!id) router.push('/create-course/modules');
    setModuleId(id);
  }, [router]);

  if (!moduleId) return null;

 

  return (
   <Suspense fallback={<div>Loading...</div>}>
      <div className="max-w-3xl mx-auto p-6">
        <LectureForm moduleId={moduleId}  />
      </div>
    </Suspense>
  );
};

export default CreateLecturePage;
