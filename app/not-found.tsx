import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-neutral-900 font-serif-classic text-center">
      <h1 className="text-6xl font-bold text-[#0f2b48] mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
      <p className="text-neutral-600 max-w-md mb-8">
        The page you are looking for might have been moved, removed, or does not exist.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#0f2b48] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#163a5f] transition-colors shadow-sm"
      >
        Return to Home
      </Link>
    </div>
  );
}
