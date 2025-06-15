import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { writeFile } from 'fs/promises';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const userId = formData.get('userId') as string;

  if (!file || !userId) {
    return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name);
  const fileName = `avatar${ext}`;
  const dirPath = path.join(process.cwd(), 'uploads', 'users', userId);

  await fs.mkdir(dirPath, { recursive: true });

  const filePath = path.join(dirPath, fileName);
  await writeFile(filePath, buffer);

  const fileUrl = `/api/upload/users/${userId}/${fileName}`;
  
  return NextResponse.json({ url: fileUrl });
}
