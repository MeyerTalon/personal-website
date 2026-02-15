import { Briefcase, GraduationCap } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { ScrollReveal } from '../components/ScrollReveal';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { skills, skillCategories } from '../data/skills';
import { experiences, education } from '../data/experience';

export function About() {
  return (
    <div className="py-16">
      {/* Bio Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            title="About Me"
            subtitle="Get to know more about who I am and what drives me"
          />
        </ScrollReveal>

        <ScrollReveal>
          <div className="mx-auto max-w-3xl">
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p className="text-lg leading-relaxed text-surface-600 dark:text-surface-300">
                I'm a passionate full-stack developer with over 5 years of experience building
                modern web applications. My journey in software development started during
                university, where I discovered the power of turning ideas into functional,
                beautiful digital products.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-surface-600 dark:text-surface-300">
                I specialize in building performant, accessible, and visually compelling web
                applications using React, TypeScript, and Node.js. I'm a firm believer in clean
                code, thoughtful architecture, and continuous learning.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-surface-600 dark:text-surface-300">
                When I'm not coding, you'll find me exploring new technologies, contributing to
                open-source projects, or enjoying the outdoors. I'm always open to new
                opportunities and collaborations.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Skills Section */}
      <section className="mt-20 bg-surface-50 py-20 dark:bg-surface-800/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              title="Skills & Technologies"
              subtitle="The tools and technologies I work with"
            />
          </ScrollReveal>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {skillCategories.map((category, catIndex) => {
              const categorySkills = skills.filter((s) => s.category === category);
              return (
                <ScrollReveal key={category} delay={catIndex * 100}>
                  <Card hover={false} className="h-full">
                    <h3 className="mb-4 text-lg font-semibold text-surface-900 dark:text-white">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <Badge key={skill.name} variant="primary">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="mt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              title="Experience"
              subtitle="My professional journey so far"
            />
          </ScrollReveal>

          <div className="mx-auto max-w-3xl">
            <div className="relative space-y-8 before:absolute before:left-[17px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-surface-200 dark:before:bg-surface-700 sm:before:left-[21px]">
              {experiences.map((exp, index) => (
                <ScrollReveal key={exp.id} delay={index * 150}>
                  <div className="relative pl-12 sm:pl-14">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary-500 bg-white dark:bg-surface-900 sm:h-11 sm:w-11">
                      <Briefcase size={16} className="text-primary-600 dark:text-primary-400" />
                    </div>

                    <Card hover={false}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                            {exp.role}
                          </h3>
                          <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                            {exp.company}
                          </p>
                        </div>
                        <span className="rounded-full bg-surface-100 px-3 py-1 text-xs font-medium text-surface-600 dark:bg-surface-700 dark:text-surface-300">
                          {exp.startDate} — {exp.endDate}
                        </span>
                      </div>

                      <ul className="mt-4 space-y-2">
                        {exp.description.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-surface-600 dark:text-surface-300"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500" />
                            {item}
                          </li>
                        ))}
                      </ul>

                      {exp.techStack && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {exp.techStack.map((tech) => (
                            <Badge key={tech}>{tech}</Badge>
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="mt-20 pb-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              title="Education"
              subtitle="My academic background"
            />
          </ScrollReveal>

          <div className="mx-auto max-w-3xl">
            {education.map((edu, index) => (
              <ScrollReveal key={edu.id} delay={index * 150}>
                <div className="relative pl-12 sm:pl-14">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary-500 bg-white dark:bg-surface-900 sm:h-11 sm:w-11">
                    <GraduationCap size={16} className="text-primary-600 dark:text-primary-400" />
                  </div>

                  <Card hover={false}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                          {edu.degree} in {edu.field}
                        </h3>
                        <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                          {edu.institution}
                        </p>
                      </div>
                      <span className="rounded-full bg-surface-100 px-3 py-1 text-xs font-medium text-surface-600 dark:bg-surface-700 dark:text-surface-300">
                        {edu.startDate} — {edu.endDate}
                      </span>
                    </div>
                    {edu.description && (
                      <p className="mt-3 text-sm text-surface-600 dark:text-surface-300">
                        {edu.description}
                      </p>
                    )}
                  </Card>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
