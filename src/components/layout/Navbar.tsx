import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { cn } from '../../lib/utils';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '首页', path: '/' },
    { name: '画廊', path: '/gallery' },
    { name: '电影', path: '/list' },
    // { name: '上传', path: '/upload' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
      isScrolled || isMobileMenuOpen
        ? "bg-white/90 backdrop-blur-md border-gray-200 py-4"
        : "bg-transparent border-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold text-black">光影帧格</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "relative text-sm font-medium transition-colors duration-300 hover:text-black",
                  location.pathname === link.path ? "text-black" : "text-gray-600",
                  "after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-black after:transition-[width] after:duration-300 hover:after:w-full",
                  location.pathname === link.path && "after:w-full"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span className={cn("w-full h-0.5 bg-black transition-all duration-300", isMobileMenuOpen && "rotate-45 translate-y-1.5")}></span>
              <span className={cn("w-full h-0.5 bg-black transition-all duration-300", isMobileMenuOpen && "opacity-0")}></span>
              <span className={cn("w-full h-0.5 bg-black transition-all duration-300", isMobileMenuOpen && "-rotate-45 -translate-y-1.5")}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isMobileMenuOpen ? "max-h-48 opacity-100 mt-4" : "max-h-0 opacity-0"
        )}>
          <div className="flex flex-col space-y-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-gray-600 hover:text-black font-medium",
                  location.pathname === link.path && "text-black"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};



