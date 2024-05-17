import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcherWithOptions } from '@/lib/fetchers';
import { LoadingSpinner } from '../ui/spinners';
import { toast } from '../ui/use-toast';

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1),
});

export const EventForm = ({ groupId }: { groupId: string }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return fetcherWithOptions({
        url: `/api/groups/${groupId}/group_events`,
        method: 'POST',
        body: values,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', groupId] });
      toast({
        title: 'Success',
        description: 'Event created',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive',
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='date'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type='datetime-local' {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type='submit' disabled={mutation.isPending || mutation.isSuccess}>
          {mutation.isPending ? <LoadingSpinner /> : mutation.isSuccess ? 'Created' : 'Create'}{' '}
        </Button>
      </form>
    </Form>
  );
};
