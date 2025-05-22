import { useState, useEffect } from 'react';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';

export const ToggleTheme: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme == 'light' ? 'dark' : 'light');
  };

  return (
    <button
      className="h-[36px] lg:w-[36px] flex items-center justify-center border-gray-300 dark:border-white/20 rounded-[6px] hover:bg-zinc-100 dark:hover:bg-zinc-800/50 border-1 cursor-pointer"
      onClick={toggleTheme}
    >
      <SafeRender>
        {theme == 'light' ? (
          <MoonIcon className="h-[18px] w-[18px]" />
        ) : (
          <SunIcon className="h-[18px] w-[18px]" />
        )}
      </SafeRender>
    </button>
  );
};

type Child = {
  children: React.ReactNode;
};

const SafeRender: React.FC<Child> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // or return a placeholder/spinner

  return <>{children}</>;
};
