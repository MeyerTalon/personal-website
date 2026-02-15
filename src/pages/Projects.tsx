import { useMemo, useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { ScrollReveal } from '../components/ScrollReveal';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { projects } from '../data/projects';
import { cn } from '../utils/cn';

export function Projects() {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Gather unique tech tags
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
            title="Projects"
            subtitle="A collection of projects I've worked on, from full-stack applications to developer tools"
          />
        </ScrollReveal>

        {/* Filter Tabs */}
        <ScrollReveal>
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {allTechs.map((tech) => (
              <button
                key={tech}
                onClick={() => setActiveFilter(tech)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
                  activeFilter === tech
                    ? 'bg-primary-600 text-white shadow-sm dark:bg-primary-500'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-400 dark:hover:bg-surface-700'
                )}
              >
                {tech}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Project Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <ScrollReveal key={project.id} delay={index * 80}>
              <Card className="flex h-full flex-col">
                {/* Gradient image placeholder */}
                <div className="relative mb-4 h-44 overflow-hidden rounded-lg bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/20 dark:to-surface-700">
                  {project.featured && (
                    <span className="absolute right-2 top-2 rounded-full bg-primary-600 px-2.5 py-0.5 text-xs font-medium text-white">
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                  {project.title}
                </h3>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-surface-500 dark:text-surface-400">
                  {project.description}
                </p>

                {/* Tech stack badges */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="primary">
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Links */}
                <div className="mt-5 flex items-center gap-3 border-t border-surface-100 pt-4 dark:border-surface-700">
                  {project.liveUrl && (
                    <Button
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="primary"
                      size="sm"
                    >
                      <ExternalLink size={14} />
                      Live Demo
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline"
                      size="sm"
                    >
                      <Github size={14} />
                      Code
                    </Button>
                  )}
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-surface-500 dark:text-surface-400">
              No projects found with this technology. Try a different filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
