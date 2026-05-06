import type { Metadata } from 'next';
import StyledComponentsRegistry from '@/lib/registry';
import ThemeWrapper from '@/components/ThemeWrapper';

export const metadata: Metadata = {
  title: 'Nosgnoh | Software Engineer',
  description: 'Nosgnoh is a software engineer who builds things for the web.',
  openGraph: {
    title: 'Nosgnoh | Software Engineer',
    description: 'Nosgnoh is a software engineer who builds things for the web.',
    url: 'https://nosgnoh.vercel.app',
    siteName: 'Nosgnoh',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nosgnoh | Software Engineer',
    description: 'Nosgnoh is a software engineer who builds things for the web.',
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
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <ThemeWrapper>
            {children}
          </ThemeWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
