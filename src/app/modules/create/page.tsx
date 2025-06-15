// src/app/modules/create/page.tsx
'use client';

import { ModuleForm } from '@/components/ModuleForm';
import { useSearchParams } from 'next/navigation';

export default function CreateModulePage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId') || '';

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Создать модуль</h1>
      <ModuleForm courseId={courseId} />
    </div>
  );
}