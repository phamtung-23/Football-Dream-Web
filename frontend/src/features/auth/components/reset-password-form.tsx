'use client';
import { Button } from '@/components/ui/button';
import { FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { FormInput } from '@/components/forms/form-input';
import { authApi, handleApiError } from '@/lib/api';

const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/, {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValue = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [loading, startTransition] = useTransition();

  const form = useForm<ResetPasswordFormValue>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    }
  });

  const onSubmit = async (data: ResetPasswordFormValue) => {
    if (!token) {
      toast.error('Invalid reset token');
      return;
    }

    startTransition(async () => {
      try {
        const result = await authApi.resetPassword(token, data.newPassword);

        if (result.status === 'success') {
          toast.success(result.message || 'Password reset successfully');
          router.push('/auth/sign-in');
        } else {
          toast.error(result.message || 'Failed to reset password');
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
          name='newPassword'
          label='New Password'
          type='password'
          placeholder='Enter your new password...'
          disabled={loading}
        />
        
        <FormInput
          control={form.control}
          name='confirmPassword'
          label='Confirm New Password'
          type='password'
          placeholder='Confirm your new password...'
          disabled={loading}
        />
        
        <Button
          disabled={loading}
          className='mt-2 ml-auto w-full'
          type='submit'
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </FormProvider>
    </form>
  );
}
