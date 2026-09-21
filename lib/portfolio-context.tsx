'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PORTFOLIO_PROJECTS, PortfolioProject } from './portfolio-data';
import { INITIAL_FEEDBACK, FeedbackItem, UserSession } from './feedback-data';
import { INITIAL_FAQS, FAQItem } from './faq-data';
import { INITIAL_CONTACT_SUBMISSIONS, ContactSubmission } from './contact-data';
import { INITIAL_REGISTERED_USERS, RegisteredUser, UserAccountStatus } from './user-data';
import {
  INITIAL_HOME_PAGE_DATA,
  HomePageData,
  HeroSectionData,
  AboutSectionData,
  ContactSectionData,
} from './home-data';
import { audioSynth } from './audio-synth';
import {
  saveProjectsToIDB,
  loadProjectsFromIDB,
  saveHomeDataToIDB,
  loadHomeDataFromIDB,
} from './storage-helper';

export const ADMIN_EMAIL = 'unishop72@gmail.com';

export function isUserAdmin(user: UserSession | null): boolean {
  if (!user || !user.email) return false;
  return user.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();
}

interface PortfolioContextType {
  // Auth
  user: UserSession | null;
  isAdmin: boolean;
  isHydrated: boolean;
  login: (
    name: string,
    email: string,
    role?: string,
    extra?: { source?: string; userType?: string; location?: string }
  ) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  // Registered Users Management
  registeredUsers: RegisteredUser[];
  updateUserStatus: (email: string, status: UserAccountStatus) => void;
  isUserSuspended: (email?: string) => boolean;

  // Home Page Editor Management
  homeData: HomePageData;
  updateHeroSection: (updates: Partial<HeroSectionData>) => boolean;
  updateAboutSection: (updates: Partial<AboutSectionData>) => boolean;
  updateContactSection: (updates: Partial<ContactSectionData>) => boolean;
  resetHomeSectionToDefault: (section: 'hero' | 'about' | 'contact' | 'all') => void;

  // Projects / Songs Management
  projects: PortfolioProject[];
  addProject: (projectData: Omit<PortfolioProject, 'id'> & { id?: string }) => PortfolioProject;
  updateProject: (id: string, updates: Partial<PortfolioProject>) => boolean;
  deleteProject: (id: string) => boolean;
  resetProjectsToDefault: () => void;
  getProjectById: (id: string) => PortfolioProject | undefined;

  // Feedback
  feedbackList: FeedbackItem[];
  addFeedback: (rating: number, comment: string, userRole?: string) => boolean;
  approveFeedback: (id: string) => void;
  rejectFeedback: (id: string) => void;
  deleteFeedback: (id: string) => void;

  // FAQ Management
  faqList: FAQItem[];
  addFAQ: (faqData: Omit<FAQItem, 'id' | 'order'>) => FAQItem;
  updateFAQ: (id: string, updates: Partial<Omit<FAQItem, 'id'>>) => boolean;
  deleteFAQ: (id: string) => boolean;
  reorderFAQ: (id: string, direction: 'up' | 'down') => void;
  resetFAQToDefault: () => void;

  // Contact Submissions
  contactSubmissions: ContactSubmission[];
  unreadContactCount: number;
  addContactSubmission: (data: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>) => ContactSubmission;
  markContactSubmissionAsRead: (id: string) => void;
  markContactSubmissionAsUnread: (id: string) => void;
  deleteContactSubmission: (id: string) => boolean;

  // Portfolio Modal
  activeProject: PortfolioProject | null;
  openProjectModal: (project: PortfolioProject) => void;
  closeProjectModal: () => void;

  // Audio preview
  playingTrackId: string | null;
  togglePlayPreview: (project: PortfolioProject) => void;
  stopAudio: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const STORAGE_KEY_FEEDBACK = 'shazzad_feedback_v1';
const STORAGE_KEY_USER = 'shazzad_user_session';
const STORAGE_KEY_USERS = 'shazzad_registered_users_v1';
const STORAGE_KEY_PROJECTS = 'shazzad_custom_projects_v2';
const STORAGE_KEY_FAQ = 'shazzad_faq_v1';
const STORAGE_KEY_CONTACT = 'shazzad_contact_submissions_v1';
const STORAGE_KEY_HOME = 'shazzad_home_page_data_v1';

function persistHomeData(updated: HomePageData) {
  // Always persist to IndexedDB
  saveHomeDataToIDB(updated);
  // Also persist to localStorage for instant synchronous hydration
  try {
    localStorage.setItem(STORAGE_KEY_HOME, JSON.stringify(updated));
  } catch {}
}

function persistFAQList(updatedList: FAQItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY_FAQ, JSON.stringify(updatedList));
  } catch {}
}

