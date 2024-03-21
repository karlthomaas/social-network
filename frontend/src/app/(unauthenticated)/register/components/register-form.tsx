"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { fetcherWithOptions } from '@/lib/fetchers';

const formSchema = z.object({
    email: z.string().email(),
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

export const RegisterForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  
  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      // deinclude confirmPassword from values
      const { confirmPassword, ...newValues } = values;
      
      return fetcherWithOptions({
        url: '/api/users',
        method: 'POST',
        body: newValues,
      });
    }
  })
 
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    mutation.mutate(values);
  };
  
  return (
    <Form {...form}>
      <FormDescription className='mb-3 text-lg text-center'>
          Sign up to Social/Network!
      </FormDescription>
      <form onSubmit={form.handleSubmit(onSubmit)} className='form-control space-y-3'>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                  E-mail
              </FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                  First Name
              </FormLabel>
              <FormControl>
                <Input placeholder="First Name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                  Last Name
              </FormLabel>
              <FormControl>
                <Input placeholder="Last Name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_of_birth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                  Date of Birth
              </FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                  Password
              </FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                  Confirm Password
              </FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">
            Sign Up
        </Button>
      </form>
    </Form>
  )
};
