import { useMemo, useState } from 'react';
import { GitHubIcon } from '../components/BrandIcons';
import { SectionHeading } from '../components/SectionHeading';
import { ScrollReveal } from '../components/ScrollReveal';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { projects } from '../data/projects';
import { cn } from '../utils/cn';

export function Projects() {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const allTechs = useMemo(() => {
    const techs = new Set<string>();
    projects.forEach((p) => p.techStack.forEach((t) => techs.add(t)));
    return ['All', ...Array.from(techs).sort()];
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter((p) => p.techStack.includes(activeFilter));
  }, [activeFilter]);

  return (
    <div className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            title="projects."
            subtitle="a collection of projects i've worked on, from full-stack applications to developer tools."
          />
        </ScrollReveal>

        <ScrollReveal>
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {allTechs.map((tech) => (
              <button
                key={tech}
                onClick={() => setActiveFilter(tech)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm font-medium transition-all',
                  activeFilter === tech
                    ? 'border-white/40 bg-white/10 text-white'
                    : 'border-white/20 text-white/60 hover:border-white/30 hover:text-white'
                )}
              >
                {tech}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <ScrollReveal key={project.id} delay={index * 80}>
              <Card className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-medium text-white">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <span className="rounded border border-white/20 px-2 py-0.5 text-xs text-white/60">
                      featured
                    </span>
                  )}
                </div>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">
                  {project.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="outline" className="border-white/20 text-white/70">
                      {tech}
                    </Badge>
                  ))}
                </div>

                {project.githubUrl && (
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white"
                    >
                      <GitHubIcon size={14} />
                      view on github
                    </a>
                  </div>
                )}
              </Card>
            </ScrollReveal>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-white/60">
              no projects found with this technology. try a different filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
