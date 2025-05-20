import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Токен и пароль обязательны' }, { status: 400 });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return NextResponse.json({ error: 'Токен недействителен или истёк' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({
      where: { token },
    });

    return NextResponse.json({ message: 'Пароль успешно обновлён' });
  } catch (error) {
    console.error('Ошибка сброса пароля:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
