'use client';

import React, { useState, useMemo } from 'react';
import {
  Mail,
  Search,
  Trash2,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Inbox,
  Send,
  ExternalLink,
  Copy,
  Check,
  Eye,
  EyeOff,
  Filter,
} from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { ContactSubmission, ContactSubmissionStatus } from '@/lib/contact-data';
import { DeleteContactModal } from './DeleteContactModal';

// Multicolor Gmail "M" Logo (Red, Blue, Green, Yellow)
function GmailIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Blue left fold */}
      <path
        d="M2.5 19.5h3.8V9.8L2.5 7v12.5z"
        fill="#4285F4"
      />
      {/* Green right fold */}
      <path
        d="M17.7 19.5h3.8V7l-3.8 2.8v9.7z"
        fill="#34A853"
      />
      {/* Yellow top-left fold */}
      <path
        d="M6.3 9.8l5.7 4.2 5.7-4.2V4.5l-5.7 4.2-5.7-4.2v5.3z"
        fill="#FBBC05"
      />
      {/* Red envelope chevron / roof */}
      <path
        d="M17.7 4.5l-5.7 4.2-5.7-4.2a2.5 2.5 0 0 0-3.8 2.1v0.4l5.7 4.2 3.8 2.8 3.8-2.8 5.7-4.2V6.6a2.5 2.5 0 0 0-3.8-2.1z"
        fill="#EA4335"
      />
      {/* Red bottom left shadow tab */}
      <path
        d="M2.5 6.6c0-.4.2-.8.5-1.1L6.3 7.8 2.5 9.8V6.6z"
        fill="#C5221F"
      />
    </svg>
  );
}

// Category tag styling with subtle, distinct background & border colors for quick visual scanning
export function getCategoryBadgeStyle(category: string): {
  containerClass: string;
  dotClass: string;
} {
  const norm = category.toLowerCase();

  // 1. Film / Documentary Score (BGM) -> Soft Blue
  if (norm.includes('film') || norm.includes('documentary') || norm.includes('bgm') || norm.includes('score')) {
    return {
      containerClass: 'bg-blue-50 text-blue-900 border-blue-200/90',
      dotClass: 'bg-blue-500',
    };
  }

  // 2. Vocal / Artist Collaboration -> Soft Purple / Lavender
  if (norm.includes('collab') || norm.includes('vocal') || norm.includes('artist') || norm.includes('feature')) {
    return {
      containerClass: 'bg-purple-50 text-purple-900 border-purple-200/90',
      dotClass: 'bg-purple-500',
    };
  }

  // 3. Full Music Production & Arrangement -> Soft Emerald / Sage
  if (norm.includes('production') || norm.includes('arrangement') || norm.includes('original') || norm.includes('beat')) {
    return {
      containerClass: 'bg-emerald-50 text-emerald-900 border-emerald-200/90',
      dotClass: 'bg-emerald-500',
    };
  }

  // 4. Audio Mixdown & Master -> Soft Amber / Warm Ochre
  if (norm.includes('mix') || norm.includes('master') || norm.includes('audio') || norm.includes('stem')) {
    return {
      containerClass: 'bg-amber-50 text-amber-900 border-amber-200/90',
      dotClass: 'bg-amber-500',
    };
  }

  // 5. General Conversation / Press & Fallbacks -> Soft Slate / Indigo
  return {
    containerClass: 'bg-slate-100 text-slate-800 border-slate-200/90',
    dotClass: 'bg-slate-400',
  };
}

interface ContactSubmissionsManagementProps {
  onNotify?: (msg: string) => void;
}

function formatSubmissionDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateStr;
  }
}

