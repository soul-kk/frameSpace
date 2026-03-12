import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-black rounded-full"></div>
          </div>
          <span className="text-xl font-bold">光影帧格</span>
        </div>
        <p className="text-sm text-gray-500 mb-4">© 2026 记录我最喜爱的电影与摄影，怀着对电影与摄影的热情精心制作。</p>
      </div>
    </footer>
  );
};



