import { NextRequest, NextResponse } from 'next/server';
import formidable, { Fields, Files } from 'formidable';
import fs from 'fs-extra';
import path from 'path';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const config = {
  api: { bodyParser: false },
};

const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
fs.ensureDirSync(uploadDir);

export async function POST(req: NextRequest): Promise<NextResponse> {
  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
    filename: (name, ext, part) => {
      const timestamp = Date.now();
      const safeName = part.originalFilename?.replace(/\s/g, '_') || 'upload';
      return `${timestamp}_${safeName}`;
    },
  });

  return new Promise((resolve) => {
    form.parse(req as any, async (err, fields: Fields, files: Files) => {
      if (err) {
        console.error('Form parsing error:', err);
        return resolve(NextResponse.json({ error: 'Upload error' }, { status: 500 }));
      }

      const file = files.avatar || files.file;
      if (!file || !Array.isArray(file) || !file[0]) {
        return resolve(NextResponse.json({ error: 'No file provided' }, { status: 400 }));
      }

      const filename = path.basename(file[0].filepath);
      const fileUrl = `/api/file/avatars/${filename}`;

      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return resolve(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
      }

      await prisma.user.update({
        where: { email: session.user.email },
        data: { image: fileUrl },
      });

      return resolve(NextResponse.json({ url: fileUrl }));
    });
  });
}
