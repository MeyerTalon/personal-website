import { useState, type FormEvent } from 'react';
import { Mail, Github, Linkedin, Twitter, Send, MapPin } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { ScrollReveal } from '../components/ScrollReveal';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'your.email@example.com',
    href: 'mailto:your.email@example.com',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'San Francisco, CA',
    href: undefined,
  },
];

const socialLinks = [
  {
    icon: Github,
    label: 'GitHub',
    value: 'github.com/yourusername',
    href: 'https://github.com/yourusername',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/yourusername',
    href: 'https://linkedin.com/in/yourusername',
  },
  {
    icon: Twitter,
    label: 'Twitter / X',
    value: '@yourusername',
    href: 'https://twitter.com/yourusername',
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
    // In production, wire this up to a form backend (e.g., Formspree, EmailJS)
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
            title="Get in Touch"
            subtitle="Have a question or want to work together? I'd love to hear from you."
          />
        </ScrollReveal>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Contact Info */}
          <div className="lg:col-span-2">
            <ScrollReveal animation="slide-in-left">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                    Contact Information
                  </h3>
                  <p className="mt-2 text-surface-500 dark:text-surface-400">
                    Feel free to reach out through any of these channels.
                  </p>
                </div>

                <div className="space-y-4">
                  {contactInfo.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-surface-500 dark:text-surface-400">
                            {item.label}
                          </p>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="text-sm font-medium text-surface-900 transition-colors hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-sm font-medium text-surface-900 dark:text-white">
                              {item.value}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <hr className="border-surface-200 dark:border-surface-700" />

                <div>
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                    Social Links
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
                          className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-surface-50 dark:hover:bg-surface-800"
                        >
                          <Icon
                            size={18}
                            className="text-surface-500 dark:text-surface-400"
                          />
                          <div>
                            <p className="text-sm font-medium text-surface-900 dark:text-white">
                              {link.label}
                            </p>
                            <p className="text-xs text-surface-500 dark:text-surface-400">
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

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <ScrollReveal animation="slide-in-right">
              <Card hover={false}>
                {submitted && (
                  <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    Thank you for your message! I'll get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm
                          text-surface-900 placeholder-surface-400 transition-colors
                          focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
                          dark:border-surface-600 dark:bg-surface-700 dark:text-white
                          dark:placeholder-surface-500 dark:focus:border-primary-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm
                          text-surface-900 placeholder-surface-400 transition-colors
                          focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
                          dark:border-surface-600 dark:bg-surface-700 dark:text-white
                          dark:placeholder-surface-500 dark:focus:border-primary-500"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm
                        text-surface-900 placeholder-surface-400 transition-colors
                        focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
                        dark:border-surface-600 dark:bg-surface-700 dark:text-white
                        dark:placeholder-surface-500 dark:focus:border-primary-500"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full resize-none rounded-lg border border-surface-300 bg-white px-4 py-2.5
                        text-sm text-surface-900 placeholder-surface-400 transition-colors
                        focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
                        dark:border-surface-600 dark:bg-surface-700 dark:text-white
                        dark:placeholder-surface-500 dark:focus:border-primary-500"
                      placeholder="Tell me about your project or idea..."
                    />
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
                    <Send size={16} />
                    Send Message
                  </Button>
                </form>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
