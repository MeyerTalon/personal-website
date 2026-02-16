import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GitHubIcon, LinkedInIcon } from '../components/BrandIcons';
import { ParticleNetwork } from '../components/ParticleNetwork';
import { TransformerActivation } from '../components/TransformerActivation';
import { TypingEffect } from '../components/TypingEffect';
import { ScrollReveal } from '../components/ScrollReveal';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { projects } from '../data/projects';

export function Landing() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <>
      {/* hero */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
        <TransformerActivation />
        <ParticleNetwork />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1
              className={`bg-gradient-to-b from-white to-white/70 bg-clip-text text-4xl font-semibold tracking-tight text-transparent leading-[1.1] transition-all duration-700 sm:text-5xl lg:text-6xl ${
                showContent ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
            >
              talon meyer.
            </h1>

            <div
              className={`mt-5 h-8 transition-all delay-150 duration-700 ${
                showContent ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
            >
              <TypingEffect
                text="machine learning engineer & full-stack developer."
                speed={30}
                delay={800}
                className="font-mono text-sm text-accent sm:text-base"
              />
            </div>

            <div
              className={`mt-8 flex flex-wrap items-center gap-5 transition-all delay-300 duration-700 ${
                showContent ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
            >
              <Link
                to="/projects"
                className="group relative font-mono text-sm font-medium text-white"
              >
                view work
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                to="/contact"
                className="group relative font-mono text-sm font-medium text-white"
              >
                contact
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>

              <span className="h-4 w-px bg-white/20" aria-hidden="true" />

              <a
                href="https://github.com/MeyerTalon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 transition-all duration-200 hover:text-accent"
                aria-label="GitHub"
              >
                <GitHubIcon size={20} />
              </a>
              <a
                href="https://linkedin.com/in/talon-meyer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 transition-all duration-200 hover:text-accent"
                aria-label="LinkedIn"
              >
                <LinkedInIcon size={20} />
              </a>
            </div>
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
                      <Badge key={tech} variant="outline" className="border-white/10 text-white/60">
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
