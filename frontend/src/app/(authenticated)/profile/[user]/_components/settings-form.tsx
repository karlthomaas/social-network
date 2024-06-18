import { z } from 'zod';
import { Button } from '@/components/ui/button';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAppSelector } from '@/lib/hooks';
import { useUpdateUserMutation } from '@/services/backend/actions/user';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

import { useUploadImageMutation } from '@/services/backend/actions/posts';

export type profileFormType = z.infer<typeof formSchema>;

const formSchema = z.object({
  profile_picture: z.unknown().transform((value) => {
    return value as FileList;
  }),
  first_name: z.string().min(3, { message: 'First Name must be at least 3 characters' }),
  last_name: z.string().min(3, { message: 'Last Name must be at least 3 characters' }),
  nickname: z.string().min(3, { message: 'Nickname must be at least 3 characters' }),
  about_me: z.string().max(100, { message: 'About me must be less than 100 characters' }),
  privacy: z.string().optional(),
});

export const SettingsForm = ({ setIsOpen }: { setIsOpen: (state: boolean) => void }) => {
  const router = useRouter();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const { user } = useAppSelector((state) => state.auth);

  const form = useForm<profileFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: user?.nickname,
      about_me: user?.about_me,
      first_name: user?.first_name,
      last_name: user?.last_name,
    },
  });

  const fileRef = form.register('profile_picture');

  const closeDialog = () => {
    form.reset();
    setIsOpen(false);
  };

  const onSubmit = async (values: profileFormType) => {
    const { profile_picture, ...data } = values;

    const dirtyFields = Object.keys(form.formState.dirtyFields);

    // if nothing has changed
    if (dirtyFields.length === 0) {
      closeDialog();
      return;
    }

    const operations = [];

    // if anything except profile_picture has changed
    // if (dirtyFields.length > 0 && !dirtyFields.includes('profile_picture')) {
    if (dirtyFields.includes('profile_picture') ? dirtyFields.length > 1 : dirtyFields.length > 0) {
      operations.push(updateUserDetails(data));
    }

    if (dirtyFields.includes('profile_picture') && profile_picture) {
      operations.push(updateProfilePicture(profile_picture[0]));
    }

    const results = await Promise.allSettled(operations);

    const hasError = results.some((result) => {
      if ('value' in result) {
        return !result.value;
      }
    });

    if (!hasError) {
      closeDialog();
    }
  };

  const updateUserDetails = async (data: Omit<profileFormType, 'profile_picture'>): Promise<boolean> => {
    try {
      await updateUser(data).unwrap();

      if (user?.nickname !== data.nickname) {
        // redirect to new profile
        router.push(`/profile/${data.nickname.toLowerCase()}`);
      }
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated',
      });
      return true;
    } catch (error) {
      // check if error type is FetchBaseQueryError (RTK Query error)
      if (error && typeof error === 'object' && 'data' in error) {
        const beError = error as FetchBaseQueryError;

        // Only nickname can be unique in this form - 422
        if (beError.status === 422) {
          form.setError('nickname', { message: 'Nickname is already taken.' });
        } else {
          toast({
            title: 'Something went wrong',
            description: 'Please try again later',
            variant: 'destructive',
          });
        }
      }

      return false;
    }
  };

  const updateProfilePicture = async (image: File): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append('images', image);
      await uploadImage({
        option: 'users',
        id: user?.id || '',
        data: formData,
      }).unwrap();
      return true;
    } catch (err) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again later',
        variant: 'destructive',
      });
      return false;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col space-y-5'>
        <FormField
          control={form.control}
          name='first_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder='First Name' {...field} />
              </FormControl>
              <FormMessage {...field} />
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
              <FormMessage {...field} />
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
              <FormMessage {...field} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='about_me'
          render={({ field }) => (
            <FormItem>
              <FormLabel>About me</FormLabel>
              <FormControl>
                <Textarea placeholder='About me' {...field} />
              </FormControl>
              <FormMessage {...field} />
            </FormItem>
          )}
        />
        <div className='flex'>
          <FormField
            control={form.control}
            name='profile_picture'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <FormControl>
                  <Input type='file' placeholder='Profile Picture' {...fileRef} />
                </FormControl>
                <FormMessage {...field} />
              </FormItem>
            )}
          />
        </div>
        <div className='flex space-x-2'>
          <Button variant='outline' type='button' onClick={closeDialog} className='w-full basis-1/2'>
            Cancel
          </Button>
          <Button disabled={!form.formState.isValid || isLoading || isUploading} type='submit' className='w-full basis-1/2'>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};
