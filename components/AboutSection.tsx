'use client';

import React from 'react';
import Image from 'next/image';
import { Sliders, Clapperboard, Users, Radio, Sparkles, Award } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';

export function AboutSection() {
  const { homeData } = usePortfolio();
  const { about } = homeData;

  const getDisciplineIcon = (index: number) => {
    switch (index % 4) {
      case 0:
        return Clapperboard;
      case 1:
        return Sliders;
      case 2:
        return Users;
      default:
        return Radio;
    }
  };

  return (
    <section
      id="about"
      aria-label="About Shazzad Hossain"
      className="w-full py-20 md:py-28 bg-white border-t border-neutral-200/80"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-14 md:mb-18">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-[0.22em] uppercase text-[#0f2b48] mb-3">
            <span className="w-5 h-[1.5px] bg-[#0f2b48]"></span>
            <span>{about.sectionSubtitle || 'Biography & Philosophy'}</span>
          </div>
          <h2
            id="about-heading"
            className="font-serif-classic text-4xl sm:text-5xl font-normal text-neutral-950 tracking-tight"
          >
            {about.sectionHeading || 'About Shazzad Hossain'}
          </h2>
          <div className="w-12 h-[1.5px] bg-[#0f2b48] mt-4"></div>
        </div>

        {/* 2-Column Grid: Image + Bio Text */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Photo Column */}
          <div className="lg:col-span-5">
            <div className="relative border border-neutral-200 bg-neutral-50 p-2 sm:p-3">
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-200">
                <Image
                  src={about.profileImageUrl}
                  alt={`${about.sectionHeading} composing at studio instruments`}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  unoptimized={about.profileImageUrl?.startsWith('data:')}
                  referrerPolicy="no-referrer"
                  className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              {about.quote && (
                <div className="pt-3 pb-1 text-center">
                  <p className="font-serif-classic text-sm italic text-neutral-600">
                    {about.quote}
                  </p>
                </div>
              )}
            </div>

            {/* Small stats shown simply as text (not flashy counters) as explicitly requested */}
            <div className="mt-8 border border-neutral-200 bg-neutral-50/50 p-6 space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-[#0f2b48]">
                Career Snapshot
              </h3>
              <div className="space-y-3 pt-2 text-sm">
                {about.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className={`flex justify-between items-baseline ${
                      idx < about.stats.length - 1 ? 'border-b border-neutral-200/60 pb-2' : ''
                    }`}
                  >
                    <span className="text-neutral-600">{stat.label}</span>
                    <span className="font-serif-classic text-lg text-neutral-900 font-medium">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bio Text Column */}
          <div className="lg:col-span-7 space-y-6 text-neutral-700 leading-relaxed">
            {about.headline && (
              <h3 className="font-serif-classic text-2xl sm:text-3xl text-neutral-900 font-normal">
                {about.headline}
              </h3>
            )}

            {about.bioParagraph1 && (
              <p className="text-base text-neutral-700 font-light leading-relaxed whitespace-pre-line">
                {about.bioParagraph1}
              </p>
            )}

            {about.bioParagraph2 && (
              <p className="text-base text-neutral-700 font-light leading-relaxed whitespace-pre-line">
                {about.bioParagraph2}
              </p>
            )}

            {about.bioParagraph3 && (
              <p className="text-base text-neutral-700 font-light leading-relaxed whitespace-pre-line">
                {about.bioParagraph3}
              </p>
            )}

            {/* Specialization List */}
            {about.specializations && about.specializations.length > 0 && (
              <div className="pt-6 border-t border-neutral-200">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[#0f2b48] mb-6">
                  {about.specializationsHeading || 'Specialized Disciplines'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {about.specializations.map((spec, idx) => {
                    const Icon = getDisciplineIcon(idx);
                    return (
                      <div key={spec.title || idx} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4 text-[#0f2b48] shrink-0" />
                          <h5 className="font-medium text-sm text-neutral-900">{spec.title}</h5>
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed pl-6">
                          {spec.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quote / Sign-off */}
            {about.signOffName && (
              <div className="pt-6 flex items-center space-x-4">
                <div className="w-10 h-[1px] bg-neutral-300"></div>
                <span className="font-serif-classic italic text-neutral-800 text-lg">
                  {about.signOffName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

