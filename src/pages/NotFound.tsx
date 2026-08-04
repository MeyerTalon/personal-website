import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-16">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <p className="font-mono text-xs tracking-widest text-accent">404</p>
        <h1 className="mt-3 font-mono text-2xl text-white sm:text-3xl">
          page not found.
        </h1>
        <p className="mt-3 text-white/50">
          the page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block font-mono text-sm text-accent transition-colors hover:text-accent/80"
        >
          ← back home
        </Link>
      </div>
    </div>
  );
}
