'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function ModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button variant='ghost' size='icon' onClick={handleToggle}>
      {theme === 'dark' ? (
        <Moon size={24} className='rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
      ) : (
        <Sun size={24} className='rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      )}
    </Button>
  );
}
