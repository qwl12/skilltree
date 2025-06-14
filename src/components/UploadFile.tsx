'use client';

import { useState } from 'react';
import Image from 'next/image';

interface UploadFileProps {
  onUpload: (file: File) => Promise<void>;
  previewUrl?: string;
  label?: string;
  accept?: string;
}

export default function UploadFile({
  onUpload,
  previewUrl,
  label = 'Загрузить файл',
  accept = 'image/*',
}: UploadFileProps) {
  const [preview, setPreview] = useState<string | null>(previewUrl || null);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);
    await onUpload(file);
    setLoading(false);
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      {preview && (
        <Image
          src={preview}
          alt="Предпросмотр"
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
