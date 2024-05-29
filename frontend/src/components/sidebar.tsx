import clsx from 'clsx';
import { Button } from '@/components/ui/button';

export const Sidebar = ({ children, isOpen, handleClose }: { children: React.ReactNode; isOpen: Boolean; handleClose: () => void }) => {
  console.log(isOpen);
  return (
    <div
      className={clsx('fixed top-0 z-50 h-full w-full', {
        'hidden': !isOpen,
      })}
    >
      <div
        className={clsx('relative z-50 w-full overflow-hidden bg-secondary transition-all duration-200 ease-in-out flex flex-col max-w-screen-lg', {
          'h-0': !isOpen,
          'h-max min-h-[200px] bg-background': isOpen,
        })}
      >
        <div className='ml-auto'>
          <Button onClick={handleClose}>
            X
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};
