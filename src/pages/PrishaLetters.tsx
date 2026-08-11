import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { ScrollReveal } from '../components/ScrollReveal';
import { letters } from '../data/letters';
import type { Letter } from '../types/index';

function formatDate(iso: string): string {
  // Parse YYYY-MM-DD as a local calendar date (avoid UTC midnight shifting the day).
  const [year, month, day] = iso.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function LetterCard({
  letter,
  onOpen,
}: {
  letter: Letter;
  onOpen: (letter: Letter) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(letter)}
      className="group relative mx-auto w-full max-w-[280px] touch-manipulation text-left
        focus-visible:outline-none"
      aria-label={`Open letter: ${letter.title}`}
    >
      {/* envelope body */}
      <div
        className="relative aspect-[5/3.4] overflow-hidden rounded-sm border border-[#c4b9a8]/40
          bg-[#d9d0c2] shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-all duration-300
          active:scale-[0.98] group-hover:-translate-y-1.5 group-hover:border-accent/40
          group-hover:shadow-[0_18px_48px_rgba(54,181,160,0.18)]
          group-active:border-accent/40"
      >
        {/* paper flap (triangle) */}
        <div
          className="absolute inset-x-0 top-0 z-10 h-[46%] origin-top transition-transform duration-300
            group-hover:scale-y-[1.02]"
          style={{
            background:
              'linear-gradient(180deg, #ebe4d6 0%, #d4c9b8 100%)',
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
          aria-hidden="true"
        />

        {/* flap crease line */}
        <div
          className="absolute inset-x-[8%] top-[44%] z-0 h-px bg-[#b8ad9a]/70"
          aria-hidden="true"
        />

        {/* address area — extra right padding so seal doesn't cover title */}
        <div className="absolute inset-x-0 bottom-0 z-[5] flex h-[54%] flex-col justify-end px-4 pb-3.5 pr-12 pt-5 sm:px-5 sm:pb-4 sm:pt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6b6256]">
            to prisha
          </p>
          <h2 className="mt-1 font-mono text-sm font-medium leading-snug text-[#2a2620] line-clamp-2">
            {letter.title}
          </h2>
          <time
            dateTime={letter.date}
            className="mt-2 font-mono text-[10px] text-[#6b6256]/80"
          >
            {formatDate(letter.date)}
          </time>
        </div>

        {/* wax seal accent */}
        <div
          className="absolute bottom-3 right-3 z-10 flex h-7 w-7 items-center justify-center
            rounded-full bg-accent/90 text-[10px] font-mono font-bold text-[#0a0a0a]
            shadow-[0_2px_8px_rgba(54,181,160,0.4)] transition-transform duration-300
            group-hover:scale-110"
          aria-hidden="true"
        >
          tm
        </div>
      </div>

      <p className="mt-3 text-center font-mono text-[10px] tracking-widest text-white/30
        transition-colors group-hover:text-accent/70 group-active:text-accent/70">
        open letter →
      </p>
    </button>
  );
}

function LetterModal({
  letter,
  onClose,
}: {
  letter: Letter;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const paragraphs = letter.content?.split(/\n\n+/).filter(Boolean) ?? [];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="letter-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-fade-in"
        aria-label="Close letter"
        onClick={onClose}
      />

      <article
        className="relative z-10 flex max-h-[min(92dvh,720px)] w-full max-w-lg flex-col
          overflow-hidden rounded-t-2xl border border-[#c4b9a8]/30 bg-[#efe8da] shadow-2xl
          animate-fade-in-up sm:rounded-sm"
      >
        {/* sticky header with close — keeps X reachable while scrolling */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#c4b9a8]/40
          px-5 pb-4 pt-5 sm:px-10 sm:pb-5 sm:pt-8">
          <div className="min-w-0 flex-1 pr-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6b6256]">
              a letter for prisha
            </p>
            <h2
              id="letter-title"
              className="mt-2 break-words font-mono text-lg font-medium text-[#2a2620] sm:text-2xl"
            >
              {letter.title}
            </h2>
            <time
              dateTime={letter.date}
              className="mt-1.5 block font-mono text-xs text-[#6b6256]/80"
            >
              {formatDate(letter.date)}
            </time>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full
              text-[#6b6256] transition-colors hover:bg-black/5 hover:text-[#2a2620]
              active:bg-black/10 touch-manipulation"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-10 sm:py-8">
          {letter.image && (
            <img
              src={letter.image}
              alt={letter.title}
              className="mx-auto w-full max-w-md rounded-sm border border-[#c4b9a8]/40
                shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
            />
          )}

          {paragraphs.length > 0 && (
            <div className={`space-y-4 ${letter.image ? 'mt-6' : ''}`}>
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="whitespace-pre-wrap text-[15px] leading-relaxed text-[#3a342c]"
                >
                  {p}
                </p>
              ))}
            </div>
          )}

          <p className="mt-8 pb-[max(0.5rem,env(safe-area-inset-bottom))] font-mono text-xs text-[#6b6256]">
            — talon
          </p>
        </div>
      </article>
    </div>
  );
}

export function PrishaLetters() {
  const [openLetter, setOpenLetter] = useState<Letter | null>(null);

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            title="letters for prisha."
            subtitle="open an envelope to read."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
          {letters.map((letter, index) => (
            <ScrollReveal key={letter.id} delay={index * 80} className="w-full max-w-[280px]">
              <LetterCard letter={letter} onOpen={setOpenLetter} />
            </ScrollReveal>
          ))}
        </div>

        {letters.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-white/60">no letters yet.</p>
          </div>
        )}
      </div>

      {openLetter && (
        <LetterModal letter={openLetter} onClose={() => setOpenLetter(null)} />
      )}
    </div>
  );
}
