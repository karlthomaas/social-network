'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { fetcherWithOptions } from '@/lib/fetchers';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useRegisterMutation } from '@/services/backend/backendApi';

const formSchema = z
  .object({
    email: z.string().email(),
    nickname: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    date_of_birth: z.string(),
    password: z.string().min(2),
    confirmPassword: z.string().min(2),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormProps = z.infer<typeof formSchema>;

export const RegisterForm = () => {
  const form = useForm<RegisterFormProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      nickname: '',
      first_name: '',
      last_name: '',
      date_of_birth: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [register, registerStatus] = useRegisterMutation();

  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = (values: RegisterFormProps) => {
    register(values)
      .unwrap()
      .then(() => router.push('/home'))
      .catch(() =>
        toast({
          title: 'Something went wrong!',
          description: 'Please try again.',
          variant: 'destructive',
        })
      );
  };

  return (
    <Form {...form}>
      <FormDescription className='mb-3 text-center text-lg'>Sign up to Social/Network!</FormDescription>
      <form onSubmit={form.handleSubmit(onSubmit)} className='form-control space-y-3'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder='email' {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='nickname'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nickname</FormLabel>
              <FormControl>
                <Input placeholder='Nickname' {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='first_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder='First Name' {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='last_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder='Last Name' {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='date_of_birth'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input type='date' {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type='password' {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormDescription className='text-sm'>
          Already have an account?{' '}
          <Link href='/login' className='text-primary'>
            Log in
          </Link>
        </FormDescription>
        <Button type='submit' disabled={registerStatus.isLoading || registerStatus.isSuccess}>
          {registerStatus.isLoading ? 'Loading...' : 'Sign up'}
        </Button>
      </form>
    </Form>
  );
};
