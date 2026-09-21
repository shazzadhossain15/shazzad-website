import React from 'react';
import type { Metadata } from 'next';
import { PORTFOLIO_PROJECTS, getProjectBySlug } from '@/lib/portfolio-data';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';
import { SongDetailClient } from '@/components/SongDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export function generateStaticParams() {
  return PORTFOLIO_PROJECTS.map((project) => ({
    slug: project.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Song Details | Shazzad Hossain',
    };
  }

  return {
    title: `${project.title} | Shazzad Hossain - Music Producer & Composer`,
    description: `${project.title} (${project.year}) - Produced and composed by Shazzad Hossain. ${project.shortDescription}`,
    openGraph: {
      title: `${project.title} | Shazzad Hossain`,
      description: project.shortDescription,
      images: [
        {
          url: project.coverUrl,
          width: 1200,
          height: 1200,
          alt: `${project.title} Master Artwork`,
        },
      ],
    },
  };
}

export default async function SongDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-[#0f2b48] selection:text-white flex flex-col justify-between">
      {/* Top Navbar */}
      <Navbar />

      {/* Dynamic Song Detail Client View */}
      <SongDetailClient slug={slug} staticProject={project} />

      {/* Global Footer & Auth Modal */}
      <Footer />
      <AuthModal />
    </div>
  );
}
