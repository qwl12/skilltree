import { getCurrentUser } from '@/lib/session';
import AdminDashboard from '@/components/AdminDashboard';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    redirect('/dashboard'); 
  }

  return <AdminDashboard />;
}
