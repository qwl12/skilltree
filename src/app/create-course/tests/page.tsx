// src/app/create-course/tests/page.tsx

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TestForm from '@/components/TestForm';

const CreateTestPage = () => {
  const router = useRouter();
  const [moduleId, setModuleId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('moduleId');
    if (!id) {
      router.push('/create-course/modules');
    } else {
      setModuleId(id);
    }
  }, [router]);

  if (!moduleId) return null;

  const handleNext = (moduleId: string) => {
    console.log('Создание теста завершено, редирект на создание вопросов');
    localStorage.setItem('moduleId', moduleId);
    router.push('/create-course/questions');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">

      <TestForm moduleId={moduleId} onNext={handleNext} />
    </div>
  );
};

export default CreateTestPage;
