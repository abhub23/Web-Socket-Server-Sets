'use client';

import { useEffect, useState } from 'react';
type Child = {
  children: React.ReactNode;
};

export const SafeRender: React.FC<Child> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // or return a placeholder/spinner

  return <>{children}</>;
};
