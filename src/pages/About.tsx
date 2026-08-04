import { Briefcase, GraduationCap, FlaskConical, Users } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { ScrollReveal } from '../components/ScrollReveal';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { skills, skillCategories } from '../data/skills';
import { experiences, research, leadership, education } from '../data/experience';
import type { Experience } from '../types/index';

function Timeline({
  items,
  icon: Icon,
}: {
  items: Experience[];
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative space-y-8 before:absolute before:left-[17px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-white/20 sm:before:left-[21px]">
        {items.map((item, index) => (
          <ScrollReveal key={item.id} delay={index * 150}>
            <div className="relative pl-12 sm:pl-14">
              <div className="absolute left-0 top-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black sm:h-11 sm:w-11">
                <Icon size={16} className="text-white/70" />
              </div>

              <Card hover={false}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      {item.role}
                    </h3>
                    <p className="text-sm font-medium text-white/60">
                      {item.company}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white/60">
                    {item.startDate} — {item.endDate}
                  </span>
                </div>

                <ul className="mt-4 space-y-2">
                  {item.description.map((line, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-white/60"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/40" />
                      {line}
                    </li>
                  ))}
                </ul>

                {item.techStack && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.techStack.map((tech) => (
                      <Badge key={tech} variant="outline" className="border-white/20 text-white/70">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

export function About() {
  return (
    <div className="py-16">
      {/* bio */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            title="about me."
          />
        </ScrollReveal>

        <ScrollReveal>
          <div className="mx-auto max-w-3xl">
            <p className="text-lg leading-relaxed text-white/60">
              i'm a machine learning engineer and researcher studying
              electrical engineering and computer science at uc berkeley. i
              currently work at adaptive security, a cybersecurity company, and
              my broader work spans building production ml pipelines, training
              computer vision models, and shipping full-stack applications. from
              llm-powered automation at rippling to real-time methane detection
              research at berkeley's b.e.s.t. lab, i care about building
              intelligent, production-grade systems.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-white/60">
              as president of generative ai at berkeley, i lead the largest
              student organization in the u.s. focused on generative ai,
              partnering with companies like google and netflix to run technical
              projects and events.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-white/60">
              outside of work and academia, i love surfing, snowboarding, learning spanish,
              and am an avid consumers of stories (both literary and cinematic). originally
              from san diego (socal {'>>>'} norcal), i now live in the bay area. btw free tay-k
              (he ain't even do nothin).
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* skills */}
      <section className="mt-20 border-t border-white/10 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading title="skills & technologies." />
          </ScrollReveal>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {skillCategories.map((category, catIndex) => {
              const categorySkills = skills.filter((s) => s.category === category);
              return (
                <ScrollReveal key={category} delay={catIndex * 100}>
                  <Card hover={false} className="h-full">
                    <h3 className="mb-4 text-lg font-medium text-white">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <Badge key={skill.name} variant="outline" className="border-white/20 text-white/70">
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

      {/* experience */}
      <section className="mt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading title="experience." />
          </ScrollReveal>
          <Timeline items={experiences} icon={Briefcase} />
        </div>
      </section>

      {/* research */}
      <section className="mt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading title="research." />
          </ScrollReveal>
          <Timeline items={research} icon={FlaskConical} />
        </div>
      </section>

      {/* leadership */}
      <section className="mt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading title="leadership." />
          </ScrollReveal>
          <Timeline items={leadership} icon={Users} />
        </div>
      </section>

      {/* education */}
      <section className="mt-20 pb-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading title="education." />
          </ScrollReveal>

          <div className="mx-auto max-w-3xl">
            <div className="relative space-y-6 before:absolute before:left-[17px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-white/20 sm:before:left-[21px]">
              {education.map((edu, index) => (
                <ScrollReveal key={edu.id} delay={index * 150}>
                  <div className="relative pl-12 sm:pl-14">
                    <div className="absolute left-0 top-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black sm:h-11 sm:w-11">
                      <GraduationCap size={16} className="text-white/70" />
                    </div>

                    <Card hover={false}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-medium text-white">
                            {edu.degree} in {edu.field}
                          </h3>
                          <p className="text-sm font-medium text-white/60">
                            {edu.institution}
                          </p>
                        </div>
                        <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white/60">
                          {edu.startDate} — {edu.endDate}
                        </span>
                      </div>
                      {edu.description && (
                        <p className="mt-3 text-sm text-white/60">
                          {edu.description}
                        </p>
                      )}
                    </Card>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
