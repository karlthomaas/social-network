import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { EventsModalEvent } from './events-modal-event';
import { LoadingSpinner } from '../ui/spinners';
import { useGetGroupEventsQuery } from '@/services/backend/actions/groups';
import type { EventType, GroupType } from '@/services/backend/types';
import { useSearchParams } from 'next/navigation';

export const EventsModal = ({ group }: { group: GroupType }) => {
  const params = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<EventType[]>([]);
  const { data, isLoading, refetch } = useGetGroupEventsQuery(group.id);
  const openEvent = params.get('event');

  useEffect(() => {
    if (data?.group_events) {
      setEvents(data.group_events);
    }
  }, [data]);

  useEffect(() => {
    if (params.get('open') === 'events') {
      setIsOpen(true);
      refetch();
    }
  }, [params, refetch]);

  const onOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      refetch();
    }
    setIsOpen(isOpen);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
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
            events.map((event) => <EventsModalEvent key={event.id} event={event} isActive={event.id === openEvent} />)
          ) : (
            'Group has no activies.'
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
