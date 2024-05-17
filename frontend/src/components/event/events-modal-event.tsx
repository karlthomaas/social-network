import { EventType } from './events-modal';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation } from '@tanstack/react-query';
import { fetcherWithOptions } from '@/lib/fetchers';
import { useEffect, useState } from 'react';

export const EventsModalEvent = ({ event }: { event: EventType }) => {
  const [attendanceCount, setAttendanceCount] = useState(event.attendance.going);
  const [attendance, setAttendance] = useState(String(event.group_event_member.attendance));

  const mutation = useMutation({
    mutationKey: ['event', event.id],
    mutationFn: (isGoing: boolean) => {
      return fetcherWithOptions({
        url: `/api/groups/${event.group_id}/group_events/${event.id}/group_event_members`,
        method: attendance === '2' ? 'POST' : 'PATCH',
        body: {
          attendance: isGoing ? 1 : 0,
        },
      });
    },
    onSuccess: (data, isGoing) => {
      if (isGoing) {
        setAttendanceCount(attendanceCount + 1);
      } else {
        setAttendanceCount(attendanceCount - 1);
      }
    },
  });

  const handleSelect = (value: string) => {
    setAttendance(value);
    if (value === '1') {
      mutation.mutate(true);
    } else {
      mutation.mutate(false);
    }
  };

  return (
    <div className='flex h-max min-h-[75px] justify-between rounded-xl border border-border p-2'>
      <div className='flex basis-[80%] flex-col'>
        <h1 className='text-lg font-medium'>{event.title}</h1>
        <p className='text-neutral-300'>{event.description}</p>
        <p className='text-neutral-300'>{attendanceCount} members are attending</p>
      </div>
      <div className='my-auto'>
        <Select value={attendance} onValueChange={handleSelect}>
          <SelectTrigger className='w-[150px] '>
            <SelectValue placeholder='Select activity'></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='1' className='flex items-center'>
                Going
              </SelectItem>
              <SelectItem value='0'>Can't go</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
