import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file: File | null = formData.get('file') as unknown as File;
  const lectureId = formData.get('lectureId') as string;

  if (!file || !lectureId) {
    return NextResponse.json({ error: 'No file or lectureId provided' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), 'uploads', 'lectures');
  await mkdir(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${uuidv4()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  await writeFile(filePath, buffer);
console.log('Сохраняю файл в:', filePath);
  const dbPath = `/api/file/lectures/${fileName}`;

  await prisma.lecture.update({
    where: { id: lectureId },
    data: { fileUrl: dbPath },
  });

  return NextResponse.json({ success: true, url: dbPath });
}
