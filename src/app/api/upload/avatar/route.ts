import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'Файл не передан' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  const uploadDir = path.join(process.cwd(), 'load', 'avatars');

  try {
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const url = `/api/upload/avatar/${fileName}`;
    return NextResponse.json({ avatarUrl: url });
  } catch (error) {
    console.error('Ошибка сохранения файла:', error);
    
    return NextResponse.json({ error: 'Не удалось сохранить файл' }, { status: 500 });
  }
}
