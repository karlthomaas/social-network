'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  file: z.instanceof(FileList).optional(),
});

export const FileUpload = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const fileRef = form.register('file');

  const onSubmit = (data: z.infer<typeof formSchema>) => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full p-10'>
        <FormField
          control={form.control}
          name='file'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>File</FormLabel>
                <FormControl>
                  <Input type='file' placeholder='shadcn' {...fileRef} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
};
