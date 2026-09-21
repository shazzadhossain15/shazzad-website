'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Play,
  Square,
  ExternalLink,
  Users,
  Music,
  Clock,
  Disc3,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';

export function ProjectModal() {
  const {
    activeProject,
    closeProjectModal,
    playingTrackId,
    togglePlayPreview,
    stopAudio,
  } = usePortfolio();

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopAudio();
        closeProjectModal();
      }
    };
    if (activeProject) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [activeProject, closeProjectModal, stopAudio]);

  if (!activeProject) return null;

  const isPlaying = playingTrackId === activeProject.id;

  return (
    <div
      id="project-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-neutral-950/60 backdrop-blur-[2px] animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          stopAudio();
          closeProjectModal();
        }
      }}
    >
      <div
        id="project-modal-content"
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white border border-neutral-200 shadow-2xl p-6 sm:p-8 md:p-10 animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            stopAudio();
            closeProjectModal();
          }}
          id="project-modal-close"
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-950 transition-colors focus:outline-none"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Cover Art Column (Square, 3000x3000px aspect ratio) */}
          <div className="md:col-span-5 space-y-4">
            <div className="relative w-full aspect-square bg-neutral-100 border border-neutral-200 overflow-hidden shadow-sm">
              <Image
                src={activeProject.coverUrl}
                alt={`${activeProject.title} Cover Art`}
                fill
                sizes="(max-width: 768px) 100vw, 360px"
                referrerPolicy="no-referrer"
                className="object-cover object-center"
              />
              <div className="absolute bottom-2 right-2 bg-neutral-950/80 text-white text-[10px] uppercase tracking-wider px-2 py-0.5">
                3000 × 3000 PX
              </div>
            </div>

            {/* Ambient Sound Preview Player */}
            <div className="border border-neutral-200 bg-neutral-50 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-widest text-[#0f2b48] font-semibold flex items-center space-x-1.5">
                  <Disc3 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin text-[#0f2b48]' : ''}`} />
                  <span>Harmonic Preview</span>
                </span>
                <span className="text-[10px] text-neutral-500">{activeProject.key} • {activeProject.bpm} BPM</span>
              </div>

              <div className="flex items-center space-x-3 pt-1">
                <button
                  onClick={() => togglePlayPreview(activeProject)}
                  id="modal-play-preview-btn"
                  className={`inline-flex items-center space-x-2 px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium transition-colors ${
                    isPlaying
                      ? 'bg-[#0f2b48] text-white'
                      : 'bg-white border border-neutral-300 text-neutral-800 hover:border-[#0f2b48]'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Square className="w-3 h-3 fill-current" />
                      <span>Stop Preview</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      <span>Play Preview</span>
                    </>
                  )}
                </button>

                {isPlaying && (
                  <span className="text-[11px] text-[#0f2b48] italic animate-pulse">
                    Synthesizing ambient tones...
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#0f2b48] mb-1">
                <span>{activeProject.category}</span>
                <span>•</span>
                <span>{activeProject.year}</span>
              </div>
              <h3
                id="modal-project-title"
                className="font-serif-classic text-3xl sm:text-4xl text-neutral-950 font-normal tracking-tight"
              >
                {activeProject.title}
              </h3>
              <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mt-1">
                Role: {activeProject.role}
              </p>
            </div>

            {/* Collaborators */}
            <div className="border-t border-b border-neutral-100 py-3 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs text-neutral-500 uppercase tracking-wider font-medium">
                <Users className="w-3.5 h-3.5 text-[#0f2b48]" />
                <span>Collaborating Artist(s)</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {activeProject.collaborators.map((artist) => (
                  <span
                    key={artist}
                    className="inline-block bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs px-2.5 py-1 font-medium"
                  >
                    {artist}
                  </span>
                ))}
              </div>
            </div>

            {/* Story / Collaboration Note */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-900">
                Collaboration & Scoring Note
              </h4>
              <p className="text-sm text-neutral-700 leading-relaxed font-light">
                {activeProject.fullNote}
              </p>
            </div>

            {/* Musical Elements */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-900">
                Key Sonic Elements
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeProject.musicalFocus.map((elem) => (
                  <span
                    key={elem}
                    className="text-[11px] text-neutral-600 border border-neutral-200 px-2 py-0.5 bg-white"
                  >
                    {elem}
                  </span>
                ))}
              </div>
            </div>

            {/* Streaming Links */}
            <div className="pt-2 border-t border-neutral-200 space-y-3">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-[#0f2b48]">
                Listen on Platforms
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <a
                  href={activeProject.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1.5 px-3 py-2 border border-neutral-200 hover:border-[#0f2b48] hover:text-[#0f2b48] text-neutral-800 text-xs transition-colors"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Spotify</span>
                </a>
                <a
                  href={activeProject.appleMusicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1.5 px-3 py-2 border border-neutral-200 hover:border-[#0f2b48] hover:text-[#0f2b48] text-neutral-800 text-xs transition-colors"
                >
                  <Disc3 className="w-3.5 h-3.5" />
                  <span>Apple</span>
                </a>
                <a
                  href={activeProject.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1.5 px-3 py-2 border border-neutral-200 hover:border-[#0f2b48] hover:text-[#0f2b48] text-neutral-800 text-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>YouTube</span>
                </a>
                <a
                  href={activeProject.soundcloudUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1.5 px-3 py-2 border border-neutral-200 hover:border-[#0f2b48] hover:text-[#0f2b48] text-neutral-800 text-xs transition-colors"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>SoundCloud</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
