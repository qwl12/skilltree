import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Неавторизован' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('avatar') as File;

  if (!file || !file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Неверный формат файла' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(process.cwd(), 'public/uploads/avatars', fileName);

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, buffer);
console.log('Сохраняю файл в:', filePath);
  const avatarUrl = `/uploads/avatars/${fileName}`;

  await prisma.user.update({
    where: { email: session.user.email },
    data: { image: avatarUrl },
  });

  return NextResponse.json({ avatarUrl });
}
