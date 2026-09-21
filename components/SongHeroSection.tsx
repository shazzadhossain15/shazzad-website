'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Music2,
  Headphones,
  Video,
  Sliders,
  Waves,
  Disc,
  Apple,
} from 'lucide-react';
import { PortfolioProject, PlatformLink } from '@/lib/portfolio-data';

interface SongHeroSectionProps {
  project: PortfolioProject;
}

function getPlatformIcon(platform: PlatformLink['platform']) {
  switch (platform) {
    case 'spotify':
      return <Music2 className="w-4 h-4" aria-hidden="true" />;
    case 'apple-music':
      return <Apple className="w-4 h-4" aria-hidden="true" />;
    case 'youtube-music':
      return <Headphones className="w-4 h-4" aria-hidden="true" />;
    case 'music-video':
      return <Video className="w-4 h-4" aria-hidden="true" />;
    case 'deezer':
      return <Sliders className="w-4 h-4" aria-hidden="true" />;
    case 'tidal':
      return <Waves className="w-4 h-4" aria-hidden="true" />;
    default:
      return <Disc className="w-4 h-4" aria-hidden="true" />;
  }
}

export function SongHeroSection({ project }: SongHeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // Check if a valid video URL is configured for this song
  const hasVideoSource = Boolean(project.videoClipUrl) && !videoError;

  // Enforce autoplay muted loop with a 30-second cap
  useEffect(() => {
    if (!hasVideoSource) return;

    const vid = videoRef.current;
    if (vid) {
      vid.muted = true;
      vid.defaultMuted = true;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setVideoReady(true);
          })
          .catch(() => {
            // If browser autoplay policy or error blocks it, gracefully keep the visual fallback
            setVideoError(true);
          });
      }
    }
  }, [hasVideoSource, project.videoClipUrl]);

  // Enforce continuous 30-second loop if clip is longer than 30s
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= 30) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  // Filter out any empty/whitespace URLs
  const validPlatforms = project.platforms?.filter((p) => Boolean(p.url && p.url.trim())) || [];

  return (
    <section
      id="song-hero-section"
      className="relative w-full h-auto min-h-[580px] sm:min-h-[620px] lg:h-[78vh] lg:min-h-[660px] lg:max-h-[880px] bg-neutral-950 text-white border-b border-neutral-800 select-text flex flex-col justify-between"
      aria-label={`${project.title} Hero Showcase`}
    >
      {/* BACKGROUND LAYER: Looping 30s Muted Video Clip OR 3000x3000px Cover Art Fallback */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none" aria-hidden="true">
        {hasVideoSource ? (
          <video
            ref={videoRef}
            src={project.videoClipUrl}
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            tabIndex={-1}
            disablePictureInPicture
            disableRemotePlayback
            onTimeUpdate={handleTimeUpdate}
            onError={() => setVideoError(true)}
            onLoadedData={() => setVideoReady(true)}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
              videoReady ? 'opacity-90' : 'opacity-40'
            }`}
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          />
        ) : null}

        {/* Fallback Static Cover Art Image (shown if no video provided or while loading/error) */}
        {(!hasVideoSource || !videoReady) && (
          <Image
            src={project.coverUrl}
            alt={`${project.title} Visual Background`}
            fill
            priority
            sizes="100vw"
            referrerPolicy="no-referrer"
            className="object-cover object-center filter blur-[0.5px] scale-105 transition-opacity duration-700"
            style={{
              objectFit: 'cover',
            }}
          />
        )}

        {/* Semi-transparent dark overlay for high contrast and cinematic readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/75 to-neutral-950/60 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_0%,_rgba(0,0,0,0.5)_100%] pointer-events-none" />
      </div>

      {/* FOREGROUND OVERLAY CONTENT */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 lg:py-12 flex flex-col justify-between min-h-full">
        {/* Top Bar inside Hero: Back to Portfolio Button */}
        <div className="flex items-center justify-between pb-3 sm:pb-2">
          <Link
            href="/portfolio"
            id="hero-back-to-portfolio-btn"
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 hover:text-white transition-all py-1.5 px-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 hover:border-white/30 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-white/80 group-hover:text-white" />
            <span>← Back to Portfolio</span>
          </Link>
        </div>

        {/* Center / Hero Main Content */}
        <div className="my-auto py-4 sm:py-6 max-w-4xl space-y-4 sm:space-y-6">
          {/* Metadata Pill (ONLY occurrence of Category & Year tag on the page) */}
          <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-[0.25em] uppercase text-neutral-300">
            <span className="w-5 h-[2px] bg-[#0f2b48]" />
            <span>{project.category} &bull; Release Year {project.year}</span>
          </div>

          {/* Song Title in Large, Dominant Elegant Serif Typography */}
          <h1
            id="hero-song-title"
            className="font-serif-classic text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-white tracking-tight leading-[1.1] sm:leading-[1.05] drop-shadow-sm"
          >
            {project.title}
          </h1>

          {/* Artist / Collaborator Name in high-contrast styling */}
          <div id="hero-collaborators" className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-neutral-400 font-semibold">
              Collaborators:
            </span>
            <span className="font-serif-classic text-xl sm:text-2xl md:text-3xl text-neutral-100 font-light italic">
              {project.collaborators.join(' & ')}
            </span>
          </div>

          {/* Atmospheric description snippet */}
          <p className="max-w-2xl text-sm sm:text-base md:text-lg text-neutral-300 font-light leading-relaxed">
            {project.shortDescription}
          </p>
        </div>

        {/* Bottom Platform Links Strip Overlay (Only if platform links are provided) */}
        {validPlatforms.length > 0 && (
          <div className="pt-5 sm:pt-6 mt-4 sm:mt-6 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300">
                Listen & Watch on Official Platforms:
              </span>
            </div>

            {/* Platform Buttons Grid: stacks cleanly on mobile, wraps flexibly on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2.5 sm:gap-3 pt-1">
              {validPlatforms.map((platform, idx) => (
                <a
                  key={idx}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  id={`hero-platform-btn-${platform.platform}`}
                  className="group flex items-center justify-between sm:justify-start space-x-2.5 px-3.5 sm:px-4 py-2.5 bg-white/10 hover:bg-[#0f2b48] text-white hover:text-white backdrop-blur-md border border-white/20 hover:border-[#0f2b48] transition-all duration-200 focus:outline-none min-h-[44px]"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="text-neutral-300 group-hover:text-white transition-colors shrink-0">
                      {getPlatformIcon(platform.platform)}
                    </span>
                    <span className="text-xs font-medium tracking-wide truncate">
                      {platform.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0 sm:ml-auto">
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-white/20 group-hover:bg-white/25 text-white border border-white/25 transition-colors whitespace-nowrap">
                      {platform.action}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
