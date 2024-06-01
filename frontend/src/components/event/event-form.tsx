import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '../ui/spinners';
import { toast } from '../ui/use-toast';
import { useCreateGroupEventMutation } from '@/services/backend/actions/groups';

const formSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1),
});

export type EventFormProps = z.infer<typeof formSchema>;

export const EventForm = ({ groupId }: { groupId: string }) => {
  const [createEvent, { isLoading, isSuccess }] = useCreateGroupEventMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: groupId,
      title: '',
      description: '',
      date: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createEvent(values).unwrap();
      form.reset();
      toast({
        title: 'Success',
        description: 'Event created',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive',
      });
    }
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
        <Button type='submit' disabled={isLoading || isSuccess}>
          {isLoading ? <LoadingSpinner /> : isSuccess ? 'Created' : 'Create'}{' '}
        </Button>
      </form>
    </Form>
  );
};
