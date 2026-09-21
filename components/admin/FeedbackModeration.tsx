'use client';

import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Star,
  Mail,
  User,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import NextLink from 'next/link';
import { usePortfolio } from '@/lib/portfolio-context';
import { FeedbackItem, FeedbackStatus } from '@/lib/feedback-data';
import { DeleteFeedbackModal } from './DeleteFeedbackModal';

interface FeedbackModerationProps {
  onNotify?: (msg: string) => void;
}

export function FeedbackModeration({ onNotify }: FeedbackModerationProps) {
  const { feedbackList, approveFeedback, rejectFeedback, deleteFeedback } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'All' | FeedbackStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingFeedback, setDeletingFeedback] = useState<FeedbackItem | null>(null);

  // Counts
  const totalCount = feedbackList.length;
  const pendingCount = feedbackList.filter((f) => f.status === 'Pending').length;
  const approvedCount = feedbackList.filter((f) => f.status === 'Approved').length;
  const rejectedCount = feedbackList.filter((f) => f.status === 'Rejected').length;

  // Filtered feedback list
  const filteredFeedback = useMemo(() => {
    return feedbackList.filter((item) => {
      const matchesTab = activeTab === 'All' || item.status === activeTab;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.userName.toLowerCase().includes(q) ||
        (item.userEmail && item.userEmail.toLowerCase().includes(q)) ||
        item.comment.toLowerCase().includes(q) ||
        item.userRole.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [feedbackList, activeTab, searchQuery]);

  // Actions
  const handleApprove = (item: FeedbackItem) => {
    approveFeedback(item.id);
    onNotify?.(`Approved feedback from "${item.userName}". It is now visible on the public site.`);
  };

  const handleReject = (item: FeedbackItem) => {
    rejectFeedback(item.id);
    onNotify?.(`Rejected feedback from "${item.userName}". It is now hidden from the public site.`);
  };

  const handleDeleteConfirm = (id: string) => {
    const item = feedbackList.find((f) => f.id === id);
    deleteFeedback(id);
    onNotify?.(`Permanently deleted feedback from "${item?.userName || 'User'}".`);
    setDeletingFeedback(null);
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setActiveTab('All')}
          className={`p-4 bg-white border cursor-pointer transition-all ${
            activeTab === 'All'
              ? 'border-[#0f2b48] ring-1 ring-[#0f2b48]'
              : 'border-neutral-200 hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">
              Total Feedback
            </span>
            <MessageSquare className="w-4 h-4 text-neutral-400" />
          </div>
          <span className="font-serif-classic text-2xl text-neutral-900 font-normal mt-1 block">
            {totalCount}
          </span>
        </div>

        <div
          onClick={() => setActiveTab('Pending')}
          className={`p-4 bg-white border cursor-pointer transition-all ${
            activeTab === 'Pending'
              ? 'border-amber-500 ring-1 ring-amber-500'
              : 'border-neutral-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-amber-700 font-medium">
              Pending Review
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="font-serif-classic text-2xl text-amber-900 font-normal">
              {pendingCount}
            </span>
            {pendingCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 font-medium uppercase tracking-wider">
                Needs Review
              </span>
            )}
          </div>
        </div>

        <div
          onClick={() => setActiveTab('Approved')}
          className={`p-4 bg-white border cursor-pointer transition-all ${
            activeTab === 'Approved'
              ? 'border-emerald-600 ring-1 ring-emerald-600'
              : 'border-neutral-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-emerald-700 font-medium">
              Approved (Live)
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-serif-classic text-2xl text-emerald-900 font-normal mt-1 block">
            {approvedCount}
          </span>
        </div>

        <div
          onClick={() => setActiveTab('Rejected')}
          className={`p-4 bg-white border cursor-pointer transition-all ${
            activeTab === 'Rejected'
              ? 'border-rose-500 ring-1 ring-rose-500'
              : 'border-neutral-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-rose-700 font-medium">
              Rejected (Archived)
            </span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <span className="font-serif-classic text-2xl text-rose-900 font-normal mt-1 block">
            {rejectedCount}
          </span>
        </div>
      </div>

      {/* Moderation Toolbar */}
      <div className="bg-white border border-neutral-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b md:border-b-0 pb-3 md:pb-0 border-neutral-100">
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => {
            const count =
              tab === 'All'
                ? totalCount
                : tab === 'Pending'
                ? pendingCount
                : tab === 'Approved'
                ? approvedCount
                : rejectedCount;

            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs tracking-wider uppercase font-medium flex items-center space-x-1.5 transition-colors ${
                  isActive
                    ? 'bg-[#0f2b48] text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : tab === 'Pending' && count > 0
                      ? 'bg-amber-200 text-amber-900 font-bold'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user, email, or comment..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-neutral-300 bg-white placeholder:text-neutral-400 focus:border-[#0f2b48] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Moderation List */}
      <div className="space-y-4">
        {filteredFeedback.length === 0 ? (
          <div className="bg-white border border-neutral-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-serif-classic text-xl text-neutral-900 font-medium">
              No feedback found
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              {searchQuery
                ? `No submissions matched your search query "${searchQuery}".`
                : activeTab === 'Pending'
                ? 'Great news! All submitted feedback has been reviewed. There is no pending feedback waiting for moderation.'
                : activeTab === 'Rejected'
                ? 'There are currently no rejected feedback entries in the archive.'
                : 'No feedback entries recorded yet.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs text-[#0f2b48] hover:underline font-medium"
              >
                Reset Search Filter
              </button>
            )}
          </div>
        ) : (
          filteredFeedback.map((item) => {
            const isPending = item.status === 'Pending';
            const isApproved = item.status === 'Approved';
            const isRejected = item.status === 'Rejected';

            return (
              <div
                key={item.id}
                id={`admin-feedback-card-${item.id}`}
                className={`bg-white border p-5 sm:p-6 transition-all shadow-2xs space-y-4 ${
                  isPending
                    ? 'border-amber-300 bg-amber-50/20'
                    : isApproved
                    ? 'border-neutral-200 hover:border-neutral-300'
                    : 'border-neutral-200 bg-neutral-50/60 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Header: User Info + Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 shrink-0 font-medium text-xs uppercase">
                      {item.userName.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm text-neutral-950">
                          {item.userName}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-sm">
                          {item.userRole}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-neutral-500">
                        {item.userEmail ? (
                          <span className="inline-flex items-center space-x-1 font-mono text-[11px] text-neutral-600">
                            <Mail className="w-3 h-3 text-neutral-400" />
                            <span>{item.userEmail}</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-neutral-400 italic">
                            No email recorded
                          </span>
                        )}
                        <span className="text-neutral-300">&bull;</span>
                        <span className="text-[11px] text-neutral-500">{item.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Tag */}
                  <div className="flex items-center space-x-2 self-start sm:self-center">
                    {isPending && (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium bg-amber-100 text-amber-900 border border-amber-300 rounded-sm">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span>Pending Approval</span>
                      </span>
                    )}
                    {isApproved && (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Approved & Public</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium bg-rose-100 text-rose-900 border border-rose-300 rounded-sm">
                        <XCircle className="w-3.5 h-3.5 text-rose-700" />
                        <span>Rejected (Hidden)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating & Review Content */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < item.rating
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-neutral-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-500 font-medium">
                      ({item.rating} of 5 stars)
                    </span>
                  </div>

                  <p className="font-serif-classic text-base text-neutral-800 leading-relaxed italic bg-neutral-50/70 p-4 border-l-2 border-[#0f2b48]">
                    &ldquo;{item.comment}&rdquo;
                  </p>
                </div>

                {/* Action Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100">
                  <div className="text-[11px] text-neutral-400">
                    {isPending && 'This review is not visible to public visitors.'}
                    {isApproved && 'This review is currently displayed live on the Feedback section.'}
                    {isRejected && 'This review is archived and hidden from public visitors.'}
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Approve button */}
                    {!isApproved && (
                      <button
                        type="button"
                        onClick={() => handleApprove(item)}
                        id={`approve-btn-${item.id}`}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium uppercase tracking-wider transition-colors shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isRejected ? 'Re-Approve' : 'Approve'}</span>
                      </button>
                    )}

                    {/* Reject button */}
                    {!isRejected && (
                      <button
                        type="button"
                        onClick={() => handleReject(item)}
                        id={`reject-btn-${item.id}`}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-neutral-300 hover:border-rose-400 hover:bg-rose-50 text-neutral-700 hover:text-rose-700 text-xs font-medium uppercase tracking-wider transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>{isApproved ? 'Revoke / Reject' : 'Reject'}</span>
                      </button>
                    )}

                    {/* Permanent Delete button */}
                    <button
                      type="button"
                      onClick={() => setDeletingFeedback(item)}
                      id={`delete-feedback-btn-${item.id}`}
                      className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 text-xs font-medium transition-colors"
                      title="Permanently delete feedback entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteFeedbackModal
        feedback={deletingFeedback}
        isOpen={Boolean(deletingFeedback)}
        onClose={() => setDeletingFeedback(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
