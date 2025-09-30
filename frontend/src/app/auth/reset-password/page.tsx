import { ResetPasswordView } from '@/features/auth/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password | Dream Football',
  description: 'Reset your password for Dream Football account.'
};

export default function ResetPasswordPage() {
  return <ResetPasswordView />;
}
