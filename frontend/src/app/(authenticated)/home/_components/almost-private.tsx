import { ArrowLeftIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

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
import { FollowerType } from '@/services/backend/types';
import { ProfilePicture } from '@/app/(authenticated)/profile/[user]/_components/pfp';

export const AlmostPrivateView = ({}) => {
  const dispatch = useAppDispatch();
  const visibleTo = useAppSelector((state) => state.post.privacy.visibleTo);
  const { user } = useAppSelector((state) => state.auth);
  const { isLoading, data } = useGetUserFollowersQuery(user?.nickname ?? skipToken, { skip: !user });

  const [followers, setFollowers] = useState<FollowerType[]>([]);

  useEffect(() => {
    if (data && data.data.followers) {
      setFollowers(data.data.followers);
    }
  }, [data, data?.data.followers]);

  const handleSave = () => {
    dispatch(setPrivacy('almost private'));
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

  const handleSearchFriends = (name: string) => {
    if (!data) {
      return;
    }

    if (!name) {
      setFollowers(data.data.followers);
    }
    setFollowers(
      data.data.followers.filter((follower) => follower.user.first_name.startsWith(name) || follower.user.last_name.startsWith(name))
    );
  };

  return (
    <DialogContent className='bg-card'>
      <DialogTitle className='flex items-center space-x-5'>
        <Button size='icon' variant='outline'>
          <ArrowLeftIcon onClick={() => dispatch(deincrement())} />
        </Button>
        <p>Specific Friends</p>
      </DialogTitle>
      <div className='flex flex-col space-y-3'>
        <Input type='text' onChange={(e) => handleSearchFriends(e.target.value)} placeholder='Search for friends' />
        <h2 className='text-lg'>Friends</h2>
        <RadioGroup>
          {isLoading || !data ? (
            <p>Loading...</p>
          ) : followers.length === 0 ? (
            <p className='text-neutral-400 dark:text-slate-400 '>No friends found</p>
          ) : (
            followers.map((friend) => (
              <Friend
                key={friend.follower_id}
                follower={friend}
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

const Friend = ({ follower, isToggled, callback }: { follower: FollowerType; isToggled: boolean; callback: (id: string) => void }) => {
  return (
    <div
      className='flex items-center rounded-lg border p-4 hover:cursor-pointer hover:bg-neutral-50 dark:hover:bg-slate-700'
      onClick={() => callback(follower.follower_id)}
    >
      <ProfilePicture url={follower.user.image} className='size-[40px]' />
      <Label className='ml-3'>
        {follower.user.first_name} {follower.user.first_name}
      </Label>
      <Checkbox checked={isToggled} className='ml-auto size-5' />
    </div>
  );
};
