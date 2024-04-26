import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';
import { Button } from '../ui/button';

export const NotificationBtn = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
          <Bell size={24} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Nothing here...</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};