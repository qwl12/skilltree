'use client';

import { LectureForm } from '@/components/LectureForm';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function InnerCreateLecture() {
  const searchParams = useSearchParams();
  const moduleId = searchParams.get('moduleId') || '';

  return <LectureForm moduleId={moduleId} />;
}

export default function CreateLecturePage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Создать лекцию</h1>
      <Suspense fallback={<div>Загрузка...</div>}>
        <InnerCreateLecture />
      </Suspense>
    </div>
  );
}
