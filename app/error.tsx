'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App runtime error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-neutral-900 font-serif-classic text-center">
      <h1 className="text-4xl sm:text-5xl font-normal text-[#0f2b48] mb-3">
        Something went wrong
      </h1>
      <p className="text-neutral-600 max-w-md mb-6 text-sm font-sans">
        An unexpected issue occurred while rendering this page. You can try refreshing the view.
      </p>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 bg-[#0f2b48] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#163a5f] transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 border border-neutral-300 text-neutral-800 text-xs uppercase tracking-wider font-semibold hover:bg-neutral-50 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
