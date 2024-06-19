import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useRef, useEffect } from 'react';
import { useAttendGroupEventMutation, useChangeGroupEventAttendanceMutation } from '@/services/backend/actions/groups';
import type { EventType } from '@/services/backend/types';
import { toast } from '../ui/use-toast';

export const EventsModalEvent = ({ event, isActive }: { event: EventType; isActive: boolean }) => {
  const [changeAttendance] = useChangeGroupEventAttendanceMutation();
  const [attendEvent] = useAttendGroupEventMutation();

  const selectRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isActive && selectRef.current) {
      selectRef.current.focus();
    }
  }, [isActive]);
  const [attendanceCount, setAttendanceCount] = useState(event.attendance.going);
  const attendance = useRef(String(event.group_event_member.attendance));

  const handleSelect = async (value: string) => {
    const isFirstPick = event.group_event_member.attendance === 2;

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

      // if user is going to the event -> increment attendance count
      if (Number(value) === 1) {
        setAttendanceCount(attendanceCount + 1);
      }

      // if user is not going and was going before -> decrement attendance count
      if (Number(value) === 0 && attendance.current === '1') {
        setAttendanceCount(attendanceCount - 1);
      }

      attendance.current = value;
    } catch (error) {
      toast({
        title: 'Failed to change attendance',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='flex h-max min-h-[75px] justify-between rounded-xl border  p-2'>
      <div className='flex basis-[80%] flex-col'>
        <h1 className='text-lg font-medium'>{event.title}</h1>
        <p className='text-neutral-300'>{event.description}</p>
        <p className='text-neutral-300'>{attendanceCount} members are attending</p>
      </div>
      <div className='my-auto'>
        <Select value={attendance.current} onValueChange={handleSelect}>
          <SelectTrigger ref={selectRef} className='w-[150px] '>
            <SelectValue placeholder='Select activity'></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='2'>Choose option</SelectItem>
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
