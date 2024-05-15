import { UserType } from '@/providers/user-provider';
import { GroupType } from '../../page';
import { GroupInvite } from './group-invite';
import { GroupLeaveButton } from './group-leave-button';
import { CreateEvent } from '@/components/event/create-event';
import { GroupJoinRequests } from './group-join-requests';
import { CreatePost } from '@/app/(authenticated)/home/_components/create-post';
import { DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GroupFeed } from './group-feed';
import { EventsModal } from '@/components/event/events-modal';

export const GroupMemberView = ({ user, group, isOwner }: { user: null | UserType; group: GroupType; isOwner: boolean }) => {
  return (
    <>
      <div className='flex space-x-2'>
        <GroupInvite groupId={group.id} />
        {!isOwner && user && <GroupLeaveButton groupId={group.id} userId={user.id} />}
        <CreateEvent groupId={group.id} />
        <EventsModal group={group} />
        {isOwner && <GroupJoinRequests groupId={group.id} />}
      </div>
      <div className='flex h-[80px] w-full items-center rounded-xl border border-border bg-background px-3'>
        <div className='aspect-square w-[50px] rounded-full bg-secondary' />
        <CreatePost mutationKeys={['group-feed']} group={group}>
          <DialogTrigger asChild>
            <Button className='ml-3 w-full justify-start' variant='outline'>
              What's on your mind?
            </Button>
          </DialogTrigger>
        </CreatePost>
      </div>
      <div>
        <GroupFeed groupId={group.id} />
      </div>
    </>
  );
};
