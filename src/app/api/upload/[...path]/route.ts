import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {

    const { path: pathArray } = await context.params;

    if (!pathArray || pathArray.length === 0) {
      return NextResponse.json({ error: 'Path not provided' }, { status: 400 });
    }

    const fullPath = path.join(process.cwd(), 'uploads', ...pathArray);

    try {
      await fs.access(fullPath);
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileBuffer = await fs.readFile(fullPath);
    const ext = path.extname(fullPath).toLowerCase();

    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
      },
    });

  } catch (err) {
    console.error('Error serving file:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
