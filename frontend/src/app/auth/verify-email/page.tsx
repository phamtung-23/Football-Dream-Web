import { Metadata } from 'next';
import { Suspense } from 'react';
import VerifyEmailAutoView from '@/features/auth/components/verify-email-auto-view';

export const metadata: Metadata = {
  title: 'Verify Email | Dream Football',
  description: 'Verify your email address for Dream Football account.'
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    }>
      <VerifyEmailAutoView />
    </Suspense>
  );
}
