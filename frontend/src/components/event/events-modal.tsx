import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { EventsModalEvent } from './events-modal-event';
import { LoadingSpinner } from '../ui/spinners';
import { useGetGroupEventsQuery } from '@/services/backend/backendApi';
import type { EventType, GroupType } from '@/services/backend/types';

export const EventsModal = ({ group }: { group: GroupType }) => {
  const [events, setEvents] = useState<EventType[]>([]);
  const { data, isLoading } = useGetGroupEventsQuery(group.id);

  useEffect(() => {
    if (data?.group_events) {
      setEvents(data.group_events);
    }
  }, [data]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Events</Button>
      </DialogTrigger>
      <DialogContent className='w-full max-w-screen-md'>
        <DialogHeader></DialogHeader>
        <DialogTitle>Group events</DialogTitle>
        <div className='flex flex-col space-y-3'>
          {isLoading ? (
            <LoadingSpinner />
          ) : events.length > 0 ? (
            events.map((event) => <EventsModalEvent key={event.id} event={event} />)
          ) : (
            'Group has no activies.'
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
