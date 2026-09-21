'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Info, ArrowLeft, Disc } from 'lucide-react';
import { PortfolioProject } from '@/lib/portfolio-data';
import { usePortfolio } from '@/lib/portfolio-context';
import { SongHeroSection } from '@/components/SongHeroSection';

interface SongDetailClientProps {
  slug: string;
  staticProject?: PortfolioProject;
}

export function SongDetailClient({ slug, staticProject }: SongDetailClientProps) {
  const { projects } = usePortfolio();

  // Look up dynamically in context first (supports newly added/edited projects), fall back to static
  const project = projects.find((p) => p.id === slug) || staticProject;

  if (!project) {
    return (
      <main className="flex-1 w-full py-24 px-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-6">
          <Disc className="w-8 h-8" />
        </div>
        <h1 className="font-serif-classic text-3xl sm:text-4xl text-neutral-950 mb-3">
          Song Not Found
        </h1>
        <p className="text-neutral-600 max-w-md mb-8 text-sm leading-relaxed">
          The requested song or project could not be located in the repertoire. It may have been renamed, archived, or removed.
        </p>
        <Link
          href="/portfolio"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#0f2b48] text-white text-xs uppercase tracking-widest hover:bg-[#0f2b48]/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Music Portfolio</span>
        </Link>
      </main>
    );
  }

  return (
    <>
      {/* 1. HERO SECTION: Video/Image background with title, artist names, and platform links overlaid */}
      <SongHeroSection project={project} />

      {/* Informational Content Area Below Hero */}
      <main className="flex-1 w-full py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          {/* Collaboration & Project Notes Section (Single concise narrative) */}
          <section
            id="collaboration-notes-section"
            aria-label="Collaboration & Project Notes"
            className="border border-neutral-200 bg-neutral-50/60 p-8 sm:p-12 md:p-14 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-7"
          >
            {/* Section Header */}
            <div className="border-b border-neutral-200/80 pb-6">
              <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#0f2b48] mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0f2b48]" />
                <span>Production Dossier</span>
              </div>
              <h2 className="font-serif-classic text-3xl sm:text-4xl text-neutral-950 font-normal tracking-tight">
                Collaboration & Project Notes
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-light mt-1.5">
                Primary Role & Credits: <span className="text-neutral-900 font-medium">{project.role}</span>
              </p>
            </div>

            {/* Single Concise Collaboration & Creative Approach Narrative */}
            <div className="space-y-3.5 pt-1">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-900 flex items-center space-x-2">
                <Info className="w-3.5 h-3.5 text-[#0f2b48]" />
                <span>Creative Dialogue & Arrangement Context</span>
              </h3>
              <p className="text-base sm:text-[17px] text-neutral-700 font-light leading-[1.8]">
                {project.collaborationNote || project.shortDescription || project.fullNote}
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
