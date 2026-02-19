import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import { Jetmono } from '@/utils/fonts';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';

const FRONTEND_URL = 'https://privado.abdullahtech.dev';

export const metadata: Metadata = {
  metadataBase: new URL(FRONTEND_URL),
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

  openGraph: {
    title: 'Privado - A Real Time Chat Application',
    description:
      'Privado, a private room chat application made with Typescript and web-sockets leveraging Socket.IO',
    url: FRONTEND_URL,
    siteName: 'Privado',
    images: [
      {
        url: `${FRONTEND_URL}/og-image.png`,
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },

  twitter: {
    site: FRONTEND_URL,
    creator: '@abdullah_twt23',
    title: 'Privado - A Real Time Chat Application',
    description:
      'Privado, a private room chat application made with Typescript and web-sockets leveraging Socket.IO',
    images: {
      url: `${FRONTEND_URL}/og-image.png`,
      type: 'image/png',
    },
  },

  appLinks: {
    web: {
      url: new URL(FRONTEND_URL),
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
