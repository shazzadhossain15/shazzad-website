'use client';

import React from 'react';
import Image from 'next/image';
import { AlertTriangle, X } from 'lucide-react';
import { PortfolioProject } from '@/lib/portfolio-data';

interface DeleteConfirmModalProps {
  project: PortfolioProject | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (projectId: string) => void;
}

export function DeleteConfirmModal({
  project,
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!isOpen || !project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
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
            <h3 id="delete-dialog-title" className="text-lg font-medium text-neutral-950 font-serif-classic">
              Delete Project Repertoire Entry?
            </h3>
            <p className="text-xs text-neutral-500">
              This action will permanently delete this song and its detail page. This cannot be undone.
            </p>
          </div>
        </div>

        {/* Project summary card */}
        <div className="flex items-center space-x-3.5 p-3 bg-neutral-50 border border-neutral-200">
          <div className="relative w-12 h-12 bg-neutral-200 overflow-hidden shrink-0">
            <Image
              src={project.coverUrl}
              alt={project.title}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-medium text-neutral-900 truncate">
              {project.title}
            </h4>
            <p className="text-xs text-neutral-500">
              {project.category} &bull; {project.year}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            id="cancel-delete-btn"
            className="px-4 py-2 border border-neutral-300 text-xs uppercase tracking-wider font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(project.id);
              onClose();
            }}
            id="confirm-delete-btn"
            className="px-4 py-2 bg-red-600 text-white text-xs uppercase tracking-wider font-medium hover:bg-red-700 transition-colors"
          >
            Delete Project
          </button>
        </div>
      </div>
    </div>
  );
}
