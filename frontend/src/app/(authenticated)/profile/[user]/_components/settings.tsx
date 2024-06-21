import { Dialog, DialogTrigger, DialogTitle, DialogContent, DialogFooter } from '@/components/ui/dialog';

import { SettingsForm } from '@/app/(authenticated)/profile/[user]/_components/settings-form';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const SettingsBtn = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Settings</Button>
      </DialogTrigger>
      <DialogContent className='bg-card'>
        <DialogTitle>Profile Settings</DialogTitle>
        <SettingsForm setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
};
