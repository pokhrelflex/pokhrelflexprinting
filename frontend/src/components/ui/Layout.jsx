import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header';

const PAGE_BG = {
  '/contact':     '#ffffff',
  '/help-center': '#003A4D',
  '/privacy':     '#F2F0EC',
  '/terms':       '#F2F0EC',
};

const Layout = ({ children }) => {
  const location = useLocation();
  const isContact = location.pathname === '/contact';
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    if (isContact) { setHeaderVisible(true); return; }
    const currentY = window.scrollY;
    setHeaderVisible(currentY <= 50 || currentY < lastScrollY);
    setLastScrollY(currentY);
  }, [isContact, lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: PAGE_BG[location.pathname] ?? '#003A4D' }}>
      <Header visible={headerVisible} />
      <main className="w-full flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
