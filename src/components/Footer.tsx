import { Mail } from 'lucide-react';
import { GitHubIcon, LinkedInIcon } from './BrandIcons';

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/MeyerTalon',
    icon: GitHubIcon,
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/talon-meyer',
    icon: LinkedInIcon,
  },
  {
    name: 'Email',
    url: 'mailto:talon_meyer@berkeley.edu',
    icon: Mail,
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="font-mono text-xs text-white/30">
            &copy; {currentYear} talon meyer.
          </p>

          <div className="flex items-center gap-2">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded text-white/30
                    transition-all duration-200 hover:text-accent"
                  aria-label={link.name}
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
