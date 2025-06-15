'use client';

import { ModuleForm } from '@/components/ModuleForm';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function InnerCreateModule() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId') || '';

  return <ModuleForm courseId={courseId} />;
}

export default function CreateModulePage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Создать модуль</h1>
      <Suspense fallback={<div>Загрузка...</div>}>
        <InnerCreateModule />
      </Suspense>
    </div>
  );
}
