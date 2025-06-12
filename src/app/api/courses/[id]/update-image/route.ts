import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const courseId = (await context.params).id;

  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'Файл отсутствует' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const imagePath = `/uploads/${fileName}`;

    await prisma.course.update({
      where: { id: courseId },
      data: { image: imagePath },
    });

    return NextResponse.json({ success: true, imagePath });
  } catch (error: any) {
    console.error('Ошибка при обновлении изображения:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
