import { Link } from 'react-router-dom';
import { ScrollReveal } from '../components/ScrollReveal';

export function BlogPost() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <p className="text-xl text-white/60">coming soon.</p>
          <Link
            to="/blog"
            className="mt-6 inline-block font-mono text-sm text-accent transition-colors hover:text-accent/80"
          >
            ← back to blog
          </Link>
        </ScrollReveal>
      </div>
    </div>
  );
}
