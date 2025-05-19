import { notFound } from 'next/navigation';
import CourseDetailClient from './client';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${params.id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    notFound();
  }
 const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id || null;

  const course = await res.json();
  return <CourseDetailClient course={course} 
  currentUserId={currentUserId}
  />;
}
