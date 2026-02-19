import { JetBrains_Mono } from 'next/font/google';

const JetMono_font = JetBrains_Mono({
  weight: '400',
  subsets: ['latin'],
});

export const jetmono = JetMono_font.className;
