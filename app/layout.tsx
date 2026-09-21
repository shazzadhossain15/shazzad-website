import type { Metadata } from 'next';
import './globals.css';
import { PortfolioProvider } from '@/lib/portfolio-context';

export const metadata: Metadata = {
  title: 'Shazzad Hossain - Music Producer & Composer',
  description:
    'Official portfolio of music producer and composer Shazzad Hossain. Showcasing original scores, background music, artist collaborations, and portfolio works.',
  openGraph: {
    title: 'Shazzad Hossain - Music Producer & Composer',
    description:
      'Official portfolio of music producer and composer Shazzad Hossain. Showcasing original scores, background music, artist collaborations, and portfolio works.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shazzad Hossain - Music Producer & Composer',
    description:
      'Official portfolio of music producer and composer Shazzad Hossain. Showcasing original scores, background music, artist collaborations, and portfolio works.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className="bg-white text-neutral-900 antialiased selection:bg-[#0f2b48] selection:text-white" suppressHydrationWarning>
        <PortfolioProvider>
          {children}
        </PortfolioProvider>
      </body>
    </html>
  );
}
