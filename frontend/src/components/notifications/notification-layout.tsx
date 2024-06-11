import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export const NotificationLayout = ({
  text,
  showActions,
  showRedirect=false,
  callback,
}: {
  text: string;
  showActions: boolean;
  showRedirect?: boolean;
  callback: (value: any) => void;
}) => {
  return (
    <div className='flex items-center space-x-4 p-2 text-sm'>
      <p className='w-full text-md'>{text}</p>
      {showActions && (
        <div className='space-x-2 min-w-[35%]'>
          <Button onClick={() => callback(true)} size='icon' variant='outline' className='rounded-full'>
            <Check size={20} />
          </Button>
          <Button onClick={() => callback(false)} size='icon' variant='outline' className='rounded-full'>
            <X size={20} />
          </Button>
        </div>
      )}
      {
        showRedirect && (
          <Button variant="outline" onClick={() => callback(true)}>
            View
          </Button>
        )
      }
    </div>
  );
};
