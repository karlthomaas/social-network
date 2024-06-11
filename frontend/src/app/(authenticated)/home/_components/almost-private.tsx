import { ArrowLeftIcon } from 'lucide-react';
import { useCallback } from 'react';

import { deincrement, setPrivacy, setPrivacyVisibleTo } from '@/features/post/postSlice';
import { useGetUserFollowersQuery } from '@/services/backend/actions/user';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { skipToken } from '@reduxjs/toolkit/query';

import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const AlmostPrivateView = ({}) => {
  const dispatch = useAppDispatch();
  const visibleTo = useAppSelector((state) => state.post.privacy.visibleTo);
  const { user } = useAppSelector((state) => state.auth);
  const { isLoading, data } = useGetUserFollowersQuery(user?.nickname ?? skipToken, { skip: !user });

  const handleSave = () => {
    dispatch(setPrivacy('almost private'))
    dispatch(setPrivacyVisibleTo(visibleTo));
    dispatch(deincrement());
  };

  const handleCancel = () => {
    dispatch(setPrivacyVisibleTo([]));
    dispatch(deincrement());
  };

  const handleSelect = useCallback(
    (id: string) => {
      if (visibleTo.includes(id)) {
        dispatch(setPrivacyVisibleTo(visibleTo.filter((item) => item !== id)));
      } else {
        dispatch(setPrivacyVisibleTo([...visibleTo, id]));
      }
    },
    [dispatch, visibleTo]
  );

  return (
    <DialogContent>
      <DialogTitle className='flex items-center space-x-5'>
        <Button size='icon' variant='outline'>
          <ArrowLeftIcon onClick={() => dispatch(deincrement())} />
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
                isToggled={visibleTo.includes(friend.follower_id)}
                callback={handleSelect}
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

const Friend = ({
  id,
  firstname,
  lastname,
  avatar,
  isToggled,
  callback,
}: {
  id: string;
  firstname: string;
  lastname: string;
  avatar: string;
  isToggled: boolean;
  callback: (id: string) => void;
}) => {

  return (
    <div className='flex items-center'>
      <div className='h-[40px] w-[40px] rounded-full bg-blue-900' />
      <Label htmlFor='' className='ml-3'>
        {firstname} {lastname}
      </Label>
      <Checkbox checked={isToggled} onCheckedChange={() => callback(id)} className='ml-auto' />
    </div>
  );
};
