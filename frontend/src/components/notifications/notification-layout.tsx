import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export const NotificationLayout = ({
  text,
  showActions,
  callback,
}: {
  text: string;
  showActions: boolean;
  callback: (value: boolean) => void;
}) => {
  return (
    <div className='flex items-center space-x-4 p-2 text-sm'>
      <p className='max-w-[65%]'>{text}</p>
      {showActions && (
        <div className='space-x-2'>
          <Button onClick={() => callback(true)} size='icon' variant='outline' className='rounded-full'>
            <Check size={20} />
          </Button>
          <Button onClick={() => callback(false)} size='icon' variant='outline' className='rounded-full'>
            <X size={20} />
          </Button>
        </div>
      )}
    </div>
  );
};
