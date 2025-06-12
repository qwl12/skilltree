'use client';

import Header from '@/components/Header';
import Footer from '@/components/ui/footer';
import { Suspense } from 'react';

export default function NotFound() {
  return (
    <>
      <Suspense fallback={<div>Loading header...</div>}>
        <Header />
      </Suspense>

      <div>
        <h2>Not Found</h2>
      </div>

      <Footer />
    </>
  );
}
