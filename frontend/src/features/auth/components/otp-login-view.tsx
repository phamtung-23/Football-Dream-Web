import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import OtpLoginForm from './otp-login-form';
// import OtpLoginForm from './otp-login-form';

export const metadata: Metadata = {
  title: 'OTP Login',
  description: 'Login with OTP for Dream Football account.'
};

export default function OtpLoginViewPage() {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <Link
        href='/auth/sign-in'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-4 right-4 hidden md:top-8 md:right-8'
        )}
      >
        Back to Sign In
      </Link>
      <div className='relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r'>
        {/* Background image */}
        <div className='absolute inset-0'>
          <Image
            src='https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
            alt='Football stadium background'
            fill
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-black/40' />
        </div>
        
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <Image
            src='https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2093&q=80'
            alt='Dream Football Logo'
            width={32}
            height={32}
            className='mr-2 h-8 w-8 rounded-full'
          />
          Dream Football
        </div>
        
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &ldquo;Secure and quick access with OTP. Check your email for the verification code.&rdquo;
            </p>
            <footer className='text-sm'>Dream Football Team</footer>
          </blockquote>
        </div>
      </div>
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          {/* Welcome message */}
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-foreground mb-2'>OTP Login</h1>
            <p className='text-muted-foreground text-lg'>Enter your email and OTP code</p>
          </div>
          <OtpLoginForm />

          <div className='text-center text-sm'>
            <span>
              Prefer password?{' '}
              <Link href='/auth/sign-in' className='text-primary hover:underline'>
                Sign in with password
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
