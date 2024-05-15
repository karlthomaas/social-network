import { CircleCheck } from 'lucide-react';
import { EventType } from './events-modal';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

export const EventsModalEvent = ({ event }: { event: EventType }) => {
  return (
    <div className='flex h-max min-h-[75px] justify-between rounded-xl border border-border p-2'>
      <div className='basis-[80%]'>
        <h1 className='text-lg font-medium'>{event.title}</h1>
        <p className='text-neutral-300'>
          {event.description}
        </p>
      </div>
      <div className='my-auto'>
        <Select>
          <SelectTrigger className='w-[150px] '>
            <SelectValue placeholder='Select activity'></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='going' className='flex items-center'>
                Going
              </SelectItem>
              <SelectItem value='not-going'>Can't go</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
