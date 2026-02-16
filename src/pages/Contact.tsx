import { useState, type FormEvent } from 'react';
import { Mail, Send, MapPin } from 'lucide-react';
import { GitHubIcon, LinkedInIcon } from '../components/BrandIcons';
import { SectionHeading } from '../components/SectionHeading';
import { ScrollReveal } from '../components/ScrollReveal';
import { Card } from '../components/Card';

const contactInfo = [
  {
    icon: Mail,
    label: 'email',
    value: 'talon_meyer@berkeley.edu',
    href: 'mailto:your.email@example.com',
  },
  {
    icon: MapPin,
    label: 'location',
    value: 'berkeley, ca',
    href: undefined,
  },
];

const socialLinks = [
  {
    icon: GitHubIcon,
    label: 'github',
    value: 'github.com/MeyerTalon',
    href: 'https://github.com/MeyerTalon',
  },
  {
    icon: LinkedInIcon,
    label: 'linkedin',
    value: 'linkedin.com/in/talon-meyer',
    href: 'https://linkedin.com/in/talon-meyer',
  },
];

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  }

  return (
    <div className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            title="get in touch."
            subtitle="have a question or want to work together? i'd love to hear from you."
          />
        </ScrollReveal>

        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <ScrollReveal animation="slide-in-left">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white">
                    contact.
                  </h3>
                  <p className="mt-2 text-white/60">
                    reach out through any of these channels.
                  </p>
                </div>

                <div className="space-y-4">
                  {contactInfo.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-white/20 text-white/70">
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-white/50">
                            {item.label}
                          </p>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="text-sm font-medium text-white transition-colors hover:text-white/80"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-sm font-medium text-white">
                              {item.value}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <hr className="border-white/10" />

                <div>
                  <h3 className="text-lg font-medium text-white">
                    profiles.
                  </h3>
                  <div className="mt-4 space-y-3">
                    {socialLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/5"
                        >
                          <Icon size={18} className="text-white/50" />
                          <div>
                            <p className="text-sm font-medium text-white">
                              {link.label}
                            </p>
                            <p className="text-xs text-white/50">
                              {link.value}
                            </p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-3">
            <ScrollReveal animation="slide-in-right">
              <Card hover={false}>
                {submitted && (
                  <div className="mb-6 rounded-lg border border-white/20 p-4 text-sm text-white/80">
                    thanks for your message. i'll get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-white/70">
                        name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm
                          text-white placeholder-white/40 transition-colors
                          focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
                        placeholder="your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/70">
                        email
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm
                          text-white placeholder-white/40 transition-colors
                          focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-white/70">
                      subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm
                        text-white placeholder-white/40 transition-colors
                        focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
                      placeholder="what's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-white/70">
                      message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full resize-none rounded-lg border border-white/20 bg-white/5 px-4 py-2.5
                        text-sm text-white placeholder-white/40 transition-colors
                        focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
                      placeholder="tell me about your project or idea..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                  >
                    <Send size={16} />
                    send
                  </button>
                </form>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
