import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;
  const filePath = path.join(process.cwd(), 'load', 'avatars', filename);

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
console.log('Сохраняю файл в:', filePath);
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.webp') contentType = 'image/webp';

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Файл не найден' }, { status: 404 });
  }
}
