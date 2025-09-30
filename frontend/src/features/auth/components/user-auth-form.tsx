'use client';
import { Button } from '@/components/ui/button';
import { FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import GithubSignInButton from './github-auth-button';
import { FormInput } from '@/components/forms/form-input';
import Link from 'next/link';

const signInSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' })
});

const signUpSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string()
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
      username: '',
      password: ''
    }
  });

  const signUpForm = useForm<SignUpFormValue>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmitSignIn = async (data: SignInFormValue) => {
    startTransition(async () => {
      try {
        const result = await signIn('credentials', {
          username: data.username,
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

  const onSubmitSignUp = async (_data: SignUpFormValue) => {
    startTransition(async () => {
      try {
        // Handle sign up logic here
        // For now, we'll just show a success message
        toast.success('Account created successfully! Please sign in.');
        router.push('/auth/sign-in');
      } catch (error) {
        toast.error('Something went wrong. Please try again.');
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
            name='username'
            label='Username'
            placeholder='Enter your username...'
            disabled={loading}
          />
          
          <FormInput
            control={signUpForm.control}
            name='email'
            label='Email'
            placeholder='Enter your email...'
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
            name='username'
            label='Username'
            placeholder='Enter your username...'
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
          <GithubSignInButton />
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
