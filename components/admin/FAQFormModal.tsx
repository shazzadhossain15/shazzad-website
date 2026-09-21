'use client';

import React, { useState } from 'react';
import { X, HelpCircle, Save } from 'lucide-react';
import { FAQItem } from '@/lib/faq-data';

interface FAQFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { question: string; answer: string }) => void;
  initialFAQ?: FAQItem | null;
}

function FAQFormModalContent({
  onClose,
  onSave,
  initialFAQ,
}: Omit<FAQFormModalProps, 'isOpen'>) {
  const isEditing = Boolean(initialFAQ);

  const [question, setQuestion] = useState(initialFAQ?.question || '');
  const [answer, setAnswer] = useState(initialFAQ?.answer || '');
  const [errors, setErrors] = useState<{ question?: string; answer?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { question?: string; answer?: string } = {};

    if (!question.trim()) {
      newErrors.question = 'Question cannot be empty';
    }
    if (!answer.trim()) {
      newErrors.answer = 'Answer cannot be empty';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      question: question.trim(),
      answer: answer.trim(),
    });
    onClose();
  };

  return (
    <div className="relative w-full max-w-xl bg-white border border-neutral-300 shadow-xl p-6 sm:p-7 animate-in zoom-in-95 duration-150 space-y-6">
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 bg-neutral-100 rounded-full flex items-center justify-center text-[#0f2b48]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2
              id="faq-form-title"
              className="font-serif-classic text-xl text-neutral-950 font-normal"
            >
              {isEditing ? 'Edit FAQ Item' : 'Add New FAQ Item'}
            </h2>
            <p className="text-xs text-neutral-500">
              {isEditing
                ? 'Update this question and answer on your public FAQ page.'
                : 'Create a new question and answer pair for your visitors.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Question Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="faq-question-input"
            className="block text-xs font-semibold uppercase tracking-wider text-neutral-700"
          >
            Question <span className="text-red-500">*</span>
          </label>
          <input
            id="faq-question-input"
            type="text"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (errors.question) setErrors((prev) => ({ ...prev, question: undefined }));
            }}
            placeholder="e.g. How long does a project typically take?"
            className={`w-full px-3.5 py-2.5 text-sm border bg-white text-neutral-900 focus:outline-none transition-colors ${
              errors.question
                ? 'border-red-500 focus:border-red-600'
                : 'border-neutral-300 focus:border-[#0f2b48]'
            }`}
          />
          {errors.question && (
            <p className="text-xs text-red-600 font-medium">{errors.question}</p>
          )}
        </div>

        {/* Answer Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="faq-answer-input"
            className="block text-xs font-semibold uppercase tracking-wider text-neutral-700"
          >
            Answer <span className="text-red-500">*</span>
          </label>
          <textarea
            id="faq-answer-input"
            rows={5}
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              if (errors.answer) setErrors((prev) => ({ ...prev, answer: undefined }));
            }}
            placeholder="Provide a clear, detailed answer explaining your process, turnaround, licensing, or services..."
            className={`w-full px-3.5 py-2.5 text-sm border bg-white text-neutral-900 focus:outline-none transition-colors leading-relaxed ${
              errors.answer
                ? 'border-red-500 focus:border-red-600'
                : 'border-neutral-300 focus:border-[#0f2b48]'
            }`}
          />
          {errors.answer && (
            <p className="text-xs text-red-600 font-medium">{errors.answer}</p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-neutral-100">
          <button
            type="button"
            onClick={onClose}
            id="cancel-faq-btn"
            className="px-4 py-2 border border-neutral-300 hover:bg-neutral-100 text-xs uppercase tracking-wider font-medium text-neutral-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="save-faq-btn"
            className="px-5 py-2 bg-[#0f2b48] hover:bg-[#163a5f] text-white text-xs uppercase tracking-wider font-semibold flex items-center space-x-2 transition-colors shadow-2xs"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Save Changes' : 'Add FAQ'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export function FAQFormModal({
  isOpen,
  onClose,
  onSave,
  initialFAQ,
}: FAQFormModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="faq-form-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <FAQFormModalContent
        key={initialFAQ ? initialFAQ.id : 'new-faq'}
        onClose={onClose}
        onSave={onSave}
        initialFAQ={initialFAQ}
      />
    </div>
  );
}
