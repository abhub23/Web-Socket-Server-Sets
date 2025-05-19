import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import { Bricolage } from '@/utils/fonts';

export const metadata: Metadata = {
  metadataBase: new URL('https://github.com/abhub23'),
  title: 'Chathub',
  description: 'Chathub, a private room chat application made with Socket.IO',

  keywords: [
    'Abdullah Mukri',
    'Software Engineer',
    'Software Developer',
    'Fullstack Developer',
    'Socket.IO',
    'Chathub',
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
    siteId: 'https://x.com/abdullah_twt23',
  },

  appLinks: {
    web: {
      url: new URL('https://chathub.abdullahtech.dev'),
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
      <body className={` ${Bricolage} `}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
