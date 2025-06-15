'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CourseImageUploadProps {
  courseId: string;
  currentImageUrl?: string;
}

export default function CourseImageUpload({ courseId, currentImageUrl }: CourseImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(currentImageUrl || '');
  const router = useRouter();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert('Файл не выбран');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('courseId', courseId);

    const res = await fetch('/api/upload/courses', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (res.ok && data.url) {
      setImageUrl(`${data.url}?t=${Date.now()}`);
      alert('Изображение успешно обновлено');
      // При необходимости обновляем страницу или делаем router.refresh()
      router.refresh();
    } else {
      alert(data.error || 'Ошибка при загрузке изображения');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Course image"
          className="w-64 h-40 object-cover rounded shadow-md"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="text-sm text-gray-600 file:bg-blue-500 file:text-white file:rounded-md file:px-3 file:py-1 file:cursor-pointer"
      />
    </div>
  );
}
