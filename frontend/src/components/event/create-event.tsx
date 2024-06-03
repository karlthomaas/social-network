import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { EventForm } from './event-form';
import { useState } from 'react';

export const CreateEvent = ({ groupId }: { groupId: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button>Create Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Create Event</DialogHeader>
        <EventForm groupId={groupId} onSuccess={closeDialog}/>
      </DialogContent>
    </Dialog>
  );
};
