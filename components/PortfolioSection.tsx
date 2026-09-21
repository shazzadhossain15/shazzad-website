'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, type Variants } from 'motion/react';
import { PORTFOLIO_PROJECTS } from '@/lib/portfolio-data';
import { usePortfolio } from '@/lib/portfolio-context';

interface PortfolioSectionProps {
  previewMode?: boolean;
  showBreadcrumbs?: boolean;
}

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export function PortfolioSection({ previewMode = false, showBreadcrumbs = false }: PortfolioSectionProps) {
  const { projects } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Film & BGM', 'Collaboration', 'Original Works'];

  const allProjects = projects && projects.length > 0 ? projects : PORTFOLIO_PROJECTS;

  const displayedProjects = previewMode
    ? allProjects.slice(0, 3)
    : selectedCategory === 'All'
    ? allProjects
    : allProjects.filter((p) => p.category === selectedCategory);

  return (
    <section
      id={previewMode ? 'portfolio-preview' : 'portfolio-catalog'}
      aria-label="Portfolio Works"
      className={`w-full bg-white ${
        previewMode
          ? 'py-16 md:py-20 border-t border-neutral-200/80'
          : 'pt-8 pb-16 md:pt-10 md:pb-20'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Compact Breadcrumb for dedicated Portfolio Page */}
        {!previewMode && showBreadcrumbs && (
          <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-neutral-500 mb-6 sm:mb-8">
            <Link
              href="/#home"
              id="portfolio-breadcrumb-home"
              className="hover:text-[#0f2b48] transition-colors inline-flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-900 font-semibold">Portfolio</span>
          </div>
        )}

        {/* Section Header: Unified & Compact */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-[0.22em] uppercase text-[#0f2b48] mb-1.5">
              <span className="w-4 h-[1.5px] bg-[#0f2b48]"></span>
              <span>{previewMode ? 'Selected Discography' : 'Repertoire & Discography'}</span>
            </div>
            {previewMode ? (
              <h2
                id="portfolio-heading"
                className="font-serif-classic text-3xl sm:text-4xl font-normal text-neutral-950 tracking-tight"
              >
                Featured Works
              </h2>
            ) : (
              <h1
                id="portfolio-heading"
                className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-normal text-neutral-950 tracking-tight"
              >
                Music Portfolio
              </h1>
            )}
            <p className="text-sm text-neutral-600 font-light mt-1.5 max-w-xl">
              {previewMode
                ? 'A curated glimpse into recent cinematic background scores and collaborative releases.'
                : 'Browse all original scores, studio collaborations, and released tracks.'}
            </p>
          </div>

          {/* Clean Category Filters (Only in full portfolio page) */}
          {!previewMode && (
            <div className="flex flex-wrap items-center gap-2 pt-1 md:pt-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#0f2b48] text-white shadow-xs'
                      : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-950'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Gallery Grid: Square 3000x3000px Cover Art Items */}
        <motion.div
          key={previewMode ? 'preview' : selectedCategory}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          {displayedProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              className="flex flex-col"
            >
              <Link
                id={`portfolio-item-${project.id}`}
                href={`/song/${project.id}`}
                className="group cursor-pointer flex flex-col space-y-4 focus:outline-none h-full"
              >
                {/* Cover Art Container - Strictly Square 3000x3000px resolution display */}
                <div className="relative w-full aspect-square bg-neutral-100 border border-neutral-200 overflow-hidden">
                  <Image
                    src={project.coverUrl}
                    alt={`${project.title} - Cover Art`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    referrerPolicy="no-referrer"
                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />

                  {/* Subtle overlay hint */}
                  <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 px-3 py-1.5 text-[11px] uppercase tracking-widest text-[#0f2b48] font-semibold border border-neutral-300 shadow-sm flex items-center space-x-1.5">
                      <span>View Song Details</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-neutral-800 text-[10px] uppercase tracking-wider px-2 py-0.5 border border-neutral-200">
                    {project.category}
                  </div>
                </div>

                {/* Title & Metadata */}
                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span>{project.year}</span>
                      <span>{project.role.split(',')[0]}</span>
                    </div>

                    <h3 className="font-serif-classic text-2xl text-neutral-900 group-hover:text-[#0f2b48] transition-colors leading-snug group-hover:underline underline-offset-4 decoration-neutral-300">
                      {project.title}
                    </h3>

                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {project.shortDescription}
                    </p>
                  </div>

                  {/* Collaborators preview */}
                  <div className="pt-1 text-[11px] text-neutral-500 truncate">
                    <span className="text-neutral-400">With: </span>
                    {project.collaborators.join(', ')}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Teaser CTA on Home Page */}
        {previewMode ? (
          <div className="mt-14 pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-500 font-light text-center sm:text-left">
              Showing 3 of {PORTFOLIO_PROJECTS.length} released scores and collaborations.
            </p>
            <Link
              href="/portfolio"
              id="view-full-portfolio-btn"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#0f2b48] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#163a5f] transition-colors shadow-xs group"
            >
              <span>View Full Portfolio ({PORTFOLIO_PROJECTS.length} Projects)</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        ) : (
          /* Bottom gallery note on Full Portfolio page */
          <div className="mt-14 pt-8 border-t border-neutral-100 text-center">
            <p className="text-xs text-neutral-500 font-light">
              All cover artwork displayed at 3000 × 3000 master resolution. Click any cover art to open its dedicated song page with collaboration notes and official platform links.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
