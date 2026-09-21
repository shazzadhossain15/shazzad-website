'use client';

import React, { useState, useMemo } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Video,
  Music,
  CheckCircle2,
  Disc,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  LogOut,
  RotateCcw,
  Sparkles,
  MessageSquare,
  HelpCircle,
  Mail,
  ChevronDown,
  LayoutTemplate,
  Users,
} from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { PortfolioProject } from '@/lib/portfolio-data';
import { AdminAccessDenied } from '@/components/admin/AdminAccessDenied';
import { ProjectFormModal } from '@/components/admin/ProjectFormModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { FeedbackModeration } from '@/components/admin/FeedbackModeration';
import { FAQManagement } from '@/components/admin/FAQManagement';
import { ContactSubmissionsManagement } from '@/components/admin/ContactSubmissionsManagement';
import { HomePageEditor } from '@/components/admin/HomePageEditor';
import { UserManagement } from '@/components/admin/UserManagement';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';

type AdminCategory = 'website' | 'feedback-faq' | 'contacts' | 'users' | null;
type WebsiteSubTab = 'home' | 'projects';
type FeedbackFaqSubTab = 'feedback' | 'faq';

function AdminDashboardContent() {
  const {
    user,
    isAdmin,
    logout,
    projects,
    addProject,
    updateProject,
    deleteProject,
    resetProjectsToDefault,
    feedbackList,
    faqList,
    contactSubmissions,
    unreadContactCount,
    registeredUsers,
  } = usePortfolio();

  // Two-Level Navigation State
  // Level 1: activeCategory === null (4-Card Landing Grid)
  // Level 2: activeCategory === 'website' | 'feedback-faq' | 'contacts' | 'users'
  const [activeCategory, setActiveCategory] = useState<AdminCategory>(null);
  const [websiteSubTab, setWebsiteSubTab] = useState<WebsiteSubTab>('home');
  const [feedbackFaqSubTab, setFeedbackFaqSubTab] = useState<FeedbackFaqSubTab>('feedback');

  // Search & Filter State for Projects
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [deletingProject, setDeletingProject] = useState<PortfolioProject | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Pending feedback count for badge
  const pendingFeedbackCount = useMemo(() => {
    return feedbackList.filter((f) => f.status === 'Pending').length;
  }, [feedbackList]);

  // Filtered project list
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' || project.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.collaborators.some((c) => c.toLowerCase().includes(query)) ||
        project.role.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  // Metric counts
  const filmCount = projects.filter((p) => p.category === 'Film & BGM').length;
  const collabCount = projects.filter((p) => p.category === 'Collaboration').length;
  const originalCount = projects.filter((p) => p.category === 'Original Works').length;

  // Handlers
  const handleOpenAdd = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (project: PortfolioProject) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleSaveProject = (projectData: Partial<PortfolioProject>) => {
    if (editingProject) {
      updateProject(editingProject.id, projectData);
      showToast(`Updated "${projectData.title || editingProject.title}" successfully.`);
    } else {
      const created = addProject(projectData as Omit<PortfolioProject, 'id'>);
      showToast(`Added "${created.title}" to Music Portfolio.`);
    }
  };

  const handleDeleteConfirm = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    deleteProject(projectId);
    showToast(`Deleted "${project?.title || 'Project'}" from repertoire.`);
    setDeletingProject(null);
  };

  // If not admin, deny access immediately
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
        <Navbar />
        <AdminAccessDenied />
        <Footer />
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/70 text-neutral-900 flex flex-col justify-between selection:bg-[#0f2b48] selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Admin Dashboard Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10 space-y-8">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-medium flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-700 hover:text-emerald-950 text-xs underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Admin Header Strip */}
        <div className="bg-white border border-neutral-200 p-6 sm:p-7 shadow-xs space-y-4">
          {/* Back to Dashboard Breadcrumb (Visible on Level 2) */}
          {activeCategory !== null && (
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                id="admin-back-to-dashboard-btn"
                className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#0f2b48] hover:text-[#163a5f] bg-neutral-100 hover:bg-neutral-200/80 px-3 py-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                <span>Back to Dashboard</span>
              </button>

              <div className="flex items-center space-x-1.5 text-xs text-neutral-400 font-medium">
                <button
                  type="button"
                  onClick={() => setActiveCategory(null)}
                  className="hover:text-neutral-700 cursor-pointer"
                >
                  Dashboard
                </button>
                <ChevronRight className="w-3 h-3 text-neutral-400" />
                <span className="text-neutral-700 font-semibold">
                  {activeCategory === 'website'
                    ? 'Website Management'
                    : activeCategory === 'feedback-faq'
                    ? 'Feedback & FAQ'
                    : activeCategory === 'contacts'
                    ? 'Contact Submissions'
                    : 'User Management'}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f2b48]">
                <ShieldCheck className="w-4 h-4 text-[#0f2b48]" />
                <span>Site Owner Control Room</span>
              </div>
              <h1 className="font-serif-classic text-2xl sm:text-3xl text-neutral-950 font-normal mt-1">
                {activeCategory === null
                  ? 'Admin Dashboard'
                  : activeCategory === 'website'
                  ? websiteSubTab === 'home'
                    ? 'Home Page Editor'
                    : 'Song & Project Management'
                  : activeCategory === 'feedback-faq'
                  ? feedbackFaqSubTab === 'feedback'
                    ? 'Feedback Moderation'
                    : 'FAQ Management'
                  : activeCategory === 'contacts'
                  ? 'Contact Submissions'
                  : 'User Management'}
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                {activeCategory === null
                  ? 'Select a management category below to oversee website content, audience interactions, client inquiries, and registered users.'
                  : activeCategory === 'website'
                  ? websiteSubTab === 'home'
                    ? 'Customize and update the Hero banner, About Me biography, and Contact details in real-time.'
                    : 'Add, modify, and curate your repertoire projects without editing source code.'
                  : activeCategory === 'feedback-faq'
                  ? feedbackFaqSubTab === 'feedback'
                    ? 'Review, approve, or reject user-submitted feedback before it appears on the public site.'
                    : 'Add, edit, reorder, and curate questions and answers displayed on the public FAQ page.'
                  : activeCategory === 'contacts'
                  ? 'Review, filter, and reply to project proposals and messages received through the Contact form.'
                  : 'View and manage registered listener and collaborator profiles, account statuses, and feedback history.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs px-2.5 py-1 bg-neutral-100 text-neutral-800 border border-neutral-300 font-mono">
                {user?.email || 'Authorized Owner'}
              </span>
              <NextLink
                href="/portfolio"
                id="admin-view-portfolio-btn"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-neutral-300 hover:border-neutral-500 text-xs font-medium text-neutral-700 transition-colors"
              >
                <span>Live Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </NextLink>
              <button
                onClick={logout}
                id="admin-logout-btn"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-red-200 bg-red-50/50 hover:bg-red-100 text-xs font-medium text-red-700 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Metric Counter Strip for Projects (Shown when on Projects sub-tab) */}
          {activeCategory === 'website' && websiteSubTab === 'projects' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3.5 bg-neutral-50 border border-neutral-200">
                <span className="text-[11px] uppercase tracking-wider text-neutral-500 block font-medium">
                  Total Repertoire
                </span>
                <span className="font-serif-classic text-2xl text-neutral-900 font-normal">
                  {projects.length}
                </span>
              </div>
              <div className="p-3.5 bg-neutral-50 border border-neutral-200">
                <span className="text-[11px] uppercase tracking-wider text-neutral-500 block font-medium">
                  Film & BGM
                </span>
                <span className="font-serif-classic text-2xl text-neutral-900 font-normal">
                  {filmCount}
                </span>
              </div>
              <div className="p-3.5 bg-neutral-50 border border-neutral-200">
                <span className="text-[11px] uppercase tracking-wider text-neutral-500 block font-medium">
                  Collaboration
                </span>
                <span className="font-serif-classic text-2xl text-neutral-900 font-normal">
                  {collabCount}
                </span>
              </div>
              <div className="p-3.5 bg-neutral-50 border border-neutral-200">
                <span className="text-[11px] uppercase tracking-wider text-neutral-500 block font-medium">
                  Original Works
                </span>
                <span className="font-serif-classic text-2xl text-neutral-900 font-normal">
                  {originalCount}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* LEVEL 1: MAIN DASHBOARD LANDING PAGE (3 Large Square/Card Buttons Grid)   */}
        {/* ========================================================================= */}
        {activeCategory === null && (
          <div className="space-y-8">
            {/* 4 Main Category Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Website Management */}
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('website');
                  setWebsiteSubTab('home');
                }}
                id="admin-card-website-management"
                className="group relative flex flex-col justify-between p-6 sm:p-7 bg-white border border-neutral-200 hover:border-[#0f2b48] text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#0f2b48]/20 min-h-[320px] overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#0f2b48] transition-colors" />

                <div>
                  <div className="w-12 h-12 bg-neutral-100 group-hover:bg-[#0f2b48] text-neutral-800 group-hover:text-white border border-neutral-200 flex items-center justify-center transition-colors">
                    <LayoutTemplate className="w-6 h-6" />
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-serif-classic text-xl text-neutral-950 font-normal group-hover:text-[#0f2b48] transition-colors">
                        Website Management
                      </h2>
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-amber-100 text-amber-900 rounded-full shrink-0">
                        2 Sections
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                      Edit homepage content and manage portfolio projects
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-100 space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-neutral-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0f2b48]"></span>
                      <span>Home Page Editor (Hero, About, Contact)</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-neutral-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0f2b48]"></span>
                      <span>Songs & Projects ({projects.length} works)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#0f2b48]">
                  <span>Open Website Management</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </button>

              {/* Card 2: Feedback & FAQ */}
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('feedback-faq');
                  setFeedbackFaqSubTab('feedback');
                }}
                id="admin-card-feedback-faq"
                className="group relative flex flex-col justify-between p-6 sm:p-7 bg-white border border-neutral-200 hover:border-[#0f2b48] text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#0f2b48]/20 min-h-[320px] overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#0f2b48] transition-colors" />

                <div>
                  <div className="w-12 h-12 bg-neutral-100 group-hover:bg-[#0f2b48] text-neutral-800 group-hover:text-white border border-neutral-200 flex items-center justify-center transition-colors">
                    <MessageSquare className="w-6 h-6" />
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-serif-classic text-xl text-neutral-950 font-normal group-hover:text-[#0f2b48] transition-colors">
                        Feedback & FAQ
                      </h2>
                      {pendingFeedbackCount > 0 ? (
                        <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-amber-500 text-white rounded-full shrink-0">
                          {pendingFeedbackCount} Pending
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-neutral-100 text-neutral-700 rounded-full shrink-0">
                          2 Sections
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                      Moderate visitor feedback and manage FAQ content
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-100 space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-neutral-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0f2b48]"></span>
                      <span>Feedback Moderation ({feedbackList.length} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-neutral-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0f2b48]"></span>
                      <span>Manage FAQ ({faqList.length} questions)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#0f2b48]">
                  <span>Manage Feedback & FAQ</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </button>

              {/* Card 3: Contact Submissions */}
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('contacts');
                }}
                id="admin-card-contact-submissions"
                className="group relative flex flex-col justify-between p-6 sm:p-7 bg-white border border-neutral-200 hover:border-[#0f2b48] text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#0f2b48]/20 min-h-[320px] overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#0f2b48] transition-colors" />

                <div>
                  <div className="w-12 h-12 bg-neutral-100 group-hover:bg-[#0f2b48] text-neutral-800 group-hover:text-white border border-neutral-200 flex items-center justify-center transition-colors">
                    <Mail className="w-6 h-6" />
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-serif-classic text-xl text-neutral-950 font-normal group-hover:text-[#0f2b48] transition-colors">
                        Contact Submissions
                      </h2>
                      {unreadContactCount > 0 ? (
                        <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider bg-rose-600 text-white rounded-full animate-pulse shrink-0">
                          {unreadContactCount} Unread
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-neutral-100 text-neutral-700 rounded-full shrink-0">
                          {contactSubmissions.length} Total
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                      View and reply to messages from the Contact form
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-100 space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-neutral-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0f2b48]"></span>
                      <span>Client Proposals & Message Inbox</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-neutral-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0f2b48]"></span>
                      <span>Direct Reply via Official Studio Channels</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#0f2b48]">
                  <span>Open Contact Inbox</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </button>

              {/* Card 4: User Management */}
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('users');
                }}
                id="admin-card-user-management"
                className="group relative flex flex-col justify-between p-6 sm:p-7 bg-white border border-neutral-200 hover:border-[#0f2b48] text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#0f2b48]/20 min-h-[320px] overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#0f2b48] transition-colors" />

                <div>
                  <div className="w-12 h-12 bg-neutral-100 group-hover:bg-[#0f2b48] text-neutral-800 group-hover:text-white border border-neutral-200 flex items-center justify-center transition-colors">
                    <Users className="w-6 h-6" />
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-serif-classic text-xl text-neutral-950 font-normal group-hover:text-[#0f2b48] transition-colors">
                        User Management
                      </h2>
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-neutral-100 text-neutral-700 rounded-full shrink-0">
                        {registeredUsers.length} Users
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                      View and manage registered users, account statuses, and permissions
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-100 space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-neutral-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0f2b48]"></span>
                      <span>Registered Listener & Collaborator Profiles</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-neutral-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0f2b48]"></span>
                      <span>Account Status Control (Active / Suspended)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#0f2b48]">
                  <span>Open User Management</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </button>
            </div>

            {/* Quick Activity & Content Overview Strip */}
            <div className="p-6 bg-white border border-neutral-200 shadow-xs">
              <div className="text-xs uppercase font-semibold tracking-[0.2em] text-[#0f2b48] mb-4 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#0f2b48]" />
                <span>Quick Repertoire & Portal Snapshot</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="p-4 bg-neutral-50 border border-neutral-200">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-500 block font-medium">
                    Total Repertoire
                  </span>
                  <span className="font-serif-classic text-2xl text-neutral-900 font-normal">
                    {projects.length} Works
                  </span>
                </div>
                <div className="p-4 bg-neutral-50 border border-neutral-200">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-500 block font-medium">
                    Registered Users
                  </span>
                  <span className="font-serif-classic text-2xl text-neutral-900 font-normal">
                    {registeredUsers.length} Users
                  </span>
                </div>
                <div className="p-4 bg-neutral-50 border border-neutral-200">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-500 block font-medium">
                    Pending Feedback
                  </span>
                  <span className="font-serif-classic text-2xl text-neutral-900 font-normal">
                    {pendingFeedbackCount} Reviews
                  </span>
                </div>
                <div className="p-4 bg-neutral-50 border border-neutral-200">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-500 block font-medium">
                    FAQ Answers
                  </span>
                  <span className="font-serif-classic text-2xl text-neutral-900 font-normal">
                    {faqList.length} Active
                  </span>
                </div>
                <div className="p-4 bg-neutral-50 border border-neutral-200">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-500 block font-medium">
                    Contact Inquiries
                  </span>
                  <span className="font-serif-classic text-2xl text-neutral-900 font-normal">
                    {contactSubmissions.length} Received
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LEVEL 2: CATEGORY SUB-PAGES                                              */}
        {/* ========================================================================= */}

        {/* 1. CATEGORY: Website Management */}
        {activeCategory === 'website' && (
          <div className="space-y-6">
            {/* Website Management Sub-Tabs */}
            <div className="border border-neutral-200 bg-white shadow-xs">
              <div className="flex border-b border-neutral-200 divide-x divide-neutral-200">
                <button
                  type="button"
                  onClick={() => setWebsiteSubTab('home')}
                  id="admin-subtab-home"
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3.5 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all ${
                    websiteSubTab === 'home'
                      ? 'border-[#0f2b48] text-[#0f2b48] bg-neutral-50/75'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50/40'
                  }`}
                >
                  <LayoutTemplate className="w-4 h-4 text-amber-600" />
                  <span>Home Page Editor</span>
                  <span className="ml-1 px-1.5 py-0.2 text-[9px] uppercase font-bold tracking-wider bg-amber-100 text-amber-900 rounded-full">
                    Live Edit
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setWebsiteSubTab('projects')}
                  id="admin-subtab-projects"
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3.5 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all ${
                    websiteSubTab === 'projects'
                      ? 'border-[#0f2b48] text-[#0f2b48] bg-neutral-50/75'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50/40'
                  }`}
                >
                  <Disc className="w-4 h-4" />
                  <span>Songs / Projects</span>
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono bg-neutral-100 text-neutral-700 rounded-full">
                    {projects.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Home Page Editor */}
            {websiteSubTab === 'home' && (
              <HomePageEditor onNotify={showToast} />
            )}

            {/* Sub-tab 2: Songs / Projects */}
            {websiteSubTab === 'projects' && (
              <div className="space-y-6">
                {/* Management Toolbar */}
                <div className="bg-white border border-neutral-200 p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Category Filter Tabs */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 border-b lg:border-b-0 pb-3.5 lg:pb-0 border-neutral-100">
                    {['All', 'Film & BGM', 'Collaboration', 'Original Works'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-2 text-xs tracking-wider uppercase font-medium transition-colors min-h-[38px] flex items-center justify-center ${
                          selectedCategory === cat
                            ? 'bg-[#0f2b48] text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Search Bar & Add Button */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search title, artist, role..."
                        className="w-full pl-8 pr-3 py-2 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none min-h-[40px]"
                      />
                    </div>

                    <button
                      onClick={handleOpenAdd}
                      id="admin-add-project-btn"
                      className="px-4 py-2.5 bg-[#0f2b48] hover:bg-[#163a5f] text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-colors shrink-0 min-h-[40px] shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Project</span>
                    </button>
                  </div>
                </div>

                {/* Repertoire Song Table / List View */}
                <div className="bg-white border border-neutral-200 shadow-xs overflow-hidden">
                  <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                    <h2 className="font-serif-classic text-base sm:text-lg text-neutral-950 font-normal">
                      Repertoire Projects ({filteredProjects.length})
                    </h2>
                    <button
                      onClick={() => {
                        if (confirm('Restore default repertoire projects? This will reset custom changes.')) {
                          resetProjectsToDefault();
                          showToast('Repertoire reset to default master catalogue.');
                        }
                      }}
                      title="Reset to default items"
                      className="text-[11px] text-neutral-400 hover:text-neutral-700 flex items-center space-x-1 py-1 px-1.5"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Defaults</span>
                    </button>
                  </div>

                  {filteredProjects.length === 0 ? (
                    <div className="p-10 sm:p-12 text-center space-y-3">
                      <Disc className="w-10 h-10 text-neutral-300 mx-auto" />
                      <h3 className="text-base font-medium text-neutral-800 font-serif-classic">
                        No songs or projects match your filter
                      </h3>
                      <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                        Try searching for a different title or select &apos;All&apos; categories to view your full repertoire.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedCategory('All');
                          setSearchQuery('');
                        }}
                        className="mt-2 text-xs text-[#0f2b48] underline font-medium p-1"
                      >
                        Clear Search & Filters
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* MOBILE VIEW: Stacked Card Layout (< 768px) */}
                      <div className="block md:hidden divide-y divide-neutral-200">
                        {filteredProjects.map((project) => (
                          <div key={project.id} className="p-4 space-y-3 bg-white">
                            <div className="flex items-start space-x-3">
                              <div className="relative w-14 h-14 bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
                                <Image
                                  src={project.coverUrl}
                                  alt={project.title}
                                  fill
                                  className="object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[9px] font-semibold uppercase tracking-wider mb-1">
                                  {project.category}
                                </span>
                                <h4 className="font-serif-classic text-sm text-neutral-950 font-normal truncate">
                                  {project.title}
                                </h4>
                                <p className="text-[11px] text-neutral-500 font-mono">
                                  {project.year} • {project.duration}
                                </p>
                              </div>
                            </div>

                            <div className="text-xs text-neutral-600 bg-neutral-50 p-2 border border-neutral-100 space-y-1">
                              <div><span className="text-neutral-400">Role:</span> {project.role}</div>
                              <div className="truncate"><span className="text-neutral-400">Collaborators:</span> {project.collaborators.join(', ')}</div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center space-x-1.5">
                                {project.videoClipUrl ? (
                                  <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-800 font-medium bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">
                                    <Video className="w-3 h-3 text-[#0f2b48]" />
                                    <span>30s Video</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-neutral-400">Cover Art Hero</span>
                                )}
                              </div>

                              <div className="flex items-center space-x-2">
                                <NextLink
                                  href={`/song/${project.id}`}
                                  target="_blank"
                                  className="p-1.5 text-neutral-500 hover:text-neutral-900"
                                  title="View song"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </NextLink>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(project)}
                                  className="p-1.5 text-[#0f2b48] hover:bg-neutral-100"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeletingProject(project)}
                                  className="p-1.5 text-red-600 hover:bg-red-50"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* DESKTOP VIEW: Table Layout (>= 768px) */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-neutral-200 bg-neutral-50/80 text-[11px] uppercase tracking-wider font-semibold text-neutral-600">
                              <th className="py-3 px-4">Artwork</th>
                              <th className="py-3 px-4">Song Details</th>
                              <th className="py-3 px-4">Category</th>
                              <th className="py-3 px-4">Role / Artist</th>
                              <th className="py-3 px-4">Media</th>
                              <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200">
                            {filteredProjects.map((project) => (
                              <tr
                                key={project.id}
                                className="hover:bg-neutral-50/80 transition-colors"
                              >
                                {/* Artwork */}
                                <td className="py-3 px-4 whitespace-nowrap">
                                  <div className="relative w-12 h-12 bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
                                    <Image
                                      src={project.coverUrl}
                                      alt={project.title}
                                      fill
                                      className="object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                </td>

                                {/* Title & Year */}
                                <td className="py-3.5 px-4">
                                  <div className="font-medium text-neutral-900 text-sm">
                                    {project.title}
                                  </div>
                                  <div className="text-[11px] text-neutral-500 font-mono">
                                    {project.year} • {project.duration}
                                  </div>
                                </td>

                                {/* Category */}
                                <td className="py-3.5 px-4 whitespace-nowrap">
                                  <span className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[10px] font-semibold uppercase tracking-wider border border-neutral-200">
                                    {project.category}
                                  </span>
                                </td>

                                {/* Role & Collaborators */}
                                <td className="py-3.5 px-4">
                                  <div className="text-neutral-800 font-medium">
                                    {project.role}
                                  </div>
                                  <div className="text-neutral-500 text-[11px] truncate max-w-[180px]">
                                    {project.collaborators.join(', ')}
                                  </div>
                                </td>

                                {/* Media presence */}
                                <td className="py-3.5 px-4 whitespace-nowrap">
                                  <div className="flex items-center space-x-2">
                                    {project.videoClipUrl ? (
                                      <span
                                        title="30s video preview available"
                                        className="inline-flex items-center space-x-1 text-[10px] text-emerald-800 font-medium bg-emerald-50 px-1.5 py-0.5 border border-emerald-200"
                                      >
                                        <Video className="w-3 h-3 text-[#0f2b48]" />
                                        <span>30s Video</span>
                                      </span>
                                    ) : (
                                      <span
                                        title="Uses 3000x3000px artwork fallback"
                                        className="text-[10px] text-neutral-400"
                                      >
                                        Cover Art Hero
                                      </span>
                                    )}

                                    <span className="text-[10px] text-neutral-500 font-mono">
                                      {project.platforms?.length || 0} platforms
                                    </span>
                                  </div>
                                </td>

                                {/* Action Buttons */}
                                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                  <div className="inline-flex items-center space-x-1">
                                    {/* View Live */}
                                    <NextLink
                                      href={`/song/${project.id}`}
                                      target="_blank"
                                      title="View live song page"
                                      className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                    </NextLink>

                                    {/* Edit */}
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEdit(project)}
                                      title="Edit project details"
                                      className="p-1.5 text-neutral-600 hover:text-[#0f2b48] hover:bg-neutral-100 transition-colors"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>

                                    {/* Delete */}
                                    <button
                                      type="button"
                                      onClick={() => setDeletingProject(project)}
                                      title="Delete project"
                                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. CATEGORY: Feedback & FAQ */}
        {activeCategory === 'feedback-faq' && (
          <div className="space-y-6">
            {/* Feedback & FAQ Sub-Tabs */}
            <div className="border border-neutral-200 bg-white shadow-xs">
              <div className="flex border-b border-neutral-200 divide-x divide-neutral-200">
                <button
                  type="button"
                  onClick={() => setFeedbackFaqSubTab('feedback')}
                  id="admin-subtab-feedback"
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3.5 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all ${
                    feedbackFaqSubTab === 'feedback'
                      ? 'border-[#0f2b48] text-[#0f2b48] bg-neutral-50/75'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50/40'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Feedback Moderation</span>
                  {pendingFeedbackCount > 0 ? (
                    <span className="ml-1.5 px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full">
                      {pendingFeedbackCount} Pending
                    </span>
                  ) : (
                    <span className="ml-1.5 px-2 py-0.5 text-[11px] font-mono bg-neutral-100 text-neutral-700 rounded-full">
                      {feedbackList.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setFeedbackFaqSubTab('faq')}
                  id="admin-subtab-faq"
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3.5 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all ${
                    feedbackFaqSubTab === 'faq'
                      ? 'border-[#0f2b48] text-[#0f2b48] bg-neutral-50/75'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50/40'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Manage FAQ</span>
                  <span className="ml-1.5 px-2 py-0.5 text-[11px] font-mono bg-neutral-100 text-neutral-700 rounded-full">
                    {faqList.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Feedback Moderation */}
            {feedbackFaqSubTab === 'feedback' && (
              <FeedbackModeration onNotify={showToast} />
            )}

            {/* Sub-tab 2: FAQ Management */}
            {feedbackFaqSubTab === 'faq' && (
              <FAQManagement onNotify={showToast} />
            )}
          </div>
        )}

        {/* 3. CATEGORY: Contact Submissions */}
        {activeCategory === 'contacts' && (
          <ContactSubmissionsManagement onNotify={showToast} />
        )}

        {/* 4. CATEGORY: User Management */}
        {activeCategory === 'users' && (
          <UserManagement onNotify={showToast} />
        )}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Add / Edit Project Modal */}
      <ProjectFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveProject}
        initialProject={editingProject}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        project={deletingProject}
        isOpen={Boolean(deletingProject)}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Global Auth Modal */}
      <AuthModal />
    </div>
  );
}

export default function AdminPage() {
  return <AdminDashboardContent />;
}
