import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tags = await prisma.tag.findMany();
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Ошибка при загрузке тегов:', error);
    return NextResponse.json([], { status: 500 });
  }
}
