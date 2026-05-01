import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header';

const PAGE_BG = {
  '/contact':     '#ffffff',
  '/help-center': '#0D1F3C',
  '/privacy':     '#F2F0EC',
  '/terms':       '#F2F0EC',
};

const Layout = ({ children }) => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isContact = location.pathname === '/contact';
  const [heroTypingDone, setHeroTypingDone] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(!isLanding);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [heroEverCompleted, setHeroEverCompleted] = useState(false);

  useEffect(() => {
    if (!isLanding) {
      setHeroTypingDone(true);
      setHeaderVisible(true);
      return;
    }

    if (heroEverCompleted) {
      setHeroTypingDone(true);
      setHeaderVisible(true);
      return;
    }

    setHeroTypingDone(false);
    setHeaderVisible(false);

    const onTypingDone = () => {
      setHeroTypingDone(true);
      setHeroEverCompleted(true);
      setHeaderVisible(true);
    };
    window.addEventListener('hero-typing-done', onTypingDone);
    return () => window.removeEventListener('hero-typing-done', onTypingDone);
  }, [isLanding, heroEverCompleted]);

  const handleScroll = useCallback(() => {
    if (!heroTypingDone) return;
    if (isContact) { setHeaderVisible(true); return; }
    const currentY = window.scrollY;
    setHeaderVisible(currentY <= 50 || currentY < lastScrollY);
    setLastScrollY(currentY);
  }, [isLanding, isContact, lastScrollY, heroTypingDone]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: PAGE_BG[location.pathname] ?? '#0D1F3C' }}>
      <Header visible={headerVisible} />
      <main className="w-full flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
