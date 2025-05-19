import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import { mkdir } from 'fs/promises';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Неавторизовано' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    const formData = await req.formData();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const difficulty = formData.get('difficulty') as string;
    const imageFile = formData.get('image') as File | null;

    let imagePath: string | null = null;

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');

      await mkdir(uploadDir, { recursive: true });

      const fileName = `${uuidv4()}-${imageFile.name}`;
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      imagePath = `/uploads/${fileName}`;
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        difficulty,
        image: imagePath ?? '', // пустая строка, если нет изображения
        teacher: {
          connect: { id: user.id },
        },
      },
    });
    const tagsRaw = formData.get('tags');
    const parsedTags = typeof tagsRaw === 'string' ? JSON.parse(tagsRaw) : [];

    for (const tagName of parsedTags) {
      const tag = await prisma.tag.findUnique({ where: { name: tagName } });

      if (tag) {
        await prisma.courseTag.create({
          data: {
            courseId: course.id,
            tagId: tag.id,
          },
        });
      }
    }
    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    console.error('Ошибка при создании курса:', error);
    return NextResponse.json({ error: error.message || 'Ошибка сервера' }, { status: 500 });
  }
}
