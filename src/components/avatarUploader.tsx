'use client';
import { useState } from 'react';

export default function AvatarUploader({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    const res = await fetch('/api/upload/users', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    console.log('Uploaded file path:', data.path);
  };

  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload}>Загрузить</button>
    </div>
  );
}
