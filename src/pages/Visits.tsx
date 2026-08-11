import { useEffect, useState } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { ScrollReveal } from '../components/ScrollReveal';
import { Card } from '../components/Card';

type Visit = {
  id: string;
  timestamp: string;
  ip: string;
  city: string | null;
  region: string | null;
  country: string | null;
  latitude: string | null;
  longitude: string | null;
  userAgent: string | null;
  path: string | null;
  referrer: string | null;
  language: string | null;
  screen: string | null;
};

type VisitsResponse = {
  total: number;
  visits: Visit[];
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });
}

function formatLocation(visit: Visit): string {
  const parts = [visit.city, visit.region, visit.country].filter(Boolean);
  if (parts.length === 0) return 'unknown';
  return parts.join(', ');
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
      <dt className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-white/35 sm:w-24">
        {label}
      </dt>
      <dd className="break-all font-mono text-xs text-white/70 sm:text-sm">{value}</dd>
    </div>
  );
}

export function Visits() {
  const [data, setData] = useState<VisitsResponse | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus('loading');
      setError('');
      try {
        const res = await fetch('/api/visits');
        const json = (await res.json().catch(() => ({}))) as VisitsResponse & {
          error?: string;
        };

        if (!res.ok) {
          if (!cancelled) {
            setStatus('error');
            setError(
              typeof json.error === 'string' ? json.error : 'failed to load visits.'
            );
          }
          return;
        }

        if (!cancelled) {
          setData({
            total: json.total ?? 0,
            visits: Array.isArray(json.visits) ? json.visits : [],
          });
          setStatus('ready');
        }
      } catch {
        if (!cancelled) {
          setStatus('error');
          setError('network error. try again.');
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            title="visits."
            subtitle="site traffic log. one entry per browser session."
          />
        </ScrollReveal>

        {status === 'loading' && (
          <p className="text-center font-mono text-sm text-white/40">loading…</p>
        )}

        {status === 'error' && (
          <p className="text-center font-mono text-sm text-white/50">{error}</p>
        )}

        {status === 'ready' && data && (
          <>
            <ScrollReveal>
              <div className="mb-10 flex flex-col items-center gap-2">
                <p className="font-mono text-4xl text-accent sm:text-5xl">
                  {data.total.toLocaleString()}
                </p>
                <p className="font-mono text-xs tracking-widest text-white/40">
                  total visits
                </p>
                <p className="mt-1 font-mono text-[10px] text-white/30">
                  showing {data.visits.length} most recent
                </p>
              </div>
            </ScrollReveal>

            {data.visits.length === 0 ? (
              <p className="py-12 text-center text-white/50">no visits recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {data.visits.map((visit, index) => (
                  <ScrollReveal key={visit.id} delay={Math.min(index, 8) * 40}>
                    <Card hover={false} className="p-4 sm:p-5">
                      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-3">
                        <p className="font-mono text-sm text-white">
                          {formatLocation(visit)}
                        </p>
                        <time
                          dateTime={visit.timestamp}
                          className="font-mono text-[10px] text-white/40 sm:text-xs"
                        >
                          {formatTime(visit.timestamp)}
                        </time>
                      </div>
                      <dl className="space-y-2.5">
                        <MetaRow label="ip" value={visit.ip} />
                        <MetaRow label="path" value={visit.path ?? '—'} />
                        <MetaRow label="referrer" value={visit.referrer || 'direct'} />
                        <MetaRow label="language" value={visit.language ?? '—'} />
                        <MetaRow label="screen" value={visit.screen ?? '—'} />
                        {(visit.latitude || visit.longitude) && (
                          <MetaRow
                            label="coords"
                            value={`${visit.latitude ?? '?'}, ${visit.longitude ?? '?'}`}
                          />
                        )}
                        <MetaRow label="ua" value={visit.userAgent ?? '—'} />
                      </dl>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
