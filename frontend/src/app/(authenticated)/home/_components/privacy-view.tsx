import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Globe2, Lock, Users2 } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export const PrivacyView = ({ privacy, next, back, setPrivacy, cancel }: { privacy:string, next: () => void; back: () => void, setPrivacy: () => void, cancel: () => void }) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className='flex items-center space-x-5'>
          <Button size='icon' variant='outline' >
            <ArrowLeftIcon onClick={back} />
          </Button>
          <p>Select Post Privacy</p>
        </DialogTitle>
      </DialogHeader>
      <ul>
        <PrivacyItem Icon={Globe2} title='Public' description='Anyone can see your post'/>
        <PrivacyItem Icon={Users2} title='Private' description='Only friends can see your post'/>
        <PrivacyItem Icon={Lock} title='Almost private' description='Only selected friends can see your post'/>
      </ul>
      <div className='ml-auto flex space-x-4'>
        <Button variant="outline" onClick={cancel}>
            Cancel
        </Button>
        <Button>
            Done
        </Button>
      </div>
    </DialogContent>
  );
};

const PrivacyItem = ({ Icon, title, description}: {Icon: LucideIcon, title:string, description: string}) => {
    return (
        <li className='w-full h-[80px] broder border-border hover:bg-slate-700 rounded-xl bg-background flex items-center justify-between transition-colors ease-in duration-150 hover:cursor-pointer'>
            <Icon size={35} className='basis-1/6'/>
            <div id="content" className='basis-4/6'>
                <h1>{title}</h1>
                <p className='text-sm text-neutral-300'>{description}</p>
            </div>
            <div id="checkbox" className='basis-1/6'>
                O
            </div>
        </li>
    )
};