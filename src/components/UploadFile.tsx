'use client';

import { useState } from 'react';
import Image from 'next/image';

interface UploadFileProps {
  previewUrl?: string;
  label?: string;
  accept?: string;
}

export default function UploadFile({
  previewUrl,
  label = 'Загрузить файл',
  accept = 'image/*',
}: UploadFileProps) {
  const [preview, setPreview] = useState<string | null>(previewUrl || null);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload/avatar', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setPreview(data.avatarUrl);
    } else {
      alert('Ошибка загрузки');
    }

    setLoading(false);
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      {preview && (
        <Image
          src={preview}
          alt="Аватар"
          width={200}
          height={200}
          className="rounded-xl object-cover"
        />
      )}
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="text-sm text-gray-600 file:bg-blue-500 file:text-white file:rounded-md file:px-3 file:py-1 file:cursor-pointer"
      />
      {loading && <p className="text-gray-500 text-sm">Загрузка...</p>}
    </div>
  );
}
