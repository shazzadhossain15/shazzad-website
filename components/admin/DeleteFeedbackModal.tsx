'use client';

import React from 'react';
import { AlertTriangle, X, Star } from 'lucide-react';
import { FeedbackItem } from '@/lib/feedback-data';

interface DeleteFeedbackModalProps {
  feedback: FeedbackItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (feedbackId: string) => void;
}

export function DeleteFeedbackModal({
  feedback,
  isOpen,
  onClose,
  onConfirm,
}: DeleteFeedbackModalProps) {
  if (!isOpen || !feedback) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-feedback-dialog-title"
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
            <h3 id="delete-feedback-dialog-title" className="text-lg font-medium text-neutral-950 font-serif-classic">
              Permanently Delete Feedback?
            </h3>
            <p className="text-xs text-neutral-500">
              This entry will be permanently removed from both the administration records and public site. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Feedback summary card */}
        <div className="p-3.5 bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-neutral-900">
              {feedback.userName}
            </span>
            <div className="flex items-center space-x-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < feedback.rating
                      ? 'fill-amber-400 text-amber-500'
                      : 'text-neutral-200'
                  }`}
                />
              ))}
            </div>
          </div>
          {feedback.userEmail && (
            <p className="text-neutral-500 font-mono text-[11px]">
              {feedback.userEmail}
            </p>
          )}
          <p className="text-neutral-700 italic line-clamp-3 pt-1 border-t border-neutral-200">
            &ldquo;{feedback.comment}&rdquo;
          </p>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            id="cancel-delete-feedback-btn"
            className="px-4 py-2 border border-neutral-300 text-xs uppercase tracking-wider font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(feedback.id);
              onClose();
            }}
            id="confirm-delete-feedback-btn"
            className="px-4 py-2 bg-red-600 text-white text-xs uppercase tracking-wider font-medium hover:bg-red-700 transition-colors"
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
