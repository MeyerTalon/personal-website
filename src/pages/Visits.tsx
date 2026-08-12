import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { ScrollReveal } from '../components/ScrollReveal';
import { Card } from '../components/Card';
import { cn } from '../utils/cn';

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

type DayGroup = {
  key: string;
  label: string;
  visits: Visit[];
};

function dayKey(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'unknown';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDayLabel(key: string): string {
  if (key === 'unknown') return 'unknown date';
  const [year, month, day] = key.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString('en-US', {
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

function groupByDay(visits: Visit[]): DayGroup[] {
  const map = new Map<string, Visit[]>();

  for (const visit of visits) {
    const key = dayKey(visit.timestamp);
    const list = map.get(key);
    if (list) list.push(visit);
    else map.set(key, [visit]);
  }

  return [...map.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, dayVisits]) => ({
      key,
      label: formatDayLabel(key),
      visits: dayVisits.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    }));
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

function VisitDetail({ visit }: { visit: Visit }) {
  return (
    <div className="rounded border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-3">
        <p className="font-mono text-sm text-white">{formatLocation(visit)}</p>
        <time dateTime={visit.timestamp} className="font-mono text-[10px] text-white/40 sm:text-xs">
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
    </div>
  );
}

function DayRow({
  group,
  open,
  onToggle,
}: {
  group: DayGroup;
  open: boolean;
  onToggle: () => void;
}) {
  const countLabel = group.visits.length === 1 ? '1 visit' : `${group.visits.length} visits`;

  return (
    <Card hover={false} className="overflow-hidden p-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left
          transition-colors hover:bg-white/[0.03] sm:px-5 touch-manipulation"
      >
        <div className="min-w-0">
          <p className="font-mono text-sm text-white sm:text-base">{group.label}</p>
          <p className="mt-1 font-mono text-[10px] tracking-widest text-white/40">{countLabel}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-mono text-lg text-accent">{group.visits.length}</span>
          <ChevronDown
            size={18}
            className={cn(
              'text-white/40 transition-transform duration-200',
              open && 'rotate-180 text-accent'
            )}
            aria-hidden="true"
          />
        </div>
      </button>

      {open && (
        <div className="space-y-3 border-t border-white/10 px-4 py-4 sm:px-5">
          {group.visits.map((visit) => (
            <VisitDetail key={visit.id} visit={visit} />
          ))}
        </div>
      )}
    </Card>
  );
}

export function Visits() {
  const [data, setData] = useState<VisitsResponse | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');
  const [openDay, setOpenDay] = useState<string | null>(null);

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
          const visits = Array.isArray(json.visits) ? json.visits : [];
          setData({
            total: json.total ?? 0,
            visits,
          });
          setStatus('ready');
          const groups = groupByDay(visits);
          setOpenDay(groups[0]?.key ?? null);
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

  const days = data ? groupByDay(data.visits) : [];

  return (
    <div className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            title="visits."
            subtitle="site traffic by day. click a day to expand sessions."
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
                  {days.length} day{days.length === 1 ? '' : 's'} · {data.visits.length} recent
                </p>
              </div>
            </ScrollReveal>

            {days.length === 0 ? (
              <p className="py-12 text-center text-white/50">no visits recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {days.map((group, index) => (
                  <ScrollReveal key={group.key} delay={Math.min(index, 8) * 40}>
                    <DayRow
                      group={group}
                      open={openDay === group.key}
                      onToggle={() =>
                        setOpenDay((current) => (current === group.key ? null : group.key))
                      }
                    />
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
