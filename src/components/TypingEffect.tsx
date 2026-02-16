import { useEffect, useRef, useState } from 'react';

interface TypingEffectProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}

export function TypingEffect({
  text,
  speed = 40,
  delay = 600,
  className,
}: TypingEffectProps) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      timerRef.current = setTimeout(() => setDisplayed(text), 0);
      return;
    }

    function typeNext() {
      if (indexRef.current < text.length) {
        indexRef.current += 1;
        setDisplayed(text.slice(0, indexRef.current));
        timerRef.current = setTimeout(typeNext, speed);
      }
    }

    timerRef.current = setTimeout(typeNext, delay);

    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [text, speed, delay]);

  const done = displayed.length >= text.length;

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="typing-cursor" />}
    </span>
  );
}
