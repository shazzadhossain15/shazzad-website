'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Disc, Mail, Music2, MapPin, Film, ArrowDown } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';

export function HeroSection() {
  const { homeData } = usePortfolio();
  const { hero } = homeData;

  return (
    <section
      id="home"
      aria-label="Home / Introduction"
      className="relative w-full overflow-hidden"
    >
      {/* ========================================================================= */}
      {/* 1. TABLET & MOBILE LAYOUT (< 1024px: 320px up to 1023px)                 */}
      {/* ========================================================================= */}
      <div className="block lg:hidden w-full">
        {/* Full-width Photo Banner (Edge-to-edge with 60-70vh height) */}
        <div className="relative w-full h-[64vh] min-h-[440px] max-h-[620px] overflow-hidden bg-neutral-950">
          <Image
            src={hero.backgroundImageUrl}
            alt={`${hero.name} - ${hero.tagline}`}
            fill
            priority
            sizes="100vw"
            unoptimized={hero.backgroundImageUrl?.startsWith('data:')}
            referrerPolicy="no-referrer"
            className="object-cover object-center"
          />

          {/* Dark gradient overlay: darkest at bottom-left, fading to transparent toward top-right */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top right, rgba(10, 27, 45, 0.94) 0%, rgba(10, 27, 45, 0.72) 38%, rgba(10, 27, 45, 0.25) 70%, transparent 100%)',
            }}
          />

          {/* Bottom fade for smooth contrast transition */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a1b2d]/90 via-[#0a1b2d]/40 to-transparent pointer-events-none" />

          {/* Small studio badge top-right on tablet/mobile banner */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 bg-[#0a1b2d]/85 backdrop-blur-md border border-white/20 px-3 py-1.5 text-[10px] uppercase tracking-widest text-neutral-200 font-medium flex items-center space-x-1.5 shadow-sm">
            <Music2 className="w-3 h-3 text-sky-400" />
            <span>{hero.badgeText || 'Scoring Suite'}</span>
          </div>

          {/* OVERLAID TEXT (Bottom-Left Area directly on top of the photo) */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10 z-10">
            <div className="max-w-xl space-y-2 sm:space-y-2.5">
              {/* Category pill */}
              <div className="inline-flex items-center space-x-2 text-[11px] font-semibold tracking-[0.25em] uppercase text-sky-300">
                <span className="w-4 h-[1.5px] bg-sky-300"></span>
                <span>{hero.categoryTag || 'Official Artist Profile'}</span>
              </div>

              {/* Name */}
              <h1
                id="hero-name-heading-mobile"
                className="font-serif-classic text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
              >
                {hero.name}
              </h1>

              {/* Tagline */}
              <p className="font-sans text-sm sm:text-base md:text-lg font-light tracking-wide text-neutral-200 uppercase">
                {hero.tagline}
              </p>

              {/* Location & Specialty */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-neutral-300 font-light pt-0.5">
                {hero.location && (
                  <span className="flex items-center space-x-1 text-neutral-300">
                    <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>{hero.location}</span>
                  </span>
                )}
                {hero.location && hero.specialtyTag && (
                  <span className="text-neutral-500">•</span>
                )}
                {hero.specialtyTag && (
                  <span className="flex items-center space-x-1 text-neutral-300">
                    <Film className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>{hero.specialtyTag}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section Below Photo (Normal white background, NOT in a dark box) */}
        <div className="w-full max-w-full bg-white text-neutral-900 border-b border-neutral-200/80 px-4 sm:px-8 py-8 sm:py-10 md:py-12 overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
            {/* Description paragraphs */}
            <div className="space-y-2 sm:space-y-3">
              {hero.description && (
                <p className="text-base sm:text-lg text-neutral-700 font-light leading-relaxed">
                  {hero.description}
                </p>
              )}
              {hero.secondaryDescription && (
                <p className="text-sm sm:text-base text-neutral-500 font-normal leading-relaxed">
                  {hero.secondaryDescription}
                </p>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              <Link
                href="/portfolio"
                id="hero-portfolio-cta-mobile"
                className="inline-flex items-center space-x-2 px-5 sm:px-7 py-3 sm:py-3.5 bg-[#0f2b48] text-white hover:bg-[#163a5f] text-xs uppercase tracking-widest font-semibold transition-all duration-200 shadow-sm"
              >
                <Disc className="w-4 h-4 text-white" />
                <span>{hero.button1Text || 'Explore Portfolio'}</span>
              </Link>

              <a
                href="#contact"
                id="hero-contact-cta-mobile"
                className="inline-flex items-center space-x-2 px-5 sm:px-7 py-3 sm:py-3.5 border border-neutral-300 text-neutral-900 hover:border-[#0f2b48] hover:text-[#0f2b48] text-xs uppercase tracking-widest font-semibold transition-all duration-200"
              >
                <Mail className="w-4 h-4" />
                <span>{hero.button2Text || 'Get in Touch'}</span>
              </a>
            </div>

            {/* Quick Stats in classic style */}
            <div className="pt-6 grid grid-cols-3 gap-2 sm:gap-6 border-t border-neutral-100 max-w-md w-full">
              {hero.stats.map((stat, idx) => (
                <div key={idx}>
                  <span className="block font-serif-classic text-xl sm:text-3xl text-neutral-950 font-medium">
                    {stat.value}
                  </span>
                  <span className="text-[9px] sm:text-[11px] uppercase tracking-wider text-neutral-500 font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Scroll cue */}
            <div className="pt-2">
              <a
                href="#about"
                aria-label="Scroll down to About section"
                className="group inline-flex items-center space-x-2 text-neutral-400 hover:text-[#0f2b48] transition-colors"
              >
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Scroll to Discover</span>
                <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#0f2b48]" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP LAYOUT (>= 1024px: Angled / Diagonal Split Screen)            */}
      {/* ========================================================================= */}
      <div className="hidden lg:block relative w-full bg-[#0f2b48] min-h-[680px] xl:min-h-[740px] overflow-hidden">
        {/* Right Photo with Diagonal Cut */}
        <div
          className="absolute top-0 right-0 bottom-0 w-[54%] xl:w-[52%] h-full overflow-hidden z-0"
          style={{
            clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 0% 100%)',
          }}
        >
          <Image
            src={hero.backgroundImageUrl}
            alt={`${hero.name} - ${hero.tagline}`}
            fill
            priority
            sizes="54vw"
            unoptimized={hero.backgroundImageUrl?.startsWith('data:')}
            referrerPolicy="no-referrer"
            className="object-cover object-center scale-[1.02] hover:scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Subtle cinematic vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1b2d]/60 via-transparent to-black/20 pointer-events-none" />
        </div>

        {/* Modern angled accent line along the diagonal seam (>= 1024px) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id="diagonalSeamGlowDesktop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.2)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.05)" />
            </linearGradient>
          </defs>
          <line
            x1="53.5"
            y1="0"
            x2="46"
            y2="100"
            stroke="url(#diagonalSeamGlowDesktop)"
            strokeWidth="0.3"
          />
        </svg>

        {/* Floating Studio Badge on Desktop */}
        <div className="absolute bottom-8 right-8 z-20 bg-[#0a1b2d]/85 backdrop-blur-md border border-white/20 px-4 py-2 text-[11px] tracking-widest uppercase text-neutral-200 font-medium flex items-center space-x-2 shadow-lg">
          <Music2 className="w-3.5 h-3.5 text-sky-400" />
          <span>{hero.badgeText || 'Studio & Scoring Suite'}</span>
        </div>

        {/* Desktop Left Dark Content Container */}
        <div className="relative z-20 max-w-6xl mx-auto px-6 sm:px-8 py-24 lg:py-32 xl:py-36">
          <div className="w-[50%] xl:w-[46%] flex flex-col justify-center space-y-6 sm:space-y-7">
            {/* Category / badge */}
            <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-[0.25em] uppercase text-sky-300">
              <span className="w-6 h-[1.5px] bg-sky-300"></span>
              <span>{hero.categoryTag || 'Official Artist Profile'}</span>
            </div>

            {/* Name & Tagline */}
            <div className="space-y-3">
              <h1
                id="hero-name-heading"
                className="font-serif-classic text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.08]"
              >
                {hero.name}
              </h1>

              <p className="font-sans text-lg lg:text-xl font-light tracking-wide text-neutral-200">
                {hero.tagline}
              </p>
            </div>

            {/* Location & Specialty */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-neutral-300 font-light">
              {hero.specialtyTag && (
                <span className="inline-flex items-center space-x-1.5 text-neutral-200 font-medium tracking-wider uppercase text-xs">
                  <Film className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>{hero.specialtyTag}</span>
                </span>
              )}
              {hero.specialtyTag && hero.location && (
                <span className="text-neutral-400">•</span>
              )}
              {hero.location && (
                <span className="inline-flex items-center space-x-1.5 text-neutral-300 tracking-wider uppercase text-xs">
                  <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>{hero.location}</span>
                </span>
              )}
            </div>

            {/* Subtle Accent Divider */}
            <div className="w-16 h-[1px] bg-white/20"></div>

            {/* Brief Emotive Intro */}
            {hero.description && (
              <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-lg">
                {hero.description}
              </p>
            )}

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/portfolio"
                id="hero-portfolio-cta"
                className="inline-flex items-center space-x-2 px-7 py-3.5 bg-white text-[#0f2b48] hover:bg-neutral-100 text-xs uppercase tracking-widest font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <Disc className="w-4 h-4 text-[#0f2b48]" />
                <span>{hero.button1Text || 'Explore Portfolio'}</span>
              </Link>

              <a
                href="#contact"
                id="hero-contact-cta"
                className="inline-flex items-center space-x-2 px-7 py-3.5 border border-white/70 text-white hover:bg-white hover:text-[#0f2b48] text-xs uppercase tracking-widest font-semibold transition-all duration-200 hover:-translate-y-0.5"
              >
                <Mail className="w-4 h-4" />
                <span>{hero.button2Text || 'Get in Touch'}</span>
              </a>
            </div>

            {/* Quick Stats Metrics */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-white/15 max-w-md">
              {hero.stats.map((stat, idx) => (
                <div key={idx}>
                  <span className="block font-serif-classic text-3xl text-white font-medium">
                    {stat.value}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Cue on Desktop */}
          <div className="pt-16 flex justify-start">
            <a
              href="#about"
              aria-label="Scroll down to About section"
              className="group inline-flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Scroll to Discover</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce text-sky-400" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

