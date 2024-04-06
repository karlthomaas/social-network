interface LayoutProps {
  children: React.ReactNode;
}

import Navbar from '@/components/navbar';

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <div className='mx-auto h-full w-full max-w-screen-lg p-4'>{children}</div>
    </>
  );
}
