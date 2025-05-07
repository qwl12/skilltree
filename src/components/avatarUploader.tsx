// src/components/AvatarUploader.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';

export default function AvatarUploader() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      await axios.post('/api/profile/upload-avatar', formData);
      alert('Аватар успешно загружен');
    } catch (error) {
      console.error(error);
      alert('Ошибка при загрузке аватара');
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload}>Загрузить</button>
    </div>
  );
}
