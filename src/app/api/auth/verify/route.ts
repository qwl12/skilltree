

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 
import { isAfter } from 'date-fns';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    // проверка токенов
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Неверный токен' }, { status: 400 });
    }

    const record = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!record) {
        return NextResponse.json({ error: 'Токен не найден или уже использован' }, { status: 404 });
    }

    if (isAfter(new Date(), record.expires)) {
        return NextResponse.json({ error: 'Срок действия токена истёк' }, { status: 410 });
    }

    console.log('Обновление пользователя:', record.identifier);
    await prisma.user.update({
      where: { email: record.identifier },
      data: { emailVerified: new Date() },
    });
    console.log('Пользователь обновлён');

    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json({ message: 'Электронная почта успешно подтверждена' });
  } catch (error) {
    console.error('[VERIFY]', error);
    return NextResponse.json({ error: 'Ошибка при подтверждении электронной почты' }, { status: 500 });
  }
}
