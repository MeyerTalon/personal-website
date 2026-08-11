import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SESSION_KEY = 'visit_tracked';

function shouldSkipPath(pathname: string): boolean {
  return pathname === '/visits' || pathname.startsWith('/visits/');
}

export function useVisitTracker(): void {
  const location = useLocation();

  useEffect(() => {
    if (shouldSkipPath(location.pathname)) return;
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    sessionStorage.setItem(SESSION_KEY, '1');

    const payload = {
      path: `${location.pathname}${location.search}`,
      referrer: document.referrer || null,
      language: navigator.language || null,
      screen: `${window.screen.width}x${window.screen.height}`,
    };

    void fetch('/api/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // tracking should never break the site
      sessionStorage.removeItem(SESSION_KEY);
    });
  }, [location.pathname, location.search]);
}