export function ContactSubmissionsManagement({
  onNotify,
}: ContactSubmissionsManagementProps) {
  const {
    contactSubmissions,
    unreadContactCount,
    markContactSubmissionAsRead,
    markContactSubmissionAsUnread,
    deleteContactSubmission,
  } = usePortfolio();

  const [statusFilter, setStatusFilter] = useState<'All' | 'Unread' | 'Read'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [deletingSubmission, setDeletingSubmission] = useState<ContactSubmission | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Newest submissions appear at top by default
  const sortedSubmissions = useMemo(() => {
    return [...contactSubmissions].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime() || 0;
      const timeB = new Date(b.createdAt).getTime() || 0;
      return timeB - timeA;
    });
  }, [contactSubmissions]);

  // Filtered list
  const filteredSubmissions = useMemo(() => {
    return sortedSubmissions.filter((item) => {
      const matchesStatus =
        statusFilter === 'All' || item.status === statusFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.projectType.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [sortedSubmissions, statusFilter, searchQuery]);

  // Metrics
  const totalCount = contactSubmissions.length;
  const readCount = totalCount - unreadContactCount;

  // Toggle expanding a submission and automatically mark as Read when opened
  const toggleExpand = (submission: ContactSubmission) => {
    const isCurrentlyExpanded = Boolean(expandedIds[submission.id]);
    const willExpand = !isCurrentlyExpanded;

    setExpandedIds((prev) => ({
      ...prev,
      [submission.id]: willExpand,
    }));

    // If opening an unread submission, automatically mark as read
    if (willExpand && submission.status === 'Unread') {
      markContactSubmissionAsRead(submission.id);
      onNotify?.(`Marked message from ${submission.name} as Read.`);
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    onNotify?.(`Copied ${email} to clipboard.`);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleToggleReadStatus = (submission: ContactSubmission, e: React.MouseEvent) => {
    e.stopPropagation();
    if (submission.status === 'Unread') {
      markContactSubmissionAsRead(submission.id);
      onNotify?.(`Marked message from ${submission.name} as Read.`);
    } else {
      markContactSubmissionAsUnread(submission.id);
      onNotify?.(`Marked message from ${submission.name} as Unread.`);
    }
  };

  const handleDeleteConfirm = (id: string) => {
    const sub = contactSubmissions.find((c) => c.id === id);
    deleteContactSubmission(id);
    onNotify?.(`Deleted contact submission from ${sub?.name || 'Visitor'}.`);
    setDeletingSubmission(null);
  };

  const handleMarkAllAsRead = () => {
    contactSubmissions
      .filter((c) => c.status === 'Unread')
      .forEach((c) => markContactSubmissionAsRead(c.id));
    onNotify?.('All contact submissions marked as Read.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-white border border-neutral-200 shadow-2xs">
          <span className="text-[11px] uppercase tracking-wider text-neutral-500 block font-medium">
            Total Submissions
          </span>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <span className="font-serif-classic text-2xl sm:text-3xl text-neutral-900 font-normal">
              {totalCount}
            </span>
            <span className="text-xs text-neutral-400">received inquiries</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-neutral-200 shadow-2xs">
          <span className="text-[11px] uppercase tracking-wider text-neutral-500 block font-medium">
            Unread Messages
          </span>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <span
              className={`font-serif-classic text-2xl sm:text-3xl font-normal ${
                unreadContactCount > 0 ? 'text-amber-600' : 'text-neutral-900'
              }`}
            >
              {unreadContactCount}
            </span>
            {unreadContactCount > 0 ? (
              <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                Requires Review
              </span>
            ) : (
              <span className="text-xs text-neutral-400">All caught up</span>
            )}
          </div>
        </div>

        <div className="p-4 bg-white border border-neutral-200 shadow-2xs">
          <span className="text-[11px] uppercase tracking-wider text-neutral-500 block font-medium">
            Read & Reviewed
          </span>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <span className="font-serif-classic text-2xl sm:text-3xl text-neutral-900 font-normal">
              {readCount}
            </span>
            <span className="text-xs text-neutral-400">archived inquiries</span>
          </div>
        </div>
      </div>

      {/* Management Toolbar */}
      <div className="bg-white border border-neutral-200 p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setStatusFilter('All')}
            id="filter-contact-all"
            className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold transition-colors flex items-center space-x-2 ${
              statusFilter === 'All'
                ? 'bg-[#0f2b48] text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <span>All</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                statusFilter === 'All'
                  ? 'bg-white/20 text-white'
                  : 'bg-neutral-200 text-neutral-700'
              }`}
            >
              {totalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('Unread')}
            id="filter-contact-unread"
            className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold transition-colors flex items-center space-x-2 ${
              statusFilter === 'Unread'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <span>Unread</span>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full transition-colors ${
                statusFilter === 'Unread'
                  ? 'bg-white text-rose-700 shadow-2xs'
                  : unreadContactCount > 0
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              {unreadContactCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('Read')}
            id="filter-contact-read"
            className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold transition-colors flex items-center space-x-2 ${
              statusFilter === 'Read'
                ? 'bg-[#0f2b48] text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <span>Read</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                statusFilter === 'Read'
                  ? 'bg-white/20 text-white'
                  : 'bg-neutral-200 text-neutral-700'
              }`}
            >
              {readCount}
            </span>
          </button>
        </div>

        {/* Search Bar & Batch Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              id="search-contact-submissions"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, email, project..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs border border-neutral-300 bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-[#0f2b48] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {unreadContactCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              id="mark-all-read-btn"
              className="inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-medium uppercase tracking-wider transition-colors shrink-0"
              title="Mark all pending messages as read"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Inbox List */}
      <div className="bg-white border border-neutral-200 shadow-2xs divide-y divide-neutral-200">
        {filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="font-serif-classic text-lg text-neutral-800">
              No Submissions Found
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
              {searchQuery || statusFilter !== 'All'
                ? 'No contact submissions match your active filter criteria.'
                : "You haven't received any messages yet. Messages sent via the website's Contact form will appear here in real time."}
            </p>
            {(searchQuery || statusFilter !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                }}
                className="mt-2 px-3 py-1.5 text-xs font-medium text-[#0f2b48] border border-[#0f2b48] hover:bg-[#0f2b48] hover:text-white transition-colors"
              >
                Reset Filter
              </button>
            )}
          </div>
        ) : (
          filteredSubmissions.map((submission) => {
            const isExpanded = Boolean(expandedIds[submission.id]);
            const isUnread = submission.status === 'Unread';
            const categoryStyle = getCategoryBadgeStyle(submission.projectType);

            const gmailComposeHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
              submission.email
            )}&su=${encodeURIComponent(
              `Re: ${submission.projectType} - Shazzad Hossain Studio`
            )}&body=${encodeURIComponent(
              `Hi ${submission.name},\n\nThank you for reaching out regarding "${submission.projectType}".\n\n---\nOriginal Inquiry:\n"${submission.message}"\n`
            )}`;

            return (
              <div
                key={submission.id}
                id={`contact-submission-${submission.id}`}
                className={`transition-colors ${
                  isUnread
                    ? 'bg-amber-50/30 hover:bg-amber-50/45'
                    : 'bg-white hover:bg-neutral-50/70'
                }`}
              >
                {/* Message Header Row (Clickable) */}
                <div
                  onClick={() => toggleExpand(submission)}
                  className="p-4 sm:p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3.5 select-none"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleExpand(submission);
                    }
                  }}
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start sm:items-center space-x-3.5 min-w-0 flex-1">
                    {/* Status Dot / Badge with generous spacing */}
                    <div className="pt-0.5 sm:pt-0 shrink-0">
                      {isUnread ? (
                        <span
                          className="inline-flex items-center px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-rose-100 text-rose-800 border border-rose-300 rounded-sm shadow-2xs"
                          title="Unread Message"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mr-1.5 animate-pulse"></span>
                          Unread
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center px-2.5 py-1 text-[10px] uppercase font-medium tracking-wider bg-neutral-100 text-neutral-600 border border-neutral-200 rounded-sm"
                          title="Read Message"
                        >
                          Read
                        </span>
                      )}
                    </div>

                    {/* Sender Name & Email */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                        <span
                          className={`text-sm ${
                            isUnread
                              ? 'font-semibold text-neutral-950 font-serif-classic'
                              : 'font-normal text-neutral-800 font-serif-classic'
                          }`}
                        >
                          {submission.name}
                        </span>
                        <span className="text-xs text-neutral-500 font-mono">
                          {submission.email}
                        </span>
                      </div>

                      {/* Project Type Category Tag & Preview Snippet with comfortable vertical spacing */}
                      <div className="flex flex-wrap items-center gap-2.5 mt-2">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold border ${categoryStyle.containerClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${categoryStyle.dotClass}`} />
                          <span>{submission.projectType}</span>
                        </span>

                        {!isExpanded && (
                          <p className="text-xs text-neutral-500 truncate max-w-lg hidden sm:block">
                            {submission.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right metadata & quick toggle */}
                  <div className="flex items-center justify-between md:justify-end space-x-3 shrink-0 pt-1 md:pt-0 border-t md:border-t-0 border-neutral-100">
                    <div className="flex items-center space-x-1.5 text-xs text-neutral-500">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{formatSubmissionDate(submission.createdAt)}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleToggleReadStatus(submission, e)}
                        title={isUnread ? 'Mark as Read' : 'Mark as Unread'}
                        className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
                        aria-label={isUnread ? 'Mark as Read' : 'Mark as Unread'}
                      >
                        {isUnread ? (
                          <Eye className="w-4 h-4 text-rose-600" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>

                      <div className="p-1.5 text-neutral-400">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#0f2b48]" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Message View - Spaced and Structured */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-4 border-t border-neutral-200/70 space-y-5 animate-in fade-in duration-150">
                    {/* Full Contact Header Details Card */}
                    <div className="p-4 bg-neutral-50/80 border border-neutral-200/90 flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-neutral-700">Sender:</span>
                          <span className="text-neutral-950 font-medium">{submission.name}</span>
                          <span className="text-neutral-300">•</span>
                          <span className="font-mono text-neutral-700">{submission.email}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyEmail(submission.email)}
                            className="p-1 text-neutral-400 hover:text-neutral-800 transition-colors inline-flex items-center"
                            title="Copy email address"
                          >
                            {copiedEmail === submission.email ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-neutral-600">
                          <span className="font-semibold text-neutral-700">Inquiry Category:</span>
                          <span
                            className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold border ${categoryStyle.containerClass}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${categoryStyle.dotClass}`} />
                            <span>{submission.projectType}</span>
                          </span>
                          <span className="text-neutral-300 hidden sm:inline">•</span>
                          <span className="text-neutral-500">
                            Received {formatSubmissionDate(submission.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Secondary Action: Distinct, Polished Toggle Button */}
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={(e) => handleToggleReadStatus(submission, e)}
                          id={`toggle-read-btn-${submission.id}`}
                          className={`inline-flex items-center space-x-1.5 px-3 py-2 text-xs uppercase tracking-wider font-semibold border transition-colors shadow-2xs ${
                            isUnread
                              ? 'border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800'
                              : 'border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950'
                          }`}
                        >
                          {isUnread ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Mark as Read</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-neutral-500" />
                              <span>Mark as Unread</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Message Body Content with generous top breathing room */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold block">
                          Message Content:
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          Direct inquiry via Contact Form
                        </span>
                      </div>
                      <div className="p-5 bg-white border-l-4 border-[#0f2b48] border-y border-r border-neutral-200 text-sm text-neutral-900 leading-relaxed whitespace-pre-wrap font-serif-classic shadow-2xs">
                        {submission.message}
                      </div>
                    </div>

                    {/* Action Buttons Bar with Multicolor Gmail Logo */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100">
                      {/* Left: Direct Gmail Web Compose Reply with Multicolor Gmail Logo */}
                      <a
                        href={gmailComposeHref}
                        id={`reply-email-${submission.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2.5 px-4 py-2.5 bg-[#0f2b48] hover:bg-[#163a5f] text-white text-xs uppercase tracking-wider font-semibold transition-colors shadow-2xs"
                      >
                        <GmailIcon className="w-4 h-4 shrink-0" />
                        <span>Reply via Gmail ({submission.email})</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                      </a>

                      {/* Right: Delete */}
                      <button
                        type="button"
                        onClick={() => setDeletingSubmission(submission)}
                        id={`delete-submission-btn-${submission.id}`}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 border border-red-200 bg-red-50/50 hover:bg-red-100 text-red-700 text-xs uppercase tracking-wider font-medium transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Submission</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteContactModal
        submission={deletingSubmission}
        isOpen={Boolean(deletingSubmission)}
        onClose={() => setDeletingSubmission(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
