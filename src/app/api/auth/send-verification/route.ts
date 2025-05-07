// src/app/api/auth/send-verification/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { addMinutes } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/mail'; 

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email обязателен' }, { status: 400 });
    }

    const token = uuidv4();
    const expires = addMinutes(new Date(), 15); 

    // сохраняем токен в БД
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    await sendVerificationEmail(email, token);

    return NextResponse.json({ message: 'Письмо отправлено' }, { status: 200 });
  } catch (error) {
    console.error('[SEND_VERIFICATION]', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
