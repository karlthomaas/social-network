import { cn } from '@/lib/utils';
import Image from 'next/image';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const ProfilePicture = ({ className, url }: { className?: string; url?: string | null }) => {
  return (
    <div
      className={cn('relative z-20 aspect-square w-[126px] overflow-hidden rounded-full', {
        'bg-blue-900': !url,
      })}
    >
      {url && <Image unoptimized src={`${BACKEND_URL}${url}`} alt='profile picture' layout='fill' />}
    </div>
  );
};
