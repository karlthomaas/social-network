import React, { useState} from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { fetcherWithOptions } from '@/lib/fetchers';
import { toast } from '@/components/ui/use-toast';

const formSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
});

export const GroupModal = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return fetcherWithOptions({
        url: '/api/groups',
        method: 'POST',
        body: values,
      });
    },

    onSuccess: () => {
      setOpen(false);
      toast({
        title: 'Group created',
        description: 'Your group has been created successfully',
      });
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent>
        <DialogHeader>Create group</DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='form-control space-y-3'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Name' />
                  </FormControl>
                  <FormMessage {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder='Description' />
                  </FormControl>
                  <FormMessage {...field} />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={mutation.isPending} className='w-full'>
              { mutation.isPending ? 'Creating group...' : 'Create Group'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
