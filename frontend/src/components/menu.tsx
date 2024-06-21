import Link from 'next/link';
import { Home, LucideIcon, User, Users } from 'lucide-react';

export const Menu = () => {
  return (
    <div className='flex h-max w-full flex-col space-y-6  rounded-lg'>
      <MenuItem name='Home' Icon={Home} link='/home' />
      <MenuItem name='Groups' Icon={Users} link='/groups' />
      <MenuItem name='Profile' Icon={User} link='/profile' />
    </div>
  );
};

const MenuItem = ({ name, Icon, link }: { name: string; Icon: LucideIcon; link: string }) => {
  return (
    <Link
      href={link}
      className='in flex h-[60px] items-center rounded-lg p-2 pl-4 transition-all duration-100 hover:cursor-pointer hover:bg-neutral-200 dark:hover:bg-secondary/50'
    >
      <Icon className='mr-2' />
      <span>{name}</span>
    </Link>
  );
};
