import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const filePath = path.join(process.cwd(), 'uploads', ...(await context.params).path);

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = getContentType(ext);

    return new NextResponse(file, {
      headers: { 'Content-Type': contentType },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Файл не найден' }, { status: 404 });
  }
}

function getContentType(ext: string) {
  switch (ext) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.pdf':
      return 'application/pdf';
    case '.docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case '.pptx':
      return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    default:
      return 'application/octet-stream';
  }
}
