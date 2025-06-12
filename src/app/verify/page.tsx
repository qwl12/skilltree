import { Suspense } from 'react';
import VerifyClient from './VerifyClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <VerifyClient />
    </Suspense>
  );
}
