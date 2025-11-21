import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const MainLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-primary font-sans antialiased">
      <Navbar />
      <main className="grow relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