function persistContactSubmissions(updatedList: ContactSubmission[]) {
  try {
    localStorage.setItem(STORAGE_KEY_CONTACT, JSON.stringify(updatedList));
  } catch {}
}

// Helper to safely write projects to localStorage and IndexedDB
function persistProjects(updatedList: PortfolioProject[]) {
  // Always persist to IndexedDB (virtually unlimited quota)
  saveProjectsToIDB(updatedList);

  // Also persist to localStorage for instant synchronous hydration
  try {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updatedList));
  } catch {
    // If quota exceeded due to large media strings, strip large base64 strings from localStorage fallback
    try {
      const lightweightCopy = updatedList.map((p) => ({
        ...p,
        // If video clip is massive base64, omit from localStorage (it's safe in IndexedDB)
        videoClipUrl: p.videoClipUrl?.startsWith('data:') && p.videoClipUrl.length > 500000 ? undefined : p.videoClipUrl,
      }));
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(lightweightCopy));
    } catch {}
  }
}

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(INITIAL_REGISTERED_USERS);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>(INITIAL_FEEDBACK);
  const [projects, setProjects] = useState<PortfolioProject[]>(PORTFOLIO_PROJECTS);
  const [faqList, setFaqList] = useState<FAQItem[]>(INITIAL_FAQS);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>(INITIAL_CONTACT_SUBMISSIONS);
  const [homeData, setHomeData] = useState<HomePageData>(INITIAL_HOME_PAGE_DATA);
  const [activeProject, setActiveProject] = useState<PortfolioProject | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const isAdmin = isUserAdmin(user);

  const persistRegisteredUsers = (updated: RegisteredUser[]) => {
    setRegisteredUsers(updated);
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updated));
    } catch {}
  };

  const updateUserStatus = (email: string, status: UserAccountStatus) => {
    const targetEmail = email.toLowerCase().trim();
    // Prevent suspending the studio admin owner
    if (targetEmail === ADMIN_EMAIL.toLowerCase() && status === 'Suspended') {
      return;
    }
    const updated = registeredUsers.map((u) =>
      u.email.toLowerCase().trim() === targetEmail ? { ...u, status } : u
    );
    persistRegisteredUsers(updated);
  };

  const isUserSuspended = (email?: string): boolean => {
    if (!email) return false;
    const target = registeredUsers.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );
    return target ? target.status === 'Suspended' : false;
  };

  // Client hydration & background IndexedDB loading
  useEffect(() => {
    // Hydrate localStorage data cleanly after initial SSR mount to prevent hydration mismatch
    const timer = setTimeout(() => {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEY_USER);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch {}

      try {
        const savedUsers = localStorage.getItem(STORAGE_KEY_USERS);
        if (savedUsers) {
          const parsed = JSON.parse(savedUsers);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRegisteredUsers(parsed);
          }
        } else {
          localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_REGISTERED_USERS));
        }
      } catch {}

      try {
        const savedProjects = localStorage.getItem(STORAGE_KEY_PROJECTS);
        if (savedProjects) {
          const parsed = JSON.parse(savedProjects);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProjects(parsed);
          }
        }
      } catch {}

      try {
        const savedHome = localStorage.getItem(STORAGE_KEY_HOME);
        if (savedHome) {
          const parsed = JSON.parse(savedHome);
          if (parsed && typeof parsed === 'object' && parsed.hero) {
            setHomeData(parsed);
          }
        }
      } catch {}

      try {
        const savedFeedback = localStorage.getItem(STORAGE_KEY_FEEDBACK);
        if (savedFeedback) {
          const parsed = JSON.parse(savedFeedback);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const sanitized: FeedbackItem[] = parsed.map((item) => ({
              ...item,
              status: item.status || 'Approved',
            }));
            setFeedbackList(sanitized);
          }
        }
      } catch {}

      try {
        const savedFAQ = localStorage.getItem(STORAGE_KEY_FAQ);
        if (savedFAQ) {
          const parsed = JSON.parse(savedFAQ);
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsed.sort((a: FAQItem, b: FAQItem) => (a.order || 0) - (b.order || 0));
            setFaqList(parsed);
          }
        } else {
          localStorage.setItem(STORAGE_KEY_FAQ, JSON.stringify(INITIAL_FAQS));
        }
      } catch {}

      try {
        const savedContacts = localStorage.getItem(STORAGE_KEY_CONTACT);
        if (savedContacts) {
          const parsed = JSON.parse(savedContacts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setContactSubmissions(parsed);
          }
        } else {
          localStorage.setItem(STORAGE_KEY_CONTACT, JSON.stringify(INITIAL_CONTACT_SUBMISSIONS));
        }
      } catch {}

      setIsHydrated(true);
    }, 0);
    // 1. High-capacity IndexedDB check to load large media and latest edits
    loadProjectsFromIDB()
      .then((idbProjects) => {
        if (Array.isArray(idbProjects) && idbProjects.length > 0) {
          setProjects(idbProjects);
          try {
            localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(idbProjects));
          } catch {}
        }
      })
      .catch(() => {});

    loadHomeDataFromIDB()
      .then((idbHome) => {
        if (idbHome && typeof idbHome === 'object' && idbHome.hero) {
          setHomeData(idbHome);
          try {
            localStorage.setItem(STORAGE_KEY_HOME, JSON.stringify(idbHome));
          } catch {}
        }
      })
      .catch(() => {});

    // 2. Storage event listener to keep multiple windows or tabs in sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_HOME && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object' && parsed.hero) {
            setHomeData(parsed);
          }
        } catch {}
      }
      if (e.key === STORAGE_KEY_PROJECTS && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProjects(parsed);
          }
        } catch {}
      }
      if (e.key === STORAGE_KEY_FEEDBACK && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            const sanitized: FeedbackItem[] = parsed.map((item) => ({
              ...item,
              status: item.status || 'Approved',
            }));
            setFeedbackList(sanitized);
          }
        } catch {}
      }
      if (e.key === STORAGE_KEY_FAQ && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            parsed.sort((a: FAQItem, b: FAQItem) => (a.order || 0) - (b.order || 0));
            setFaqList(parsed);
          }
        } catch {}
      }
      if (e.key === STORAGE_KEY_CONTACT && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setContactSubmissions(parsed);
          }
        } catch {}
      }
      if (e.key === STORAGE_KEY_USERS && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setRegisteredUsers(parsed);
          }
        } catch {}
      }
      if (e.key === STORAGE_KEY_USER) {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch {}
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (
    name: string,
    email: string,
    role: string = 'Collaborator / Listener',
    extra?: { source?: string; userType?: string; location?: string }
  ) => {
    const trimmedEmail = email.trim().toLowerCase();
    const isOwner = trimmedEmail === ADMIN_EMAIL.toLowerCase();
    const userName = isOwner ? 'Shazzad Hossain' : name.trim() || 'Visitor';
    const userRole = isOwner ? 'Producer & Studio Owner' : extra?.userType || role.trim() || 'Collaborator / Listener';

    // Register user or sync existing record
    const existingIndex = registeredUsers.findIndex(
      (u) => u.email.toLowerCase().trim() === trimmedEmail
    );

    let updatedUsers = [...registeredUsers];
    if (existingIndex >= 0) {
      const existing = updatedUsers[existingIndex];
      updatedUsers[existingIndex] = {
        ...existing,
        name: isOwner ? 'Shazzad Hossain' : name.trim() || existing.name,
        role: isOwner ? 'Producer & Studio Owner' : extra?.userType || role.trim() || existing.role,
        source: extra?.source ?? existing.source,
        userType: extra?.userType ?? existing.userType,
        location: extra?.location !== undefined ? extra.location : existing.location,
      };
    } else {
      const newUserRecord: RegisteredUser = {
        id: isOwner ? 'usr-admin' : `usr-${Date.now()}`,
        name: userName,
        email: trimmedEmail || 'visitor@example.com',
        role: userRole,
        joinedAt: new Date().toISOString(),
        status: 'Active',
        source: extra?.source,
        userType: extra?.userType || userRole,
        location: extra?.location?.trim() || undefined,
      };
      updatedUsers = [newUserRecord, ...updatedUsers];
    }

    persistRegisteredUsers(updatedUsers);

    const newUser: UserSession = {
      id: isOwner ? 'usr-admin' : `usr-${Date.now()}`,
      name: userName,
      email: trimmedEmail || 'visitor@example.com',
      role: userRole,
    };
    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    } catch {}
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch {}
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Project Management Methods
  const addProject = (projectData: Omit<PortfolioProject, 'id'> & { id?: string }): PortfolioProject => {
    // Generate clean URL slug if not provided
    const baseSlug = projectData.id?.trim() || projectData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Ensure slug uniqueness
    let uniqueSlug = baseSlug || `song-${Date.now()}`;
    let counter = 1;
    while (projects.some((p) => p.id === uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    const newProject: PortfolioProject = {
      ...projectData,
      id: uniqueSlug,
      year: projectData.year || new Date().getFullYear().toString(),
      duration: projectData.duration || '3:30',
      bpm: projectData.bpm || 80,
      key: projectData.key || 'C Minor',
      role: projectData.role || 'Composer & Producer',
      collaborators: projectData.collaborators || [],
      collaborationNote: projectData.collaborationNote || projectData.shortDescription,
      shortDescription: projectData.shortDescription || '',
      fullNote: projectData.fullNote || projectData.collaborationNote || '',
      musicalFocus: projectData.musicalFocus || ['Acoustic', 'Arrangement'],
      spotifyUrl: projectData.spotifyUrl || '',
      appleMusicUrl: projectData.appleMusicUrl || '',
      youtubeUrl: projectData.youtubeUrl || '',
      soundcloudUrl: projectData.soundcloudUrl || '',
      platforms: projectData.platforms || [],
    };

    const updated = [newProject, ...projects];
    setProjects(updated);
    persistProjects(updated);

    return newProject;
  };

  const updateProject = (id: string, updates: Partial<PortfolioProject>): boolean => {
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return false;

    const updatedProjects = [...projects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      ...updates,
    };

    setProjects(updatedProjects);
    persistProjects(updatedProjects);

    return true;
  };

  const deleteProject = (id: string): boolean => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    persistProjects(updated);
    return true;
  };

  const resetProjectsToDefault = () => {
    setProjects(PORTFOLIO_PROJECTS);
    persistProjects(PORTFOLIO_PROJECTS);
  };

  const getProjectById = (id: string): PortfolioProject | undefined => {
    return projects.find((p) => p.id === id);
  };

  const persistFeedbackList = (updated: FeedbackItem[]) => {
    setFeedbackList(updated);
    try {
      localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(updated));
    } catch {}
  };

  const addFeedback = (rating: number, comment: string, role?: string): boolean => {
    if (!user) {
      setIsAuthModalOpen(true);
      return false;
    }

    if (isUserSuspended(user.email)) {
      return false;
    }

    const newFeedback: FeedbackItem = {
      id: `fb-${Date.now()}`,
      userName: user.name,
      userEmail: user.email,
      userRole: role?.trim() || user.role || 'Collaborator',
      rating,
      comment: comment.trim(),
      date: new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date()),
      status: 'Pending',
      verified: true,
    };

    const updated = [newFeedback, ...feedbackList];
    persistFeedbackList(updated);

    return true;
  };

  const approveFeedback = (id: string) => {
    const updated = feedbackList.map((item) =>
      item.id === id ? { ...item, status: 'Approved' as const } : item
    );
    persistFeedbackList(updated);
  };

  const rejectFeedback = (id: string) => {
    const updated = feedbackList.map((item) =>
      item.id === id ? { ...item, status: 'Rejected' as const } : item
    );
    persistFeedbackList(updated);
  };

  const deleteFeedback = (id: string) => {
    const updated = feedbackList.filter((item) => item.id !== id);
    persistFeedbackList(updated);
  };

  // FAQ Management Methods
  const addFAQ = (faqData: Omit<FAQItem, 'id' | 'order'>): FAQItem => {
    const newId = `faq-${Date.now()}`;
    const maxOrder = faqList.reduce((max, item) => Math.max(max, item.order || 0), 0);
    const newFAQ: FAQItem = {
      ...faqData,
      id: newId,
      order: maxOrder + 1,
    };
    const updated = [...faqList, newFAQ];
    setFaqList(updated);
    persistFAQList(updated);
    return newFAQ;
  };

  const updateFAQ = (id: string, updates: Partial<Omit<FAQItem, 'id'>>): boolean => {
    const exists = faqList.some((f) => f.id === id);
    if (!exists) return false;
    const updated = faqList.map((f) => (f.id === id ? { ...f, ...updates } : f));
    setFaqList(updated);
    persistFAQList(updated);
    return true;
  };

  const deleteFAQ = (id: string): boolean => {
    const exists = faqList.some((f) => f.id === id);
    if (!exists) return false;
    const updated = faqList
      .filter((f) => f.id !== id)
      .map((f, index) => ({ ...f, order: index + 1 }));
    setFaqList(updated);
    persistFAQList(updated);
    return true;
  };

  const reorderFAQ = (id: string, direction: 'up' | 'down') => {
    const index = faqList.findIndex((f) => f.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === faqList.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newList = [...faqList];
    const [movedItem] = newList.splice(index, 1);
    newList.splice(targetIndex, 0, movedItem);

    const reordered = newList.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));
    setFaqList(reordered);
    persistFAQList(reordered);
  };

  const resetFAQToDefault = () => {
    setFaqList(INITIAL_FAQS);
    persistFAQList(INITIAL_FAQS);
  };

  // Contact Submissions Methods
  const unreadContactCount = contactSubmissions.filter((c) => c.status === 'Unread').length;

  const addContactSubmission = (data: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>): ContactSubmission => {
    const newSubmission: ContactSubmission = {
      ...data,
      id: `contact-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      status: 'Unread',
    };
    const updated = [newSubmission, ...contactSubmissions];
    setContactSubmissions(updated);
    persistContactSubmissions(updated);
    return newSubmission;
  };

  const markContactSubmissionAsRead = (id: string) => {
    const updated = contactSubmissions.map((c) =>
      c.id === id ? { ...c, status: 'Read' as const } : c
    );
    setContactSubmissions(updated);
    persistContactSubmissions(updated);
  };

  const markContactSubmissionAsUnread = (id: string) => {
    const updated = contactSubmissions.map((c) =>
      c.id === id ? { ...c, status: 'Unread' as const } : c
    );
    setContactSubmissions(updated);
    persistContactSubmissions(updated);
  };

  const deleteContactSubmission = (id: string): boolean => {
    const exists = contactSubmissions.some((c) => c.id === id);
    if (!exists) return false;
    const updated = contactSubmissions.filter((c) => c.id !== id);
    setContactSubmissions(updated);
    persistContactSubmissions(updated);
    return true;
  };

  // Home Page Editor Methods
  const updateHeroSection = (updates: Partial<HeroSectionData>): boolean => {
    const updated: HomePageData = {
      ...homeData,
      hero: {
        ...homeData.hero,
        ...updates,
      },
    };
    setHomeData(updated);
    persistHomeData(updated);
    return true;
  };

  const updateAboutSection = (updates: Partial<AboutSectionData>): boolean => {
    const updated: HomePageData = {
      ...homeData,
      about: {
        ...homeData.about,
        ...updates,
      },
    };
    setHomeData(updated);
    persistHomeData(updated);
    return true;
  };

  const updateContactSection = (updates: Partial<ContactSectionData>): boolean => {
    const updated: HomePageData = {
      ...homeData,
      contact: {
        ...homeData.contact,
        ...updates,
      },
    };
    setHomeData(updated);
    persistHomeData(updated);
    return true;
  };

  const resetHomeSectionToDefault = (section: 'hero' | 'about' | 'contact' | 'all') => {
    let updated: HomePageData;
    if (section === 'all') {
      updated = INITIAL_HOME_PAGE_DATA;
    } else {
      updated = {
        ...homeData,
        [section]: INITIAL_HOME_PAGE_DATA[section],
      };
    }
    setHomeData(updated);
    persistHomeData(updated);
  };

  const openProjectModal = (project: PortfolioProject) => {
    setActiveProject(project);
  };

  const closeProjectModal = () => {
    setActiveProject(null);
  };

  const togglePlayPreview = (project: PortfolioProject) => {
    if (playingTrackId === project.id) {
      audioSynth.stop();
      setPlayingTrackId(null);
    } else {
      audioSynth.playChord(project.audioNotes, project.id, () => {
        setPlayingTrackId(null);
      });
      setPlayingTrackId(project.id);
    }
  };

  const stopAudio = () => {
    audioSynth.stop();
    setPlayingTrackId(null);
  };

  return (
    <PortfolioContext.Provider
      value={{
        user,
        isAdmin,
        isHydrated,
        login,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        registeredUsers,
        updateUserStatus,
        isUserSuspended,
        homeData,
        updateHeroSection,
        updateAboutSection,
        updateContactSection,
        resetHomeSectionToDefault,
        projects,
        addProject,
        updateProject,
        deleteProject,
        resetProjectsToDefault,
        getProjectById,
        feedbackList,
        addFeedback,
        approveFeedback,
        rejectFeedback,
        deleteFeedback,
        faqList,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        reorderFAQ,
        resetFAQToDefault,
        contactSubmissions,
        unreadContactCount,
        addContactSubmission,
        markContactSubmissionAsRead,
        markContactSubmissionAsUnread,
        deleteContactSubmission,
        activeProject,
        openProjectModal,
        closeProjectModal,
        playingTrackId,
        togglePlayPreview,
        stopAudio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}

