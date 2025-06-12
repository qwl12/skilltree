import ResetPasswordForm from './ResetPasswordForm';
import { Metadata } from 'next';

type Props = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Сброс пароля',
};

export default function ResetPasswordPage({ searchParams }: Props) {
  const token = searchParams.finally.name;
  return <ResetPasswordForm token={token} />;
}
