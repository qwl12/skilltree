import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";




export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const module = await prisma.module.findUnique({
      where: { id: params.id },
       include: {
        lectures: true,
        tests: true, // ← добавь это!
        course: { select: { teacherId: true } },
      },
  
    });

    if (!module) {
      return new NextResponse(JSON.stringify({ error: 'Модуль не найден' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify(module), { status: 200 });
  } catch (error) {
    console.error('Error fetching module:', error);
    return new NextResponse(JSON.stringify({ error: 'Ошибка при загрузке модуля' }), { status: 500 });
  }
}


export async function PUT(req: Request) {
  const url = new URL(req.url);
  const moduleId = url.pathname.split('/').pop();

  if (!moduleId) {
    return NextResponse.json({ error: 'Не указан ID модуля' }, { status: 400 });
  }

  try {
    const body = await req.json();

    const updated = await prisma.module.update({
      where: { id: moduleId },
      data: {
        title: body.title,
        description: body.description,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Ошибка при обновлении модуля:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
