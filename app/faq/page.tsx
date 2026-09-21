'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  Search,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';

export default function FAQPage() {
  const { faqList, isAdmin } = usePortfolio();
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Sort FAQs according to order
  const sortedFaqs = useMemo(() => {
    return [...faqList].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [faqList]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return sortedFaqs;
    const q = searchQuery.toLowerCase().trim();
    return sortedFaqs.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [sortedFaqs, searchQuery]);

  // Toggle single accordion
  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Expand all / Collapse all
  const allExpanded =
    filteredFaqs.length > 0 &&
    filteredFaqs.every((item) => openIds[item.id]);

  const toggleAll = () => {
    if (allExpanded) {
      setOpenIds({});
    } else {
      const nextOpen: Record<string, boolean> = {};
      filteredFaqs.forEach((item) => {
        nextOpen[item.id] = true;
      });
      setOpenIds(nextOpen);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-neutral-900 flex flex-col selection:bg-[#0f2b48] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 md:py-20">
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white border border-neutral-200 text-[#0f2b48] text-xs font-semibold uppercase tracking-[0.2em] shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Process & Policies</span>
          </div>

          <h1 className="font-serif-classic text-3xl sm:text-4xl md:text-5xl text-neutral-950 font-normal tracking-tight">
            Frequently Asked Questions
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 font-light">
            Answers to common questions about working with me.
          </p>

          {isAdmin && (
            <div className="pt-2">
              <Link
                href="/admin"
                id="admin-manage-faq-shortcut"
                className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium hover:bg-amber-100 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Manage FAQs in Admin Dashboard</span>
              </Link>
            </div>
          )}
        </div>

        {/* Toolbar: Search + Expand/Collapse All */}
        <div className="bg-white border border-neutral-200 p-4 sm:p-5 shadow-xs mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or keywords (e.g. delivery, pricing, stems)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-neutral-300 bg-white placeholder:text-neutral-400 focus:border-[#0f2b48] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-neutral-500">
            <span>
              {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'}
            </span>
            <button
              onClick={toggleAll}
              id="faq-toggle-all-btn"
              className="px-3 py-1.5 border border-neutral-200 hover:border-neutral-400 bg-neutral-50 hover:bg-white text-neutral-700 text-xs font-medium uppercase tracking-wider transition-colors shrink-0"
            >
              {allExpanded ? 'Collapse All' : 'Expand All'}
            </button>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5" id="faq-accordion-container">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white border border-neutral-200 p-12 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif-classic text-xl text-neutral-900 font-medium">
                No matching questions
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
                We couldn&apos;t find any questions matching &ldquo;{searchQuery}&rdquo;.
                Try a different keyword or reach out directly with your question.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 inline-flex items-center space-x-1.5 px-4 py-2 bg-[#0f2b48] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#163a5f] transition-colors"
              >
                <span>View All Questions</span>
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = Boolean(openIds[faq.id]);
              return (
                <div
                  key={faq.id}
                  id={`faq-item-${faq.id}`}
                  className={`border bg-white transition-colors duration-200 overflow-hidden shadow-2xs ${
                    isOpen ? 'border-[#0f2b48]' : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                    id={`faq-trigger-${faq.id}`}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none group"
                  >
                    <div className="flex items-start sm:items-center space-x-3.5 sm:space-x-4">
                      <span
                        className={`font-mono text-xs font-medium px-2 py-0.5 shrink-0 transition-colors ${
                          isOpen
                            ? 'bg-[#0f2b48] text-white'
                            : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200 group-hover:text-neutral-800'
                        }`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h2
                        className={`font-serif-classic text-base sm:text-lg transition-colors font-normal leading-snug ${
                          isOpen ? 'text-[#0f2b48] font-medium' : 'text-neutral-900 group-hover:text-neutral-950'
                        }`}
                      >
                        {faq.question}
                      </h2>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200 ${
                        isOpen
                          ? 'border-[#0f2b48] bg-[#0f2b48] text-white rotate-180'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-500 group-hover:border-neutral-400 group-hover:text-neutral-800'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-content-${faq.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 border-t border-neutral-100 bg-neutral-50/40">
                          <div className="pl-8 sm:pl-10 border-l-2 border-[#0f2b48]/40">
                            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-light">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Contact / Inquiries Banner */}
        <div className="mt-14 bg-white border border-neutral-200 p-8 sm:p-10 shadow-xs text-center space-y-4">
          <div className="w-10 h-10 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-[#0f2b48]">
            <Mail className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 max-w-lg mx-auto">
            <h3 className="font-serif-classic text-xl sm:text-2xl text-neutral-950 font-normal">
              Have a question not covered here?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              Every project is unique. Feel free to reach out directly with your specific questions, reference materials, or ideas.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/#contact"
              id="faq-contact-btn"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#0f2b48] hover:bg-[#163a5f] text-white text-xs uppercase tracking-widest font-semibold transition-colors shadow-2xs"
            >
              <span>Get In Touch</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white border border-neutral-300 hover:border-neutral-500 text-neutral-700 text-xs uppercase tracking-widest font-medium transition-colors"
            >
              <span>Explore Portfolio</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <AuthModal />
    </div>
  );
}
