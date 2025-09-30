import { Metadata } from 'next';
import OtpLoginView from '@/features/auth/components/otp-login-view';

export const metadata: Metadata = {
  title: 'OTP Login | Dream Football',
  description: 'Login with OTP for Dream Football account.'
};

export default function OtpLoginPage() {
  return <OtpLoginView />;
}
