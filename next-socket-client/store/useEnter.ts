import { useEffect, useRef } from 'react';

export const useEnter = (func: Function) => {
  const EnterRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key == 'Enter') {
        func();
      }
    };

    window.addEventListener('keydown', handleEnter);

    return () => {
      window.removeEventListener('keydown', handleEnter);
    };
  }, [func]);

  return EnterRef;
};
