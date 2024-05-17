import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { EventForm } from './event-form';

export const CreateEvent = ({ groupId }: { groupId: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Create Event</DialogHeader>
        <EventForm groupId={groupId} />
      </DialogContent>
    </Dialog>
  );
};
