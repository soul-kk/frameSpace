import React from 'react';
import { Link } from 'react-router';

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-black rounded-full"></div>
          </div>
          <span className="text-xl font-bold">kk's favorite movies</span>
        </div>
        <p className="text-gray-400 mb-4">个人观影收藏</p>
        <p className="text-sm text-gray-500 mb-4">© 2025 记录我最喜爱的电影，怀着对电影的热情精心制作。</p>
        <Link to="/about" className="text-sm text-gray-500 hover:text-white transition-colors">
          关于本项目
        </Link>
      </div>
    </footer>
  );
};



