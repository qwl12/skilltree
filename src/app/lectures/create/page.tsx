'use client';

import { LectureForm } from '@/components/LectureForm';
import { useSearchParams, useRouter } from 'next/navigation';

export default function CreateLecturePage() {
  const searchParams = useSearchParams();
  const moduleId = searchParams.get('moduleId') || '';

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Создать лекцию</h1>
      <LectureForm moduleId={moduleId} />
    </div>
  );
}
