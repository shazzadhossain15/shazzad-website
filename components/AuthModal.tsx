'use client';

import React, { useState, useEffect } from 'react';
import { X, Lock } from 'lucide-react';
import { usePortfolio, ADMIN_EMAIL } from '@/lib/portfolio-context';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login } = usePortfolio();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [source, setSource] = useState('Instagram');
  const [userType, setUserType] = useState('Just a Fan/Listener');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuthModal();
    };
    if (isAuthModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide your email and password.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please provide your full name.');
        return;
      }
      if (!source) {
        setError('Please select how you found me.');
        return;
      }
      if (!userType) {
        setError('Please select what best describes you.');
        return;
      }
    }

    const isOwner = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const displayName = isOwner
      ? 'Shazzad Hossain'
      : mode === 'signup' && name.trim()
      ? name.trim()
      : email.split('@')[0];

    const chosenRole = mode === 'signup' ? userType : 'Collaborator / Listener';

    login(displayName, email, isOwner ? 'Producer & Studio Owner' : chosenRole, {
      source: mode === 'signup' ? source : undefined,
      userType: mode === 'signup' ? userType : undefined,
      location: mode === 'signup' ? location.trim() : undefined,
    });
    resetAndClose();
  };

  const handleGoogleSignIn = () => {
    login('Verified Google Visitor', 'listener.google@demo.com', 'Listener', {
      source: 'Google Search',
      userType: 'Just a Fan/Listener',
      location: 'United States',
    });
    resetAndClose();
  };

  const handleQuickGuest = () => {
    login('Guest Reviewer', 'guest.visitor@studio.internal', 'Collaborator', {
      source: 'Referral',
      userType: 'Fellow Artist/Collaborator',
      location: 'Studio Internal',
    });
    resetAndClose();
  };

  const resetAndClose = () => {
    setEmail('');
    setPassword('');
    setName('');
    setSource('Instagram');
    setUserType('Just a Fan/Listener');
    setLocation('');
    setError('');
    closeAuthModal();
  };

  return (
    <div
      id="auth-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-[2px] animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) resetAndClose();
      }}
    >
      <div
        id="auth-modal-content"
        className="relative w-full max-w-lg bg-white border border-neutral-200 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          id="auth-modal-close-btn"
          aria-label="Close authentication modal"
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-950 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 mb-6">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#0f2b48]/10 text-[#0f2b48] flex items-center justify-center mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3
            id="auth-modal-title"
            className="font-serif-classic text-2xl text-neutral-950 font-normal"
          >
            {mode === 'signin' ? 'Sign In to Leave Feedback' : 'Create an Account'}
          </h3>
          <p className="text-xs text-neutral-500">
            Authentication is only required to post reflections and feedback on works.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex border-b border-neutral-200 mb-6 text-xs uppercase tracking-wider font-medium">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError('');
            }}
            className={`flex-1 pb-2.5 text-center transition-colors border-b-2 ${
              mode === 'signin'
                ? 'border-[#0f2b48] text-[#0f2b48]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`flex-1 pb-2.5 text-center transition-colors border-b-2 ${
              mode === 'signup'
                ? 'border-[#0f2b48] text-[#0f2b48]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label
                htmlFor="auth-name"
                className="block text-xs uppercase tracking-wider text-neutral-700 font-medium"
              >
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="auth-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Julian Hayes"
                className="w-full px-3 py-2 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
              />
            </div>
          )}

          <div className="space-y-1">
            <label
              htmlFor="auth-email"
              className="block text-xs uppercase tracking-wider text-neutral-700 font-medium"
            >
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="auth-password"
              className="block text-xs uppercase tracking-wider text-neutral-700 font-medium"
            >
              Password <span className="text-rose-500">*</span>
            </label>
            <input
              id="auth-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
            />
          </div>

          {mode === 'signup' && (
            <>
              {/* Dropdown 1: How did you find me? */}
              <div className="space-y-1">
                <label
                  htmlFor="auth-source"
                  className="block text-xs uppercase tracking-wider text-neutral-700 font-medium"
                >
                  How did you find me? <span className="text-rose-500">*</span>
                </label>
                <select
                  id="auth-source"
                  required
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none cursor-pointer"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Google Search">Google Search</option>
                  <option value="Referral">Referral</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Dropdown 2: What best describes you? */}
              <div className="space-y-1">
                <label
                  htmlFor="auth-user-type"
                  className="block text-xs uppercase tracking-wider text-neutral-700 font-medium"
                >
                  What best describes you? <span className="text-rose-500">*</span>
                </label>
                <select
                  id="auth-user-type"
                  required
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none cursor-pointer"
                >
                  <option value="Just a Fan/Listener">Just a Fan/Listener</option>
                  <option value="Looking to hire for a project">Looking to hire for a project</option>
                  <option value="Fellow Artist/Collaborator">Fellow Artist/Collaborator</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Field 3: Country / Location */}
              <div className="space-y-1">
                <label
                  htmlFor="auth-location"
                  className="block text-xs uppercase tracking-wider text-neutral-700 font-medium"
                >
                  Country / Location
                </label>
                <input
                  id="auth-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. United States, London, Tokyo"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            id="auth-submit-btn"
            className="w-full py-2.5 bg-[#0f2b48] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#163a5f] transition-colors"
          >
            {mode === 'signin' ? 'Sign In & Proceed' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-white px-2 text-neutral-400">or quick access</span>
          </div>
        </div>

        {/* Quick Google Sign In & Guest Option */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            id="auth-google-btn"
            className="w-full py-2 px-3 border border-neutral-300 hover:border-neutral-500 bg-white text-xs text-neutral-700 font-medium flex items-center justify-center space-x-2 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Quick guest option */}
          <button
            type="button"
            onClick={handleQuickGuest}
            id="auth-guest-btn"
            className="w-full py-1.5 text-[11px] text-neutral-500 hover:text-[#0f2b48] hover:underline"
          >
            Continue as Guest Reviewer (1-click)
          </button>
        </div>
      </div>
    </div>
  );
}
