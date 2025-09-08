import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import { Jetmono } from '@/utils/fonts';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  metadataBase: new URL('https://privado.abdullahtech.dev'),
  title: 'Privado - A Real Time Chat Application',
  description:
    'Privado, a private room chat application made with Typescript and web-sockets leveraging Socket.IO',
  icons: {
    icon: '/chat.png',
  },

  keywords: [
    'Abdullah Mukri',
    'Software Engineer',
    'Software Developer',
    'Fullstack Developer',
    'Web sockets',
    'Socket.IO',
    'Privado',
    'Javascript',
    'Typescript',
    'React js',
    'Node js',
    'Next js',
  ],
  authors: {
    url: 'https://github.com/abhub23',
    name: 'Abdullah Mukri',
  },
  publisher: 'Abdullah Mukri',
  twitter: {
    site: 'https://x.com/abdullah_twt23',
    siteId: 'abdullah_twt23',
  },

  appLinks: {
    web: {
      url: new URL('https://privado.abdullahtech.dev'),
    },
  },

  category: 'Private Chat Application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="light"
      style={{ colorScheme: 'light' }}
      suppressHydrationWarning
    >
      <body className={cn(Jetmono)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
