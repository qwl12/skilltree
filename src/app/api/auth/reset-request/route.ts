// app/api/auth/reset-request/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import { sendPasswordResetEmail } from '@/lib/mail'  

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    const user = await prisma.user.findUnique({ where: { email } })
    
    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
    }

    const token = uuidv4()

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expires: new Date(Date.now() + 1000 * 60 * 60),
      },
    })

    await sendPasswordResetEmail(email, token)

    return NextResponse.json({ message: 'Письмо отправлено' }, { status: 200 })
  } catch (err) {
    console.error('Ошибка в reset-request:', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
