import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useCreateGroupMutation } from '@/services/backend/actions/groups';

const formSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
});

export type GroupFormProps = z.infer<typeof formSchema>;

export const GroupModal = ({ children }: { children: React.ReactNode }) => {
  const [createGroup, { isLoading }] = useCreateGroupMutation();
  const [open, setOpen] = useState(false);

  const form = useForm<GroupFormProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (values: GroupFormProps) => {
    try {
      await createGroup(values).unwrap();
      setOpen(false);
      toast({
        title: 'Group created',
        description: 'Your group has been created successfully',
      });
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
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
            <Button type='submit' disabled={isLoading} className='w-full'>
              {isLoading ? 'Creating group...' : 'Create Group'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
