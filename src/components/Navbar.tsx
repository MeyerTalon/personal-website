import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, FileText } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../utils/cn';
import type { NavItem } from '../types';

const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Projects', path: '/projects' },
  { label: 'Contact', path: '/contact' },
];

const RESUME_URL = 'https://drive.google.com/file/d/your-resume-id/view';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header
      className="sticky top-0 z-50 border-b border-surface-200/80 bg-white/80
        backdrop-blur-lg dark:border-surface-700/80 dark:bg-surface-900/80"
    >
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-surface-900 transition-colors hover:text-primary-600
            dark:text-white dark:hover:text-primary-400"
        >
          TM<span className="text-primary-500">.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                location.pathname === item.path
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-white'
              )}
            >
              {item.label}
            </Link>
          ))}

          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2
              text-sm font-medium text-white transition-colors hover:bg-primary-700
              dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            <FileText size={16} />
            Resume
          </a>

          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-surface-600
              transition-colors hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
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
                'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                location.pathname === item.path
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800'
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
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-3 py-2.5 text-sm
              font-medium text-white transition-colors hover:bg-primary-700
              dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            <FileText size={16} />
            Resume
          </a>
        </div>
      </div>
    </header>
  );
}
