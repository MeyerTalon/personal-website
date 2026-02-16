import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, FileText } from 'lucide-react';
import { cn } from '../utils/cn';
import type { NavItem } from '../types';

const navItems: NavItem[] = [
  { label: 'home', path: '/' },
  { label: 'about', path: '/about' },
  { label: 'projects', path: '/projects' },
  { label: 'contact', path: '/contact' },
];

const RESUME_URL = '/resume.pdf';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-md">
      <nav
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="font-mono text-sm font-medium text-white transition-colors hover:text-accent"
        >
          tm<span className="text-accent">.</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'relative px-3 py-1.5 font-mono text-xs font-medium transition-colors',
                  active
                    ? 'text-white'
                    : 'text-white/50 hover:text-white'
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-[9px] left-1/2 h-px w-4 -translate-x-1/2 bg-accent shadow-[0_0_8px_rgba(54,181,160,0.6)]" />
                )}
              </Link>
            );
          })}

          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 inline-flex items-center gap-1.5 rounded border border-white/20 px-3.5 py-1.5
              font-mono text-xs font-medium text-white transition-colors hover:border-accent/50 hover:text-accent"
          >
            <FileText size={14} />
            resume
          </a>

        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-8 w-8 items-center justify-center rounded text-white/60 transition-colors hover:text-white"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300 md:hidden',
          isOpen ? 'max-h-80' : 'max-h-0'
        )}
      >
        <div className="space-y-1 px-4 pb-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                'block rounded px-3 py-2 font-mono text-xs font-medium transition-colors',
                location.pathname === item.path
                  ? 'text-accent'
                  : 'text-white/50 hover:text-white'
              )}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded border border-white/20 px-3 py-2 font-mono text-xs
              font-medium text-white transition-colors hover:border-accent/50 hover:text-accent"
          >
            <FileText size={14} />
            resume
          </a>
        </div>
      </div>
    </header>
  );
}