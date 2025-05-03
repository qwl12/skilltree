import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Query param 'q' is required" }, { status: 400 });
  }

  try {
    const courses = await prisma.course.findMany({
      where: {
        title: {
          contains: q,
          mode: "insensitive",
        },
   
        
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}