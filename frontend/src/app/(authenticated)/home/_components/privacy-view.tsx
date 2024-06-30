import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Globe2, Lock, Users2 } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { capitalize } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setPrivacy, increment, deincrement } from '@/features/post/postSlice';
import { useState } from 'react';

export const PrivacyView = ({}: {}) => {
  const dispatch = useAppDispatch();
  const postSelector = useAppSelector((state) => state.post);
  const [tempPrivacy, setTempPrivacy] = useState(postSelector.privacy.value);

  const handlePrivacyChange = (value: string) => {
    setTempPrivacy(value);
    if (value === 'almost private') {
      dispatch(increment());
    }
  };

  const handleSave = () => {
    if (tempPrivacy === 'almost private' && postSelector.privacy.visibleTo.length === 0) {
      dispatch(increment());
      return;
    }

    dispatch(setPrivacy(tempPrivacy));
    dispatch(deincrement());
  };

  const handleCancel = () => {
    dispatch(deincrement());
  };

  return (
    <DialogContent className='bg-card'>
      <DialogHeader>
        <DialogTitle className='flex items-center space-x-5'>
          <Button size='icon' variant='outline'>
            <ArrowLeftIcon onClick={handleCancel} />
          </Button>
          <p>Select Post Privacy</p>
        </DialogTitle>
      </DialogHeader>
      <RadioGroup value={tempPrivacy}>
        <PrivacyItem callback={handlePrivacyChange} Icon={Globe2} value='public' description='Anyone can see your post' />
        <PrivacyItem callback={handlePrivacyChange} Icon={Users2} value='private' description='Only friends can see your post' />
        <PrivacyItem
          callback={handlePrivacyChange}
          Icon={Lock}
          value='almost private'
          description='Only selected friends can see your post'
        />
      </RadioGroup>
      <div className='ml-auto flex space-x-4'>
        <Button variant='outline' onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          {tempPrivacy === 'almost private' && postSelector.privacy.visibleTo.length === 0 ? 'Next' : 'Done'}
        </Button>
      </div>
    </DialogContent>
  );
};

const PrivacyItem = ({
  Icon,
  value,
  description,
  callback,
}: {
  Icon: LucideIcon;
  value: string;
  description: string;
  callback: (value: string) => void;
}) => {
  const title = capitalize(value);
  return (
    <div
      onClick={() => callback(value)}
      className='flex h-[80px] w-full items-center justify-between rounded-xl border transition-colors duration-150 ease-in hover:cursor-pointer hover:bg-neutral-50 hover:dark:bg-slate-700'
    >
      <Icon size={35} className='basis-1/6' />
      <div id='content' className='basis-4/6 hover:cursor-pointer'>
        <h1>{title}</h1>
        <p className='text-sm text-neutral-500 dark:text-neutral-300'>{description}</p>
      </div>
      <RadioGroupItem value={value.toLowerCase()} id={value.toLowerCase()} className='mr-5' />
    </div>
  );
};
