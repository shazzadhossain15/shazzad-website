'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';

export function AdminAccessDenied() {
  const { user, openAuthModal, logout } = usePortfolio();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-neutral-50/50">
      <div className="max-w-md w-full bg-white border border-neutral-200 shadow-sm p-8 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-red-600">
            Access Restricted
          </span>
          <h1 className="font-serif-classic text-2xl sm:text-3xl text-neutral-950 font-normal">
            Site Owner Access Required
          </h1>
          <p className="text-sm text-neutral-600 leading-relaxed">
            This area is restricted to the site owner. Please sign in with your authorized account to continue.
          </p>
        </div>

        {user ? (
          <div className="p-3.5 bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Currently logged in as:</span>
              <span className="font-medium text-neutral-900">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Role:</span>
              <span className="text-neutral-700">{user.role}</span>
            </div>
            <p className="text-[11px] text-amber-700 pt-1 border-t border-neutral-200">
              This account does not have administrative privileges. Please sign in with an authorized account.
            </p>
          </div>
        ) : (
          <div className="p-3.5 bg-blue-50/80 border border-blue-100 text-xs text-blue-800 text-left">
            You are not currently signed in. Please sign in with your authorized site owner credentials to access project management.
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {user ? (
            <>
              <button
                onClick={() => {
                  logout();
                  openAuthModal();
                }}
                id="admin-switch-account-btn"
                className="flex-1 py-2.5 px-4 bg-[#0f2b48] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#163a5f] transition-colors flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Switch Account</span>
              </button>
              <Link
                href="/portfolio"
                id="admin-return-portfolio-btn"
                className="py-2.5 px-4 border border-neutral-300 text-xs font-medium uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 transition-colors flex items-center justify-center space-x-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Portfolio</span>
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={openAuthModal}
                id="admin-signin-owner-btn"
                className="flex-1 py-2.5 px-4 bg-[#0f2b48] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#163a5f] transition-colors flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <Link
                href="/"
                id="admin-return-home-btn"
                className="py-2.5 px-4 border border-neutral-300 text-xs font-medium uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 transition-colors flex items-center justify-center space-x-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
