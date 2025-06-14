import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('avatar') as File;

  if (!file || !file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Неверный файл' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name}`;
  const uploadPath = path.join(process.cwd(), 'load', 'avatars');
  const filePath = path.join(uploadPath, filename);

  await fs.mkdir(uploadPath, { recursive: true });
  await fs.writeFile(filePath, buffer);

  const avatarUrl = `/api/upload/avatar/${filename}`;
  return NextResponse.json({ avatarUrl });
}
