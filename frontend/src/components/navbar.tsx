import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className='h-[65px] w-full border-b-[1px] border-border'>
      <ul className='mx-auto flex h-full max-w-screen-lg items-center justify-between p-4'>
        <li>
            <Link href="/" className='flex space-x-4 items-center'>
                <div className='h-[30px] w-[30px] rounded-lg bg-secondary' />
                <p className='text-lg'>Social Network</p>
            </Link>
        </li>
        <li className='md:hidden'>
          <Button size='sm' variant='ghost'>
            <Menu size={25} />
          </Button>
        </li>
        <li className='hidden md:block'>
          <Link href='/register'>
            <Button size='sm' >
              Sign up
            </Button>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
