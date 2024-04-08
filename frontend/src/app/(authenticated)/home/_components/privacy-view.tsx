import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Globe2, Lock, Users2 } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { create } from 'zustand';
import { capitalize } from '@/lib/utils';
import { postStore } from './create-post';

export const privacyStore = create((set) => ({
  radioValue: 'public',
  setValue: (value: string) => set({ radioValue: value }),
}));

export const PrivacyView = ({}: {}) => {
  const radioValue = privacyStore((state: any) => state.radioValue);
  const setValue = privacyStore((state: any) => state.setValue);

  const next = postStore((state: any) => state.increment);
  const back = postStore((state: any) => state.deincrement);
  const privacy = postStore((state: any) => state.privacy);

  const handlePrivacyChange = (value: string) => {
    // set current component state
    setValue(value);
    if (value === 'almost private') {
      next();
    }
  };

  const handleSave = () => {
    // save privacy to parent component
    postStore.setState({ privacy: radioValue });
    back();
  };

  const handleCancel = () => {
    // reset current component state
    setValue(privacy);
    back();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className='flex items-center space-x-5'>
          <Button size='icon' variant='outline'>
            <ArrowLeftIcon onClick={handleCancel} />
          </Button>
          <p>Select Post Privacy</p>
        </DialogTitle>
      </DialogHeader>
      <RadioGroup value={radioValue}>
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
        <Button onClick={handleSave}>Done</Button>
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
      className='broder flex h-[80px] w-full items-center justify-between rounded-xl border-border bg-background transition-colors duration-150 ease-in hover:cursor-pointer hover:bg-slate-700'
    >
      <Icon size={35} className='basis-1/6' />
      <div id='content' className='basis-4/6'>
        <Label htmlFor={value}>{title}</Label>
        <p className='text-sm text-neutral-300'>{description}</p>
      </div>
      <RadioGroupItem value={value.toLowerCase()} id={value.toLowerCase()} className='mr-5' />
    </div>
  );
};
