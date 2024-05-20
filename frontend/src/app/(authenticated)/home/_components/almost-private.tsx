import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeftIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { RadioGroup } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { postStore } from './create-post';
import { privacyStore } from './privacy-view';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetchers';
import { useSession } from '@/providers/user-provider';
import { Checkbox } from '@/components/ui/checkbox';

export const AlmostPrivateView = ({}) => {
  // todo improve this view when users and relationships are implemented
  const back = postStore((state: any) => state.deincrement);
  const visibleTo = privacyStore((state: any) => state.visibleTo);
  const { user } = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => fetcher(`/api/users/${user?.nickname}/followers`),
  });

  const handleSave = () => {
    postStore.setState({ visibleTo: visibleTo });
    back();
  };

  const handleCancel = () => {
    privacyStore.setState({ visibleTo: [] });
    back();
  };

  return (
    <DialogContent>
      <DialogTitle className='flex items-center space-x-5'>
        <Button size='icon' variant='outline'>
          <ArrowLeftIcon onClick={back} />
        </Button>
        <p>Specific Friends</p>
      </DialogTitle>
      <div className='flex flex-col space-y-3'>
        <Input type='text' placeholder='Search for friends' />
        <h2 className='text-lg'>Friends</h2>
        <RadioGroup>
          {isLoading || !data ? (
            <p>Loading...</p>
          ) : (
            data.followers.map((friend: any) => (
              <Friend
                key={friend.follower_id}
                id={friend.follower_id}
                firstname={friend.user.first_name}
                lastname={friend.user.last_name}
                avatar={friend.image}
              />
            ))
          )}
        </RadioGroup>
        <div className='ml-auto flex space-x-3'>
          <Button onClick={handleCancel} variant='outline'>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!visibleTo.length}>
            Save changes
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

const Friend = ({ id, firstname, lastname, avatar }: { id: string; firstname: string; lastname: string; avatar: string }) => {
  const toggleUser = privacyStore((state: any) => state.toggleVisibleToUser);
  const visibleTo = privacyStore((state: any) => state.visibleTo);

  return (
    <div className='flex items-center'>
      <div className='h-[40px] w-[40px] rounded-full bg-blue-900' />
      <Label htmlFor='' className='ml-3'>
        {firstname} {lastname}
      </Label>
      <Checkbox checked={visibleTo.includes(id)} onCheckedChange={() => toggleUser(id)} className='ml-auto' />
    </div>
  );
};
