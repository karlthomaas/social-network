import { useState } from 'react';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const ReplyOptions = ({ handleDelete, handleEdit }: { handleDelete: () => void; handleEdit: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        onClick={() => {
        }}
        className={cn('invisible group-hover:visible', isOpen && 'visible')}
      >
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[200px]'>
        <DropdownMenuItem className='hover:cursor-pointer' onClick={handleEdit}>
          <Pencil size={17} className='mr-2' onClick={handleEdit} /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem className='text-red-700 hover:cursor-pointer focus:text-red-600' onClick={handleDelete}>
          <Trash2 size={17} className='mr-2' /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
