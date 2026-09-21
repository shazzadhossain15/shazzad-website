import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { PortfolioSection } from '@/components/PortfolioSection';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';

export const metadata: Metadata = {
  title: 'Portfolio | Shazzad Hossain - Music Producer & Composer',
  description:
    'Explore the complete discography, original background scores, and artist collaborations produced and composed by Shazzad Hossain.',
  openGraph: {
    title: 'Music Portfolio | Shazzad Hossain',
    description:
      'Explore the complete discography, original background scores, and artist collaborations produced and composed by Shazzad Hossain.',
  },
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-[#0f2b48] selection:text-white flex flex-col justify-between">
      {/* Sticky Classic Top Navigation */}
      <Navbar />

      {/* Main Content: Full Interactive Portfolio Grid */}
      <main className="flex-1 w-full">
        <PortfolioSection previewMode={false} showBreadcrumbs={true} />
      </main>

      {/* Global Footer & Modals */}
      <Footer />
      <AuthModal />
    </div>
  );
}
