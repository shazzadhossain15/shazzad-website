'use client';

import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Plus,
  Search,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';
import NextLink from 'next/link';
import { usePortfolio } from '@/lib/portfolio-context';
import { FAQItem } from '@/lib/faq-data';
import { FAQFormModal } from './FAQFormModal';
import { DeleteFAQModal } from './DeleteFAQModal';

interface FAQManagementProps {
  onNotify?: (msg: string) => void;
}

export function FAQManagement({ onNotify }: FAQManagementProps) {
  const {
    faqList,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    reorderFAQ,
    resetFAQToDefault,
  } = usePortfolio();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null);
  const [deletingFAQ, setDeletingFAQ] = useState<FAQItem | null>(null);

  // Sort by order ascending
  const sortedFaqs = useMemo(() => {
    return [...faqList].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [faqList]);

  // Filtered FAQs based on search
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return sortedFaqs;
    const q = searchQuery.toLowerCase().trim();
    return sortedFaqs.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [sortedFaqs, searchQuery]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingFAQ(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: FAQItem) => {
    setEditingFAQ(item);
    setIsFormOpen(true);
  };

  const handleSaveFAQ = (data: { question: string; answer: string }) => {
    if (editingFAQ) {
      updateFAQ(editingFAQ.id, data);
      onNotify?.(`Updated question: "${data.question.slice(0, 45)}..."`);
    } else {
      addFAQ(data);
      onNotify?.(`Added new question: "${data.question.slice(0, 45)}..."`);
    }
  };

  const handleDeleteConfirm = (id: string) => {
    const item = faqList.find((f) => f.id === id);
    deleteFAQ(id);
    setDeletingFAQ(null);
    onNotify?.(`Deleted FAQ question "${item?.question.slice(0, 40) || 'Item'}".`);
  };

  const handleMoveUp = (item: FAQItem, index: number) => {
    if (index === 0) return;
    reorderFAQ(item.id, 'up');
    onNotify?.(`Moved "${item.question.slice(0, 35)}..." up.`);
  };

  const handleMoveDown = (item: FAQItem, index: number) => {
    if (index === sortedFaqs.length - 1) return;
    reorderFAQ(item.id, 'down');
    onNotify?.(`Moved "${item.question.slice(0, 35)}..." down.`);
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all FAQs to the default 10 questions and answers? Any custom additions or edits will be restored to defaults.'
      )
    ) {
      resetFAQToDefault();
      onNotify?.('Reset FAQs to default 10 initial questions.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Metric & Info Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-white border border-neutral-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">
              Total FAQs
            </span>
            <HelpCircle className="w-4 h-4 text-neutral-400" />
          </div>
          <span className="font-serif-classic text-2xl text-neutral-900 font-normal mt-1 block">
            {faqList.length}
          </span>
        </div>

        <div className="p-4 bg-white border border-neutral-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">
              Display Mode
            </span>
            <ArrowUpDown className="w-4 h-4 text-neutral-400" />
          </div>
          <span className="text-sm font-medium text-neutral-900 mt-2 block">
            Custom Ordered
          </span>
        </div>

        <div className="p-4 bg-white border border-neutral-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">
              Public Page
            </span>
            <ExternalLink className="w-4 h-4 text-neutral-400" />
          </div>
          <NextLink
            href="/faq"
            target="_blank"
            id="admin-view-live-faq-link"
            className="text-xs text-[#0f2b48] hover:underline font-medium inline-flex items-center space-x-1 mt-2"
          >
            <span>Preview live /faq accordion</span>
            <ExternalLink className="w-3 h-3" />
          </NextLink>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="bg-white border border-neutral-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs by question or answer keywords..."
            className="w-full pl-8 pr-3 py-2 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
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

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleResetDefaults}
            id="admin-reset-faq-btn"
            className="px-3 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-600 text-xs font-medium uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
            title="Reset to default 10 FAQ items"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={handleOpenAdd}
            id="admin-add-faq-btn"
            className="px-4 py-2 bg-[#0f2b48] hover:bg-[#163a5f] text-white text-xs uppercase tracking-widest font-semibold flex items-center space-x-2 transition-colors shrink-0 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New FAQ</span>
          </button>
        </div>
      </div>

      {/* FAQ Item List */}
      <div className="bg-white border border-neutral-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <h2 className="font-serif-classic text-lg text-neutral-950 font-normal">
            FAQ Items ({filteredFaqs.length})
          </h2>
          <span className="text-xs text-neutral-500">
            Use arrows to arrange display order on the public page
          </span>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif-classic text-xl text-neutral-900 font-medium">
              No FAQ items found
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              {searchQuery
                ? `No questions matched your search query "${searchQuery}".`
                : 'There are currently no FAQs in your portfolio. Click "Add New FAQ" to create your first question.'}
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#0f2b48] hover:underline font-medium"
              >
                Reset Search Filter
              </button>
            ) : (
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#0f2b48] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#163a5f] transition-colors mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Question</span>
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {filteredFaqs.map((faq, index) => {
              const originalIndex = sortedFaqs.findIndex((f) => f.id === faq.id);
              const isFirst = originalIndex === 0;
              const isLast = originalIndex === sortedFaqs.length - 1;

              return (
                <div
                  key={faq.id}
                  id={`admin-faq-row-${faq.id}`}
                  className="p-5 sm:p-6 hover:bg-neutral-50/60 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="flex items-start space-x-3.5 flex-1">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col items-center shrink-0 border border-neutral-200 bg-white rounded-xs">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(faq, originalIndex)}
                        disabled={isFirst || Boolean(searchQuery)}
                        title={
                          searchQuery
                            ? 'Clear search to reorder items'
                            : isFirst
                            ? 'Already at the top'
                            : 'Move up'
                        }
                        id={`faq-move-up-${faq.id}`}
                        className="p-1 text-neutral-500 hover:text-[#0f2b48] hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <span className="font-mono text-[10px] font-bold text-neutral-600 px-1.5 py-0.5 border-y border-neutral-100 bg-neutral-50">
                        {String(faq.order || originalIndex + 1).padStart(2, '0')}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(faq, originalIndex)}
                        disabled={isLast || Boolean(searchQuery)}
                        title={
                          searchQuery
                            ? 'Clear search to reorder items'
                            : isLast
                            ? 'Already at the bottom'
                            : 'Move down'
                        }
                        id={`faq-move-down-${faq.id}`}
                        className="p-1 text-neutral-500 hover:text-[#0f2b48] hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Question & Answer Details */}
                    <div className="space-y-2 flex-1">
                      <h3 className="font-serif-classic text-base sm:text-lg text-neutral-950 font-normal leading-snug">
                        {faq.question}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light pl-3 border-l-2 border-[#0f2b48]/30">
                        {faq.answer}
                      </p>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center space-x-2 self-end md:self-start shrink-0 pt-2 md:pt-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(faq)}
                      id={`edit-faq-btn-${faq.id}`}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-neutral-300 hover:border-neutral-500 text-xs font-medium text-neutral-700 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingFAQ(faq)}
                      id={`delete-faq-btn-${faq.id}`}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-transparent hover:border-red-200 text-neutral-400 hover:text-red-700 hover:bg-red-50 text-xs font-medium transition-colors"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit FAQ Modal */}
      <FAQFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveFAQ}
        initialFAQ={editingFAQ}
      />

      {/* Delete Confirmation Modal */}
      <DeleteFAQModal
        faq={deletingFAQ}
        isOpen={Boolean(deletingFAQ)}
        onClose={() => setDeletingFAQ(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
