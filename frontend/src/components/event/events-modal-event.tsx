import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation } from '@tanstack/react-query';
import { fetcherWithOptions } from '@/lib/fetchers';
import { useEffect, useState, useRef } from 'react';
import { useAttendGroupEventMutation, useChangeGroupEventAttendanceMutation } from '@/services/backend/backendApi';
import type { EventType } from '@/services/backend/types';
import { toast } from '../ui/use-toast';

export const EventsModalEvent = ({ event }: { event: EventType }) => {
  const [changeAttendance] = useChangeGroupEventAttendanceMutation();
  const [attendEvent] = useAttendGroupEventMutation();

  const [attendanceCount, setAttendanceCount] = useState(event.attendance.going);
  const attendance = useRef(String(event.group_event_member.attendance));

  const handleSelect = async (value: string) => {
    const isFirstPick = event.group_event_member.attendance === 2;
    attendance.current = value;

    const body = {
      eventId: event.id,
      groupId: event.group_id,
      attendance: Number(value),
    };

    try {
      if (isFirstPick) {
        await attendEvent(body);
      } else {
        await changeAttendance(body);
      }

      if (Number(value) === 1) {
        setAttendanceCount(attendanceCount + 1);
      }
      
    } catch (error) {
      toast({
        title: 'Failed to change attendance',
        description: 'Please try again later',
        variant: 'destructive',
      });
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
        <Select value={attendance.current} onValueChange={handleSelect}>
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
