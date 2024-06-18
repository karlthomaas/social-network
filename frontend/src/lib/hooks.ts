import { useDispatch, useSelector, useStore } from 'react-redux';
import type { RootState, AppDispatch, AppStore } from '../store';

import { useState, useEffect, useRef, RefObject } from 'react';

export const useDebouncedValue = (input: string, delay: number): [string, boolean] => {
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(input);

  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(() => {
      setDebouncedValue(input);
      setIsLoading(false);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [input, delay]);

  return [debouncedValue, isLoading];
};

export const useOutsideClick = (callback: () => void, optionalRefs: RefObject<HTMLDivElement>[] = []) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClick = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        // Check if the click is inside any of the optionalRefs - if it is, don't call the callback
        // This is useful for modals where you want to close it using the same button you opened it with
        const isInsideOptionalRef = optionalRefs.some((optionalRef) => optionalRef.current && optionalRef.current.contains(event.target));
        if (!isInsideOptionalRef) {
          callback();
        }
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [ref, callback, optionalRefs]);
  return ref;
};

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
