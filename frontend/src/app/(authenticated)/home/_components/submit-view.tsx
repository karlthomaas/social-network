import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export const SubmitView = ({next}: {next: () => void}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Post</DialogTitle>
        <DialogDescription>
            <Button onClick={next} variant="outline" size="sm">Privacy</Button>
        </DialogDescription>
      </DialogHeader>
      <Textarea placeholder="What's on your mind?" />
      <Button>Submit</Button>
    </DialogContent>
  );
};
