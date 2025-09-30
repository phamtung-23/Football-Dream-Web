'use client';
import { Button } from '@/components/ui/button';
import { FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import * as z from 'zod';
import GoogleSignInButton from './google-auth-button';
import { FormInput } from '@/components/forms/form-input';
import { authApi, handleApiError } from '@/lib/api';
import Link from 'next/link';

const signInSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' })
});

const signUpSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/, {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInFormValue = z.infer<typeof signInSchema>;
type SignUpFormValue = z.infer<typeof signUpSchema>;

interface UserAuthFormProps {
  mode?: 'signin' | 'signup';
}

export default function UserAuthForm({ mode = 'signin' }: UserAuthFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [loading, startTransition] = useTransition();

  const isSignUp = mode === 'signup';
  
  const signInForm = useForm<SignInFormValue>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const signUpForm = useForm<SignUpFormValue>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: ''
    }
  });

  const onSubmitSignIn = async (data: SignInFormValue) => {
    startTransition(async () => {
      try {
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          toast.error('Invalid credentials');
        } else {
          toast.success('Signed in successfully!');
          router.push(callbackUrl);
        }
      } catch (error) {
        toast.error('Something went wrong. Please try again.');
      }
    });
  };

  const onSubmitSignUp = async (data: SignUpFormValue) => {
    startTransition(async () => {
      try {
        const result = await authApi.register({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        });

        if (result.status === 'success') {
          toast.success(result.message || 'Registration successful! Please check your email to verify your account.');
          router.push('/auth/sign-in');
        } else {
          toast.error(result.message || 'Registration failed');
        }
      } catch (error) {
        handleApiError(error, toast);
      }
    });
  };

  return (
    <>
      {isSignUp ? (
        <form
          onSubmit={signUpForm.handleSubmit(onSubmitSignUp)}
          className='w-full space-y-4'
        >
          <FormProvider {...signUpForm}>
          <FormInput
            control={signUpForm.control}
            name='email'
            label='Email'
            placeholder='Enter your email...'
            disabled={loading}
          />
          
          <FormInput
            control={signUpForm.control}
            name='firstName'
            label='First Name (Optional)'
            placeholder='Enter your first name...'
            disabled={loading}
          />
          
          <FormInput
            control={signUpForm.control}
            name='lastName'
            label='Last Name (Optional)'
            placeholder='Enter your last name...'
            disabled={loading}
          />
          
          <FormInput
            control={signUpForm.control}
            name='password'
            label='Password'
            type='password'
            placeholder='Enter your password...'
            disabled={loading}
          />
          
          <FormInput
            control={signUpForm.control}
            name='confirmPassword'
            label='Confirm Password'
            type='password'
            placeholder='Confirm your password...'
            disabled={loading}
          />
          
          <Button
            disabled={loading}
            className='mt-2 ml-auto w-full'
            type='submit'
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </Button>
          </FormProvider>
        </form>
      ) : (
        <form
          onSubmit={signInForm.handleSubmit(onSubmitSignIn)}
          className='w-full space-y-4'
        >
          <FormProvider {...signInForm}>
          <FormInput
            control={signInForm.control}
            name='email'
            label='Email'
            placeholder='Enter your email...'
            disabled={loading}
          />
          
          <FormInput
            control={signInForm.control}
            name='password'
            label='Password'
            type='password'
            placeholder='Enter your password...'
            disabled={loading}
          />
          
          <div className='flex justify-end text-sm'>
            <Link 
              href='/auth/forgot-password' 
              className='text-primary hover:underline'
            >
              Forgot password?
            </Link>
          </div>
          
          <Button
            disabled={loading}
            className='mt-2 ml-auto w-full'
            type='submit'
          >
            {loading ? 'Loading...' : 'Sign In'}
          </Button>
          </FormProvider>
        </form>
      )}
      
      {!isSignUp && (
        <>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-background text-muted-foreground px-2'>
                Or continue with
              </span>
            </div>
          </div>
          <div className='space-y-2'>
            <GoogleSignInButton />
          </div>
        </>
      )}
      
      <div className='text-center text-sm'>
        {isSignUp ? (
          <span>
            Already have an account?{' '}
            <Link href='/auth/sign-in' className='text-primary hover:underline'>
              Sign in
            </Link>
          </span>
        ) : (
          <span>
            Don&apos;t have an account?{' '}
            <Link href='/auth/sign-up' className='text-primary hover:underline'>
              Sign up
            </Link>
          </span>
        )}
      </div>
    </>
  );
}
