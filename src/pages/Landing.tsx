import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GitHubIcon, LinkedInIcon } from '../components/BrandIcons';
import { LLMPipeline } from '../components/LLMPipeline';
import type { LLMPhase } from '../components/LLMPipeline';
import { ScrollReveal } from '../components/ScrollReveal';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { projects } from '../data/projects';

export function Landing() {
  const [showLinks, setShowLinks] = useState(false);
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  function handlePhase(p: LLMPhase) {
    setShowLinks(p === 'output' || p === 'idle');
  }

  return (
    <>
      {/* hero */}
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <LLMPipeline onPhaseChange={handlePhase} />

        {/* Navigation + hero caption – appear after animation */}
        <div
          className={`absolute bottom-10 left-8 z-20 max-w-md transition-all duration-700 ${
            showLinks ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          {/* Compact caption for quick readability */}
          <div className="mb-3">
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-accent/80">
              talon meyer
            </div>
            <p className="mt-1 text-xs text-white/60">
              machine learning engineer &amp; full-stack developer.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <Link
              to="/projects"
              className="group relative font-mono text-sm font-medium text-white pointer-events-auto"
            >
              view work
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              to="/contact"
              className="group relative font-mono text-sm font-medium text-white pointer-events-auto"
            >
              contact
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>

            <span className="h-4 w-px bg-white/20" aria-hidden="true" />

            <a
              href="https://github.com/MeyerTalon"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 transition-all duration-200 hover:text-accent pointer-events-auto"
              aria-label="GitHub"
            >
              <GitHubIcon size={20} />
            </a>
            <a
              href="https://linkedin.com/in/talon-meyer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 transition-all duration-200 hover:text-accent pointer-events-auto"
              aria-label="LinkedIn"
            >
              <LinkedInIcon size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* featured work */}
      <section className="border-t border-white/[0.06] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-mono text-xs font-medium tracking-widest text-accent">
              featured work.
            </h2>
          </ScrollReveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <ScrollReveal key={project.id} delay={index * 80}>
                <Card className="flex h-full flex-col">
                  <h3 className="text-base font-medium text-white">
                    {project.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/50">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="border-white/10 text-white/60"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="mt-10">
              <Link
                to="/projects"
                className="group relative font-mono text-xs font-medium text-white/60 transition-colors hover:text-white"
              >
                view all projects →
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* about */}
      <section className="border-t border-white/[0.06] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <ScrollReveal>
              <h2 className="font-mono text-xs font-medium tracking-widest text-accent">
                about.
              </h2>
              <p className="mt-5 text-white/50 leading-relaxed">
                machine learning engineer and full-stack developer building
                intelligent, production-grade systems — from llm pipelines to
                real-time computer vision.
              </p>
              <Link
                to="/about"
                className="group relative mt-5 inline-block font-mono text-xs font-medium text-white/60 transition-colors hover:text-white"
              >
                more about me →
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
