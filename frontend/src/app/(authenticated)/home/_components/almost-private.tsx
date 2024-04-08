import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { postStore } from './create-post';

export const AlmostPrivateView = ({}) => {
  // todo improve this view when users and relationships are implemented
  const back = postStore((state: any) => state.deincrement);

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
          <Friend firstname='John' lastname='Doe' avatar='' />
          <Friend firstname='Jane' lastname='Doe' avatar='' />
          <Friend firstname='Alice' lastname='Smith' avatar='' />
        </RadioGroup>
        <div className='ml-auto flex space-x-3'>
          <Button onClick={back} variant='outline'>
            Cancel
          </Button>
          <Button disabled={true}>Save changes</Button>
        </div>
      </div>
    </DialogContent>
  );
};

const Friend = ({ firstname, lastname, avatar }: { firstname: string; lastname: string; avatar: string }) => {
  return (
    <div className='flex items-center'>
      <div className='h-[40px] w-[40px] rounded-full bg-blue-900' />
      <Label htmlFor='' className='ml-3'>
        {firstname} {lastname}
      </Label>
      <RadioGroupItem value='' className='ml-auto' />
    </div>
  );
};
