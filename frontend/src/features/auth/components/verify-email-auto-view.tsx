'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi, handleApiError } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function VerifyEmailAutoView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. No token provided.');
        return;
      }

      // Demo scenarios for testing
      if (token === 'demo-loading') {
        setStatus('loading');
        setMessage('Demo: Loading state...');
        // Keep loading state for demo
        return;
      }

      if (token === 'valid-token') {
        // Simulate successful verification
        setTimeout(() => {
          setStatus('success');
          setMessage('Email verified successfully! You can now sign in to your account.');
          toast.success('Email verified successfully!');
          
          // Redirect to sign-in after 3 seconds
          setTimeout(() => {
            router.push('/auth/sign-in');
          }, 3000);
        }, 2000);
        return;
      }

      if (token === 'invalid-token') {
        // Simulate verification failure
        setTimeout(() => {
          setStatus('error');
          setMessage('Failed to verify email. The link may be expired or invalid.');
        }, 2000);
        return;
      }

      // Real verification logic
      try {
        const result = await authApi.verifyEmail(token);

        if (result.status === 'success') {
          setStatus('success');
          setMessage('Email verified successfully! You can now sign in to your account.');
          toast.success('Email verified successfully!');
          
          // Redirect to sign-in after 3 seconds
          setTimeout(() => {
            router.push('/auth/sign-in');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(result.message || 'Failed to verify email. The link may be expired or invalid.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred while verifying your email. Please try again.');
        handleApiError(error, toast);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      {/* Left Panel - Background */}
      <div className='relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r'>
        {/* Background image from Unsplash */}
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
              &ldquo;Welcome to your football management journey! Verify your email to get started.&rdquo;
            </p>
            <footer className='text-sm'>Dream Football Team</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Panel - Main Content */}
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          {/* Header */}
          <div className='flex items-center justify-between w-full mb-4'>
            <Link
              href='/auth/sign-in'
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'text-muted-foreground hover:text-primary'
              )}
            >
              Back to Sign In
            </Link>
          </div>

          {/* Welcome message */}
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-foreground mb-2'>
              {status === 'loading' && 'Verifying Email'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
            </h1>
            <p className='text-muted-foreground text-lg'>
              {status === 'loading' && 'Please wait while we verify your email address...'}
              {status === 'success' && 'Your email has been successfully verified.'}
              {status === 'error' && 'We encountered an issue verifying your email.'}
            </p>
          </div>

          {/* Status Icon */}
          <div className='flex justify-center'>
            <div className='w-20 h-20 rounded-full bg-muted flex items-center justify-center'>
              {status === 'loading' && <Loader2 className='h-10 w-10 text-muted-foreground animate-spin' />}
              {status === 'success' && <CheckCircle className='h-10 w-10 text-green-600' />}
              {status === 'error' && <XCircle className='h-10 w-10 text-red-600' />}
            </div>
          </div>

          {/* Status Content */}
          <div className='w-full space-y-4'>
            {status === 'loading' && (
              <div className='text-center space-y-4'>
                <p className='text-muted-foreground'>
                  This may take a few moments...
                </p>
              </div>
            )}
            
            {status === 'success' && (
              <div className='space-y-4'>
                <div className='text-center'>
                  <p className='text-green-600 font-medium mb-4'>
                    {message}
                  </p>
                  <p className='text-sm text-muted-foreground mb-6'>
                    You will be redirected automatically in a few seconds.
                  </p>
                </div>
                
                <Button asChild className='w-full'>
                  <Link href='/auth/sign-in'>
                    Back to Sign In
                  </Link>
                </Button>
              </div>
            )}
            
            {status === 'error' && (
              <div className='space-y-4'>
                <div className='text-center'>
                  <p className='text-red-600 font-medium mb-4'>
                    {message}
                  </p>
                  <p className='text-sm text-muted-foreground mb-6'>
                    Please try again or contact support if the problem persists.
                  </p>
                </div>
                
                <Button asChild className='w-full'>
                  <Link href='/auth/sign-in'>
                    Back to Sign In
                  </Link>
                </Button>
              </div>
            )}
            </div>

          {/* Footer */}
          <p className='text-muted-foreground px-8 text-center text-sm'>
            Having trouble? Contact our{' '}
            <Link
              href='/support'
              className='hover:text-primary underline underline-offset-4'
            >
              support team
            </Link>{' '}
            for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
