'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUp, Music2 } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="site-footer"
      className="w-full bg-white border-t border-neutral-200 py-12 md:py-16 text-neutral-600"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-neutral-100">
          <div>
            <span className="font-serif-classic text-2xl text-neutral-950 font-normal tracking-wide block">
              Shazzad Hossain
            </span>
            <span className="text-xs tracking-[0.2em] uppercase text-neutral-400 font-medium">
              Music Producer & Composer
            </span>
          </div>

          {/* Direct Navigation Links */}
          <nav aria-label="Footer Navigation" className="flex flex-wrap gap-6 text-xs uppercase tracking-wider text-neutral-600">
            <Link href="/#home" className="hover:text-[#0f2b48] transition-colors">Home</Link>
            <Link href="/#about" className="hover:text-[#0f2b48] transition-colors">About Me</Link>
            <Link href="/portfolio" className="hover:text-[#0f2b48] transition-colors">Portfolio</Link>
            <Link href="/#feedback" className="hover:text-[#0f2b48] transition-colors">Feedback</Link>
            <Link href="/faq" className="hover:text-[#0f2b48] transition-colors">FAQ</Link>
            <Link href="/#contact" className="hover:text-[#0f2b48] transition-colors">Contact</Link>
          </nav>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            id="footer-back-to-top"
            className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-widest text-neutral-500 hover:text-[#0f2b48] transition-colors focus:outline-none"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} Shazzad Hossain. All musical rights & scores reserved.</p>
          <p className="flex items-center space-x-1">
            <Music2 className="w-3 h-3 text-[#0f2b48]" />
            <span>Classic Portfolio • Master 3000 × 3000 PX Artwork</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
