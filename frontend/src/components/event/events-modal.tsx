import { GroupType } from '@/app/(authenticated)/groups/page';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetchers';
import { useEffect, useState } from 'react';
import { UserType } from '@/providers/user-provider';
import { EventsModalEvent } from './events-modal-event';
import { LoadingSpinner } from '../ui/spinners';

interface EventsQuery {
  group_events: EventType[];
}

export interface EventType {
  id: string;
  group_id: string;
  user_id: string;
  title: string;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
  user: UserType;
  group_event_member: {
    attendance: 0 | 1 | 2;
    user_id : string;
    group_event_id: string;
  };
  attendance: {
    going: number;
    not_going: number;
  };
}

export const EventsModal = ({ group }: { group: GroupType }) => {
  const [events, setEvents] = useState<EventType[]>([]);

  const { data, isLoading, isError } = useQuery<EventsQuery>({
    queryKey: ['events', group.id],
    queryFn: async () => fetcher(`/api/groups/${group.id}/group_events`),
  });

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
          {isLoading ? <LoadingSpinner /> : events.length > 0 ?  events.map((event) => <EventsModalEvent key={event.id} event={event} />): 'Group has no activies.'}
        </div>
      </DialogContent>
    </Dialog>
  );
};
