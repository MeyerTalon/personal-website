import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, Linkedin, ChevronDown } from 'lucide-react';
import { Button } from '../components/Button';
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
      {/* Hero Section */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-surface-50 dark:from-surface-900 dark:via-surface-900 dark:to-primary-950" />
          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-primary-200/30 blur-3xl dark:bg-primary-800/20" />
          <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-primary-100/40 blur-3xl dark:bg-primary-900/20" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Greeting */}
            <div
              className={`transition-all duration-700 ${
                showContent
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
            >
              <span className="inline-block rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                Welcome to my portfolio
              </span>
            </div>

            {/* Name */}
            <h1
              className={`mt-6 text-5xl font-extrabold tracking-tight text-surface-900 transition-all delay-200 duration-700 dark:text-white sm:text-6xl lg:text-7xl ${
                showContent
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
            >
              Hi, I'm{' '}
              <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-300">
                Talon Meyer
              </span>
            </h1>

            {/* Tagline */}
            <p
              className={`mt-6 text-xl leading-relaxed text-surface-600 transition-all delay-300 duration-700 dark:text-surface-300 sm:text-2xl ${
                showContent
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
            >
              A <strong className="text-surface-900 dark:text-white">full-stack developer</strong>{' '}
              passionate about building elegant, performant, and user-friendly web applications.
            </p>

            {/* CTA Buttons */}
            <div
              className={`mt-10 flex flex-wrap gap-4 transition-all delay-500 duration-700 ${
                showContent
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
            >
              <Link to="/projects">
                <Button variant="primary" size="lg">
                  View My Work
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Get in Touch
                </Button>
              </Link>
            </div>

            {/* Social Links */}
            <div
              className={`mt-10 flex items-center gap-4 transition-all delay-600 duration-700 ${
                showContent
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
            >
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-surface-500
                  transition-colors hover:bg-surface-100 hover:text-surface-900
                  dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-white"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-surface-500
                  transition-colors hover:bg-surface-100 hover:text-surface-900
                  dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={24} className="text-surface-400 dark:text-surface-500" />
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-surface-900 dark:text-white sm:text-4xl">
                Featured Projects
              </h2>
              <p className="mt-4 text-lg text-surface-500 dark:text-surface-400">
                A selection of projects I've built recently
              </p>
              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary-500" />
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <ScrollReveal key={project.id} delay={index * 100}>
                <Card className="flex h-full flex-col">
                  {/* Gradient placeholder for project image */}
                  <div className="mb-4 h-40 rounded-lg bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/20 dark:to-surface-700" />
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-surface-500 dark:text-surface-400">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="primary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="mt-12 text-center">
              <Link to="/projects">
                <Button variant="outline" size="lg">
                  View All Projects
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Quick About Section */}
      <section className="bg-surface-50 py-20 dark:bg-surface-800/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <ScrollReveal animation="slide-in-left">
              <div>
                <h2 className="text-3xl font-bold text-surface-900 dark:text-white sm:text-4xl">
                  A bit about me
                </h2>
                <div className="mt-4 h-1 w-16 rounded-full bg-primary-500" />
                <p className="mt-6 text-lg leading-relaxed text-surface-600 dark:text-surface-300">
                  I'm a full-stack developer with a passion for creating clean, efficient, and
                  user-centric digital experiences. With expertise across the modern web stack,
                  I bring ideas to life through thoughtful code and design.
                </p>
                <div className="mt-8">
                  <Link to="/about">
                    <Button variant="primary">
                      Learn More About Me
                      <ArrowRight size={18} />
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-in-right">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Years Experience', value: '5+' },
                  { label: 'Projects Completed', value: '20+' },
                  { label: 'Technologies', value: '15+' },
                  { label: 'Coffee Cups', value: '∞' },
                ].map((stat) => (
                  <Card key={stat.label} hover={false} className="text-center">
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-sm text-surface-500 dark:text-surface-400">
                      {stat.label}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
