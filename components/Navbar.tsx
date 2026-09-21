'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LogOut, ShieldCheck } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, logout, openAuthModal } = usePortfolio();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'About Me', href: '/#about' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Feedback', href: '/#feedback' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <header
      id="top-nav"
      className={`sticky top-0 z-40 w-full max-w-full transition-all duration-300 bg-white ${
        isScrolled ? 'border-b border-neutral-200 shadow-[0_2px_12px_rgba(0,0,0,0.03)]' : 'border-b border-neutral-100'
      }`}
    >
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand / Logo */}
        <Link
          href="/#home"
          id="nav-brand"
          className="group flex flex-col justify-center focus:outline-none shrink-0"
        >
          <span className="font-serif-classic text-[16px] min-[360px]:text-[17px] min-[400px]:text-lg sm:text-xl md:text-2xl font-normal tracking-wide text-neutral-950 group-hover:text-[#0f2b48] transition-colors whitespace-nowrap leading-tight">
            Shazzad Hossain
          </span>
          <span className="hidden min-[400px]:block text-[8px] min-[480px]:text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.25em] uppercase text-neutral-500 font-medium whitespace-nowrap leading-tight mt-0.5">
            Music Producer & Composer
          </span>
        </Link>

        {/* Desktop Navigation (large screens >= 1024px) */}
        <nav id="desktop-nav-menu" aria-label="Main Navigation" className="hidden lg:flex items-center space-x-5 xl:space-x-8 shrink-0">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/portfolio'
                ? pathname === '/portfolio' || pathname.startsWith('/song/')
                : link.href === '/faq'
                ? pathname === '/faq'
                : false;

            return (
              <Link
                key={link.name}
                href={link.href}
                id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                className={`text-[13px] xl:text-sm py-1 relative whitespace-nowrap transition-colors ${
                  isActive
                    ? 'font-medium text-[#0f2b48] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#0f2b48]'
                    : 'font-normal text-neutral-700 hover:text-[#0f2b48] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#0f2b48] hover:after:w-full after:transition-all'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* Auth Action in Desktop Navbar */}
          <div className="pl-4 xl:pl-6 border-l border-neutral-200 flex items-center space-x-3 shrink-0">
            {isAdmin && (
              <Link
                href="/admin"
                id="nav-admin-link"
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  pathname === '/admin'
                    ? 'bg-[#0f2b48] text-white shadow-xs'
                    : 'bg-neutral-100 text-[#0f2b48] border border-neutral-300 hover:bg-[#0f2b48] hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Admin Dashboard</span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-3 shrink-0">
                <span className="text-xs text-neutral-600 max-w-[100px] xl:max-w-[140px] truncate whitespace-nowrap" title={user.name}>
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  id="nav-logout-btn"
                  title="Sign out"
                  aria-label="Sign out"
                  className="p-1.5 text-neutral-500 hover:text-neutral-900 transition-colors shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                id="nav-login-btn"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-[#0f2b48]/30 text-xs font-medium tracking-wider uppercase text-[#0f2b48] hover:bg-[#0f2b48] hover:text-white transition-all duration-200 whitespace-nowrap shrink-0"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </nav>

        {/* Tablet & Mobile controls (< 1024px: 320px to 1023px) */}
        <div className="flex items-center space-x-2 sm:space-x-3 lg:hidden shrink-0">
          {/* Admin button in top bar: Visible on sm (640px) to md (1023px). Hidden below 640px to prevent crowding */}
          {isAdmin && (
            <Link
              href="/admin"
              id="nav-tablet-admin-link"
              className={`hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 ${
                pathname === '/admin'
                  ? 'bg-[#0f2b48] text-white shadow-xs'
                  : 'bg-neutral-100 text-[#0f2b48] border border-neutral-300 hover:bg-[#0f2b48] hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">Admin Dashboard</span>
              <span className="md:hidden">Admin</span>
            </Link>
          )}

          {/* Prominent Hamburger Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="inline-flex items-center justify-center space-x-1.5 p-1.5 sm:p-2 border border-neutral-300 hover:border-neutral-500 bg-white hover:bg-neutral-50 text-neutral-900 focus:outline-none transition-colors shrink-0 min-w-[38px] min-h-[38px] touch-manipulation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline text-neutral-800">
              {mobileMenuOpen ? 'Close' : 'Menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Tablet & Mobile Drawer (< 1024px) */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="lg:hidden border-b border-neutral-200 bg-white/98 backdrop-blur-md px-4 sm:px-6 py-5 sm:py-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/portfolio'
                  ? pathname === '/portfolio' || pathname.startsWith('/song/')
                  : link.href === '/faq'
                  ? pathname === '/faq'
                  : false;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  id={`mobile-nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`text-base sm:text-lg py-2.5 px-3 rounded-sm font-serif-classic transition-colors flex items-center justify-between border-b border-neutral-100 ${
                    isActive
                      ? 'text-[#0f2b48] font-semibold bg-neutral-50'
                      : 'text-neutral-800 hover:text-[#0f2b48] hover:bg-neutral-50'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive ? (
                    <span className="w-2 h-2 rounded-full bg-[#0f2b48]" />
                  ) : (
                    <span className="text-xs text-neutral-400">→</span>
                  )}
                </Link>
              );
            })}

            {/* Admin Dashboard link inside drawer: only displayed below 640px where top bar admin button is hidden */}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                id="mobile-nav-link-admin"
                className={`sm:hidden text-base py-2.5 px-3 rounded-sm font-serif-classic transition-colors flex items-center justify-between border-b border-neutral-100 ${
                  pathname === '/admin'
                    ? 'text-[#0f2b48] font-semibold bg-neutral-50'
                    : 'text-neutral-800 hover:text-[#0f2b48] hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#0f2b48]" />
                  <span>Admin Dashboard</span>
                </div>
                {pathname === '/admin' ? (
                  <span className="w-2 h-2 rounded-full bg-[#0f2b48]" />
                ) : (
                  <span className="text-xs text-neutral-400">→</span>
                )}
              </Link>
            )}
          </div>

          <div className="pt-3 border-t border-neutral-200">
            {user ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-neutral-50 border border-neutral-200">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#0f2b48] text-white flex items-center justify-center shrink-0 text-xs font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-neutral-900 truncate" title={user.name}>
                      {user.name}
                    </div>
                    <div className="text-[11px] text-neutral-500 truncate" title={user.email}>
                      {user.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  id="mobile-drawer-logout-btn"
                  className="text-xs text-red-600 hover:text-red-800 flex items-center justify-center space-x-1.5 py-1.5 px-3 border border-red-200 bg-red-50/50 hover:bg-red-100 transition-colors font-medium shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  openAuthModal();
                  setMobileMenuOpen(false);
                }}
                id="mobile-drawer-login-btn"
                className="w-full py-2.5 px-4 text-center border border-[#0f2b48] text-xs uppercase tracking-wider font-semibold text-[#0f2b48] hover:bg-[#0f2b48] hover:text-white transition-colors flex items-center justify-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Sign In to Leave Feedback</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

