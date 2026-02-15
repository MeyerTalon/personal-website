import { Github, Linkedin, Mail, Heart } from 'lucide-react';

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/yourusername',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/yourusername',
    icon: Linkedin,
  },
  {
    name: 'Email',
    url: 'mailto:your.email@example.com',
    icon: Mail,
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Copyright */}
          <p className="flex items-center gap-1 text-sm text-surface-500 dark:text-surface-400">
            &copy; {currentYear} Talon Meyer. Built with
            <Heart size={14} className="text-red-500" aria-hidden="true" />
            and React.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-surface-500
                    transition-colors hover:bg-surface-100 hover:text-surface-900
                    dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-white"
                  aria-label={link.name}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
