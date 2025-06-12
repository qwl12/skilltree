// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Все поля обязательны" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json({ error: "Пользователь уже существует" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const studentRole = await prisma.role.findUnique({
    where: { type: "user" },
  });

  if (!studentRole) {
    return NextResponse.json({ error: "Роль user не найдена" }, { status: 500 });
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      roleId: studentRole.id,
    },
  });

  return NextResponse.json({ message: "Пользователь создан", user }, { status: 201 });
}
