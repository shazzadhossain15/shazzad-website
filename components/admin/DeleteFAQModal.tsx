'use client';

import React from 'react';
import { AlertTriangle, X, HelpCircle } from 'lucide-react';
import { FAQItem } from '@/lib/faq-data';

interface DeleteFAQModalProps {
  faq: FAQItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export function DeleteFAQModal({
  faq,
  isOpen,
  onClose,
  onConfirm,
}: DeleteFAQModalProps) {
  if (!isOpen || !faq) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-faq-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-md bg-white border border-neutral-300 shadow-xl p-6 sm:p-7 animate-in zoom-in-95 duration-150 space-y-5">
        <button
          onClick={onClose}
          aria-label="Cancel deletion"
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3
              id="delete-faq-dialog-title"
              className="text-lg font-medium text-neutral-950 font-serif-classic"
            >
              Permanently Delete FAQ?
            </h3>
            <p className="text-xs text-neutral-500">
              This question will be removed from your website and the FAQ page immediately. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* FAQ Preview Card */}
        <div className="p-3.5 bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
          <div className="flex items-start space-x-2">
            <HelpCircle className="w-4 h-4 text-[#0f2b48] shrink-0 mt-0.5" />
            <span className="font-semibold text-neutral-900 leading-snug">
              {faq.question}
            </span>
          </div>
          <p className="text-neutral-600 line-clamp-3 pl-6 italic">
            &ldquo;{faq.answer}&rdquo;
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            id="cancel-delete-faq-btn"
            className="px-4 py-2 border border-neutral-300 hover:bg-neutral-100 text-xs uppercase tracking-wider font-medium text-neutral-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(faq.id)}
            id="confirm-delete-faq-btn"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-wider font-semibold transition-colors shadow-2xs"
          >
            Delete FAQ
          </button>
        </div>
      </div>
    </div>
  );
}
