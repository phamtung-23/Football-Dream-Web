'use client';
import { Button } from '@/components/ui/button';
import { FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { FormInput } from '@/components/forms/form-input';
import { authApi, handleApiError } from '@/lib/api';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
});

type ForgotPasswordFormValue = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [loading, startTransition] = useTransition();

  const form = useForm<ForgotPasswordFormValue>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = async (data: ForgotPasswordFormValue) => {
    startTransition(async () => {
      try {
        const result = await authApi.forgotPassword(data.email);

        if (result.status === 'success') {
          toast.success(result.message || 'Password reset email sent successfully');
          router.push('/auth/sign-in');
        } else {
          toast.error(result.message || 'Failed to send password reset email');
        }
      } catch (error) {
        handleApiError(error, toast);
      }
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className='w-full space-y-4'
    >
      <FormProvider {...form}>
        <FormInput
          control={form.control}
          name='email'
          label='Email'
          placeholder='Enter your email...'
          disabled={loading}
        />
        
        <Button
          disabled={loading}
          className='mt-2 ml-auto w-full'
          type='submit'
        >
          {loading ? 'Sending...' : 'Send Reset Email'}
        </Button>
      </FormProvider>
    </form>
  );
}
