'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useMutation } from '@tanstack/react-query';
import { fetcherWithOptions } from '@/lib/fetchers';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2),
});

export const LoginForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return fetcherWithOptions({ url: '/api/login', method: 'POST', body:{}, headers: { "Authorization": "Basic " + btoa(`${values.email}:${values.password}`)}})
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <FormDescription className='mb-3 text-center text-lg'>Log in to Social/Network!</FormDescription>
      <form onSubmit={form.handleSubmit(onSubmit)} className='form-control space-y-3'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder='Email' />
              </FormControl>
              <FormMessage {...field} />
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
                <Input {...field} type='password' placeholder='Password' />
              </FormControl>
              <FormMessage {...field} />
            </FormItem>
          )}
        />
        <FormDescription className=' text-sm'>
          {' '}
          Don't have an account? <Link className="text-primary" href='/register'>Sign up</Link>
        </FormDescription>
        <Button type='submit'>Log in</Button>
      </form>
    </Form>
  );
};
