import { Bricolage_Grotesque, IBM_Plex_Mono, JetBrains_Mono } from 'next/font/google';

const Bricolage_font = Bricolage_Grotesque({
  subsets: ['latin']
});

const JetMono_font = JetBrains_Mono({
  weight: '400',
  subsets: ['latin']
});

export const Bricolage = Bricolage_font.className;
export const Jetmono = JetMono_font.className