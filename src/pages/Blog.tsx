import { Link } from 'react-router-dom';
import { SectionHeading } from '../components/SectionHeading';
import { ScrollReveal } from '../components/ScrollReveal';
import { Card } from '../components/Card';
import { blogPosts } from '../data/blog';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function Blog() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            title="blog."
            subtitle="notes, reviews, and occasional writing."
          />
        </ScrollReveal>

        <div className="mx-auto max-w-2xl space-y-6">
          {blogPosts.map((post, index) => (
            <ScrollReveal key={post.id} delay={index * 80}>
              <Link to={`/blog/${post.slug}`} className="block">
                <Card className="transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]">
                  <time
                    dateTime={post.date}
                    className="font-mono text-xs text-white/40"
                  >
                    {formatDate(post.date)}
                  </time>
                  <h2 className="mt-2 text-lg font-medium text-white">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    {post.excerpt}
                  </p>
                  <span className="mt-3 inline-block font-mono text-xs text-accent">
                    read more →
                  </span>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {blogPosts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-white/60">no posts yet. check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
