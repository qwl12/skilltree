import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import CourseListClient from "./CourseListClient";
import Image from "next/image";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TeacherProfilePage({ params }: Props) {
  const { id } = await params;

  const author = await prisma.user.findUnique({
    where: { id },
    include: {
      courses: {
        include: {
          enrollments: true,
        },
      },
    },
  });

  if (!author) return notFound();

  const followers = await prisma.follow.findMany({
    where: { followingId: author.id },
    distinct: ["followerId"],
  });

  const followersCountTotal = followers.length;

  const courses = author.courses
    .map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      image: course.image || "/default-course.jpg",
      subscribers: course.enrollments.length,
      duration: course.duration ?? undefined,
      teacher: {
        name: author.name,
      },
    }))
    .sort((a, b) => b.subscribers - a.subscribers);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-6 mb-8">
        <Image
          src={author.image || "/userProfile.png"}
          alt={author.name || "Автор"}
          width={96}
          height={96}
          className="rounded-full object-center"
        />
        <div>
          <h1 className="text-2xl font-bold">{author.name}</h1>
          <p className="text-gray-600">Подписчиков: {followersCountTotal}</p>
        </div>
      </div>

      <CourseListClient courses={courses} />
    </div>
  );
}
