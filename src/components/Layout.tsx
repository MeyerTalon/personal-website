import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.tsx';
import { Footer } from './Footer.tsx';
import { useVisitTracker } from '../hooks/useVisitTracker';

export function Layout() {
  useVisitTracker();

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
