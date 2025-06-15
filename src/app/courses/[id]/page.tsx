import { notFound } from 'next/navigation';
import CourseDetailClient from './client';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';



export default async function Page(
  context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    notFound();
  }

  const course = await res.json();

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id || null;

  return <CourseDetailClient course={course} currentUserId={currentUserId} />;
}
