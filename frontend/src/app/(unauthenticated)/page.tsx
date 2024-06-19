import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Home() {
  return (
    <main className='mx-auto h-full w-full p-4'>
      <div>
        <h1 className='text-5xl'>Welcome to Social Network.</h1>
        <Button>Get Started</Button>
      </div>
    </main>
  );
}
