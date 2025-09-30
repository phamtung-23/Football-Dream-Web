import { Metadata } from 'next';
import ForgotPasswordView from '@/features/auth/components/forgot-password-view'; 

export const metadata: Metadata = {
  title: 'Forgot Password | Dream Football',
  description: 'Reset your password for Dream Football account.'
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
