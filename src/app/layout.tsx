import type { Metadata } from 'next';
import StyledComponentsRegistry from '@/lib/registry';
import ThemeWrapper from '@/components/ThemeWrapper';
import { calibre, sfMono } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'Nosgnoh | Software Engineer & Triathlete',
  description:
    'Nosgnoh — software engineer, amateur triathlete, photographer, and backpacker. Code, race, capture, and explore.',
  openGraph: {
    title: 'Nosgnoh | Software Engineer & Triathlete',
    description:
      'Nosgnoh — software engineer, amateur triathlete, photographer, and backpacker. Code, race, capture, and explore.',
    url: 'https://nosgnoh.vercel.app',
    siteName: 'Nosgnoh',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nosgnoh | Software Engineer & Triathlete',
    description:
      'Nosgnoh — software engineer, amateur triathlete, photographer, and backpacker. Code, race, capture, and explore.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${calibre.variable} ${sfMono.variable}`}>
      <body>
        <StyledComponentsRegistry>
          <ThemeWrapper>{children}</ThemeWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
