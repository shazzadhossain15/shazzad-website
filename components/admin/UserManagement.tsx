'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  Lock,
  Unlock,
  MessageSquare,
  Calendar,
  Mail,
  Star,
  X,
  AlertTriangle,
  UserCheck,
  UserX,
  Eye,
  Filter,
  Shield,
  Clock,
  MapPin,
  Compass,
} from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { RegisteredUser, UserAccountStatus } from '@/lib/user-data';
import { FeedbackItem } from '@/lib/feedback-data';

interface UserManagementProps {
  onNotify: (msg: string) => void;
}

export function UserManagement({ onNotify }: UserManagementProps) {
  const { registeredUsers, updateUserStatus, feedbackList, user: currentAdmin } = usePortfolio();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Suspended'>('All');

  // Modal states
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<RegisteredUser | null>(null);
  const [userToConfirmStatusChange, setUserToConfirmStatusChange] = useState<{
    user: RegisteredUser;
    nextStatus: UserAccountStatus;
  } | null>(null);

  // Map each user's email to their feedback items
  const userFeedbackMap = useMemo(() => {
    const map = new Map<string, FeedbackItem[]>();
    feedbackList.forEach((item) => {
      const email = item.userEmail?.toLowerCase().trim();
      const name = item.userName?.toLowerCase().trim();
      if (email) {
        const existing = map.get(email) || [];
        existing.push(item);
        map.set(email, existing);
      } else if (name) {
        const existing = map.get(name) || [];
        existing.push(item);
        map.set(name, existing);
      }
    });
    return map;
  }, [feedbackList]);

  // Helper to get feedback items for a specific user
  const getUserFeedback = (user: RegisteredUser): FeedbackItem[] => {
    const byEmail = userFeedbackMap.get(user.email.toLowerCase().trim()) || [];
    if (byEmail.length > 0) return byEmail;
    return userFeedbackMap.get(user.name.toLowerCase().trim()) || [];
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return registeredUsers.filter((user) => {
      const matchesStatus =
        statusFilter === 'All' || user.status === statusFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.role.toLowerCase().includes(q) ||
        (user.userType && user.userType.toLowerCase().includes(q)) ||
        (user.source && user.source.toLowerCase().includes(q)) ||
        (user.location && user.location.toLowerCase().includes(q));

      return matchesStatus && matchesQuery;
    });
  }, [registeredUsers, statusFilter, searchQuery]);

  // Summary counts
  const totalCount = registeredUsers.length;
  const activeCount = registeredUsers.filter((u) => u.status === 'Active').length;
  const suspendedCount = registeredUsers.filter((u) => u.status === 'Suspended').length;
  const totalSubmissions = feedbackList.length;

  const formatDate = (isoOrFormattedString: string) => {
    try {
      const date = new Date(isoOrFormattedString);
      if (isNaN(date.getTime())) {
        return isoOrFormattedString;
      }
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    } catch {
      return isoOrFormattedString;
    }
  };

  const handleExecuteStatusChange = () => {
    if (!userToConfirmStatusChange) return;
    const { user, nextStatus } = userToConfirmStatusChange;
    updateUserStatus(user.email, nextStatus);

    if (nextStatus === 'Suspended') {
      onNotify(`User "${user.name}" (${user.email}) has been suspended.`);
    } else {
      onNotify(`User "${user.name}" (${user.email}) has been reactivated.`);
    }

    // Also update detail modal if it's currently open
    if (selectedUserForDetail && selectedUserForDetail.id === user.id) {
      setSelectedUserForDetail({ ...selectedUserForDetail, status: nextStatus });
    }

    setUserToConfirmStatusChange(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Section Summary / Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white border border-neutral-200 shadow-2xs">
          <span className="text-[11px] uppercase tracking-wider text-neutral-500 block font-medium">
            Total Users
          </span>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <span className="font-serif-classic text-2xl sm:text-3xl text-neutral-900 font-normal">
              {totalCount}
            </span>
            <span className="text-xs text-neutral-400 font-mono">registered</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-neutral-200 shadow-2xs">
          <span className="text-[11px] uppercase tracking-wider text-emerald-700 block font-medium">
            Active Accounts
          </span>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <span className="font-serif-classic text-2xl sm:text-3xl text-emerald-700 font-normal">
              {activeCount}
            </span>
            <span className="text-xs text-emerald-600/70 font-mono">unrestricted</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-neutral-200 shadow-2xs">
          <span className="text-[11px] uppercase tracking-wider text-rose-700 block font-medium">
            Suspended
          </span>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <span className="font-serif-classic text-2xl sm:text-3xl text-rose-700 font-normal">
              {suspendedCount}
            </span>
            <span className="text-xs text-rose-600/70 font-mono">restricted</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-neutral-200 shadow-2xs">
          <span className="text-[11px] uppercase tracking-wider text-[#0f2b48] block font-medium">
            User Feedback
          </span>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <span className="font-serif-classic text-2xl sm:text-3xl text-[#0f2b48] font-normal">
              {totalSubmissions}
            </span>
            <span className="text-xs text-neutral-400 font-mono">reviews</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="border border-neutral-200 bg-white shadow-xs">
        {/* Header & Controls Bar */}
        <div className="p-5 sm:p-6 border-b border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-[#0f2b48]" />
              <h2 className="font-serif-classic text-xl sm:text-2xl text-neutral-900 font-normal">
                Registered Users Directory
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Browse registered listener and collaborator profiles, review their feedback history, and manage permissions.
            </p>
          </div>

          {/* Search and Status Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px] flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 bg-neutral-50/50 focus:bg-white focus:border-[#0f2b48] focus:outline-none placeholder:text-neutral-400"
                id="admin-user-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center border border-neutral-300 bg-neutral-100 p-0.5 rounded-none text-xs">
              {(['All', 'Active', 'Suspended'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  id={`admin-user-filter-${filter.toLowerCase()}`}
                  className={`px-3 py-1.5 font-medium transition-colors ${
                    statusFilter === filter
                      ? 'bg-white text-[#0f2b48] shadow-xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Directory List / Table */}
        {filteredUsers.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <Users className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <h3 className="font-serif-classic text-lg text-neutral-800">No users found</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No user records match "${searchQuery}". Try clearing the search query.`
                : 'No users in this category.'}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-4 px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-600 uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-5">User</th>
                    <th className="py-3.5 px-3">User Type</th>
                    <th className="py-3.5 px-3">How Found</th>
                    <th className="py-3.5 px-3">Location</th>
                    <th className="py-3.5 px-3">Joined Date</th>
                    <th className="py-3.5 px-3">Feedback</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredUsers.map((user) => {
                    const userFeedback = getUserFeedback(user);
                    const isOwner = user.email.toLowerCase().trim() === 'unishop72@gmail.com';
                    const isSuspended = user.status === 'Suspended';

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-neutral-50/70 transition-colors group"
                      >
                        {/* User column */}
                        <td className="py-4 px-5">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full bg-[#0f2b48]/10 text-[#0f2b48] border border-[#0f2b48]/20 flex items-center justify-center font-serif-classic text-sm font-bold shrink-0">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center space-x-1.5">
                                <span className="font-medium text-neutral-950">
                                  {user.name}
                                </span>
                                {isOwner && (
                                  <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-[#0f2b48] text-white rounded-xs">
                                    Owner
                                  </span>
                                )}
                              </div>
                              <span className="text-neutral-500 font-mono text-[11px] block mt-0.5">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* User Type */}
                        <td className="py-4 px-3 text-neutral-700">
                          <span className="inline-block px-2 py-0.5 bg-neutral-100 border border-neutral-200/80 text-[11px] text-neutral-800 font-medium">
                            {user.userType || user.role || 'Collaborator'}
                          </span>
                        </td>

                        {/* How Found */}
                        <td className="py-4 px-3 text-neutral-700">
                          {user.source ? (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-sky-50 text-sky-900 border border-sky-200/70 text-[11px]">
                              <Compass className="w-3 h-3 text-sky-600" />
                              <span>{user.source}</span>
                            </span>
                          ) : (
                            <span className="text-neutral-400 text-[11px]">—</span>
                          )}
                        </td>

                        {/* Location */}
                        <td className="py-4 px-3 text-neutral-700 whitespace-nowrap">
                          {user.location ? (
                            <div className="flex items-center space-x-1 text-[11px] text-neutral-700">
                              <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                              <span>{user.location}</span>
                            </div>
                          ) : (
                            <span className="text-neutral-400 text-[11px]">—</span>
                          )}
                        </td>

                        {/* Joined Date */}
                        <td className="py-4 px-3 text-neutral-600 whitespace-nowrap">
                          <div className="flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{formatDate(user.joinedAt)}</span>
                          </div>
                        </td>

                        {/* Feedback count */}
                        <td className="py-4 px-3">
                          <button
                            type="button"
                            onClick={() => setSelectedUserForDetail(user)}
                            className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-neutral-100 hover:bg-[#0f2b48]/10 hover:text-[#0f2b48] text-neutral-700 transition-colors border border-neutral-200"
                            title="View feedback history"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-[#0f2b48]" />
                            <span className="font-semibold">{userFeedback.length}</span>
                            <span className="text-[10px] text-neutral-500">
                              {userFeedback.length === 1 ? 'review' : 'reviews'}
                            </span>
                          </button>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-3">
                          {isSuspended ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                              <Lock className="w-3 h-3 text-rose-600" />
                              <span>Suspended</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Active</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => setSelectedUserForDetail(user)}
                              id={`admin-user-view-${user.id}`}
                              className="px-2.5 py-1 bg-white hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950 border border-neutral-300 font-medium transition-colors inline-flex items-center space-x-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Activity</span>
                            </button>

                            {!isOwner && (
                              <button
                                type="button"
                                onClick={() =>
                                  setUserToConfirmStatusChange({
                                    user,
                                    nextStatus: isSuspended ? 'Active' : 'Suspended',
                                  })
                                }
                                id={`admin-user-toggle-status-${user.id}`}
                                className={`px-2.5 py-1 text-[11px] font-medium transition-colors inline-flex items-center space-x-1 border ${
                                  isSuspended
                                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300'
                                }`}
                              >
                                {isSuspended ? (
                                  <>
                                    <Unlock className="w-3.5 h-3.5" />
                                    <span>Reactivate</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-3.5 h-3.5" />
                                    <span>Suspend</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card-Based List (< md) */}
            <div className="block md:hidden divide-y divide-neutral-200">
              {filteredUsers.map((user) => {
                const userFeedback = getUserFeedback(user);
                const isOwner = user.email.toLowerCase().trim() === 'unishop72@gmail.com';
                const isSuspended = user.status === 'Suspended';

                return (
                  <div key={user.id} className="p-4 space-y-3 hover:bg-neutral-50/50">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-[#0f2b48]/10 text-[#0f2b48] border border-[#0f2b48]/20 flex items-center justify-center font-serif-classic text-sm font-bold shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-medium text-neutral-950 text-sm">
                              {user.name}
                            </span>
                            {isOwner && (
                              <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-[#0f2b48] text-white rounded-xs">
                                Owner
                              </span>
                            )}
                          </div>
                          <span className="text-neutral-500 font-mono text-xs block">
                            {user.email}
                          </span>
                        </div>
                      </div>

                      {/* Status badge */}
                      {isSuspended ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-semibold bg-rose-50 text-rose-800 border border-rose-200 shrink-0">
                          <Lock className="w-2.5 h-2.5 text-rose-600" />
                          <span>Suspended</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Active</span>
                        </span>
                      )}
                    </div>

                    {/* Metadata strip (4 fields) */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-neutral-100 text-neutral-600">
                      <div>
                        <span className="text-[10px] uppercase text-neutral-400 block font-medium">User Type</span>
                        <span className="text-neutral-800 font-medium">{user.userType || user.role || 'Collaborator'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-neutral-400 block font-medium">How Found</span>
                        <span className="text-neutral-800">{user.source || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-neutral-400 block font-medium">Location</span>
                        <span className="text-neutral-800">{user.location || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-neutral-400 block font-medium">Joined</span>
                        <span>{formatDate(user.joinedAt)}</span>
                      </div>
                    </div>

                    {/* Feedback and Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedUserForDetail(user)}
                        className="inline-flex items-center space-x-1 text-xs text-[#0f2b48] font-medium"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{userFeedback.length} Feedback Submissions</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setSelectedUserForDetail(user)}
                          className="px-2.5 py-1.5 text-xs bg-white border border-neutral-300 text-neutral-700 font-medium"
                        >
                          Details
                        </button>
                        {!isOwner && (
                          <button
                            type="button"
                            onClick={() =>
                              setUserToConfirmStatusChange({
                                user,
                                nextStatus: isSuspended ? 'Active' : 'Suspended',
                              })
                            }
                            className={`px-2.5 py-1.5 text-xs font-medium border ${
                              isSuspended
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-rose-50 text-rose-800 border-rose-300'
                            }`}
                          >
                            {isSuspended ? 'Reactivate' : 'Suspend'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* USER DETAIL & ACTIVITY MODAL                                              */}
      {/* ========================================================================= */}
      {selectedUserForDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-neutral-200 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-neutral-200 flex items-start justify-between bg-neutral-50/70">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-full bg-[#0f2b48] text-white flex items-center justify-center font-serif-classic text-xl font-bold shrink-0">
                  {selectedUserForDetail.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-serif-classic text-xl sm:text-2xl text-neutral-900 font-normal">
                      {selectedUserForDetail.name}
                    </h3>
                    {selectedUserForDetail.status === 'Suspended' ? (
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                        Suspended
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5">
                    {selectedUserForDetail.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUserForDetail(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content / Activity */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Profile Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 p-4 bg-neutral-50 border border-neutral-200">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-neutral-500 block tracking-wider">
                    User Type
                  </span>
                  <span className="font-medium text-neutral-900 mt-0.5 block text-xs">
                    {selectedUserForDetail.userType || selectedUserForDetail.role || 'Collaborator / Listener'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-neutral-500 block tracking-wider">
                    How They Found Me
                  </span>
                  <span className="font-medium text-neutral-900 mt-0.5 block text-xs">
                    {selectedUserForDetail.source ? (
                      <span className="inline-flex items-center space-x-1 text-sky-800 font-medium">
                        <Compass className="w-3 h-3 text-sky-600 shrink-0" />
                        <span>{selectedUserForDetail.source}</span>
                      </span>
                    ) : (
                      <span className="text-neutral-400">— (Existing Record)</span>
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-neutral-500 block tracking-wider">
                    Country / Location
                  </span>
                  <span className="font-medium text-neutral-900 mt-0.5 block text-xs">
                    {selectedUserForDetail.location ? (
                      <span className="inline-flex items-center space-x-1 text-neutral-800">
                        <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                        <span>{selectedUserForDetail.location}</span>
                      </span>
                    ) : (
                      <span className="text-neutral-400">— (Not provided)</span>
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-neutral-500 block tracking-wider">
                    Sign-Up / Join Date
                  </span>
                  <span className="font-medium text-neutral-900 mt-0.5 block text-xs">
                    {formatDate(selectedUserForDetail.joinedAt)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-neutral-500 block tracking-wider">
                    Account Status
                  </span>
                  <span className="font-medium text-neutral-900 mt-0.5 block text-xs">
                    {selectedUserForDetail.status === 'Suspended' ? (
                      <span className="text-rose-700 font-semibold">Suspended</span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">Active</span>
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-neutral-500 block tracking-wider">
                    Total Submissions
                  </span>
                  <span className="font-medium text-neutral-900 mt-0.5 block text-xs">
                    {getUserFeedback(selectedUserForDetail).length} Feedback Submissions
                  </span>
                </div>
              </div>

              {/* Feedback History Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-[#0f2b48]" />
                    <h4 className="font-serif-classic text-base text-neutral-900 font-medium">
                      Feedback History & Activity
                    </h4>
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    {getUserFeedback(selectedUserForDetail).length} total
                  </span>
                </div>

                {getUserFeedback(selectedUserForDetail).length === 0 ? (
                  <div className="p-8 text-center bg-neutral-50 border border-dashed border-neutral-200">
                    <MessageSquare className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                    <p className="text-neutral-600 font-medium">No feedback comments submitted</p>
                    <p className="text-neutral-400 text-[11px] mt-0.5">
                      This user has not yet left any feedback or testimonial reviews.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getUserFeedback(selectedUserForDetail).map((fb) => (
                      <div
                        key={fb.id}
                        className="p-4 bg-white border border-neutral-200 space-y-2.5 hover:border-neutral-300 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  fb.rating >= star
                                    ? 'fill-amber-400 text-amber-500'
                                    : 'text-neutral-300'
                                }`}
                              />
                            ))}
                            <span className="text-neutral-500 text-[11px] ml-1.5 font-mono">
                              ({fb.rating}/5)
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-neutral-400 text-[11px]">{fb.date}</span>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-xs ${
                                fb.status === 'Approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : fb.status === 'Pending'
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-neutral-100 text-neutral-600'
                              }`}
                            >
                              {fb.status}
                            </span>
                          </div>
                        </div>

                        <p className="text-neutral-700 leading-relaxed font-serif-classic text-[13px] bg-neutral-50/70 p-3 border-l-2 border-[#0f2b48]">
                          &ldquo;{fb.comment}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50/70 flex items-center justify-between gap-3">
              <div>
                {selectedUserForDetail.email.toLowerCase().trim() !== 'unishop72@gmail.com' && (
                  <button
                    type="button"
                    onClick={() => {
                      const nextStatus: UserAccountStatus =
                        selectedUserForDetail.status === 'Suspended' ? 'Active' : 'Suspended';
                      setUserToConfirmStatusChange({
                        user: selectedUserForDetail,
                        nextStatus,
                      });
                    }}
                    className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center space-x-1.5 border ${
                      selectedUserForDetail.status === 'Suspended'
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
                        : 'bg-rose-600 hover:bg-rose-700 text-white border-rose-700'
                    }`}
                  >
                    {selectedUserForDetail.status === 'Suspended' ? (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Reactivate Account</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Suspend Account</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedUserForDetail(null)}
                className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUSPEND / REACTIVATE CONFIRMATION MODAL                                  */}
      {/* ========================================================================= */}
      {userToConfirmStatusChange && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-neutral-200 max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start space-x-3.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  userToConfirmStatusChange.nextStatus === 'Suspended'
                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}
              >
                {userToConfirmStatusChange.nextStatus === 'Suspended' ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <UserCheck className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="font-serif-classic text-xl text-neutral-950 font-normal">
                  {userToConfirmStatusChange.nextStatus === 'Suspended'
                    ? 'Confirm Account Suspension'
                    : 'Confirm Account Reactivation'}
                </h3>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  {userToConfirmStatusChange.nextStatus === 'Suspended' ? (
                    <>
                      Are you sure you want to suspend{' '}
                      <strong className="text-neutral-900">
                        {userToConfirmStatusChange.user.name}
                      </strong>{' '}
                      (<span className="font-mono">{userToConfirmStatusChange.user.email}</span>)?
                      Suspended users are blocked from submitting feedback comments, while retaining normal browsing access.
                    </>
                  ) : (
                    <>
                      Are you sure you want to restore active status for{' '}
                      <strong className="text-neutral-900">
                        {userToConfirmStatusChange.user.name}
                      </strong>{' '}
                      (<span className="font-mono">{userToConfirmStatusChange.user.email}</span>)?
                      This user will be able to submit feedback comments again.
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setUserToConfirmStatusChange(null)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteStatusChange}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors ${
                  userToConfirmStatusChange.nextStatus === 'Suspended'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {userToConfirmStatusChange.nextStatus === 'Suspended'
                  ? 'Confirm Suspension'
                  : 'Confirm Reactivation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
