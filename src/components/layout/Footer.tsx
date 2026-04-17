import React from 'react';

const GithubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const Footer = () => {
  return (
    <footer className="bg-black py-12 text-white">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="mb-4 flex items-center justify-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <div className="h-3 w-3 rounded-full bg-black"></div>
          </div>
          <span className="text-xl font-bold">光影帧格</span>
        </div>
        <p className="mb-4 text-sm text-gray-500">
          © 2026 记录我最喜爱的电影与摄影，怀着对电影与摄影的热情精心制作。
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a
            href="https://github.com/soul-kk/frameSpace"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-gray-600 transition-colors duration-200 hover:text-gray-300"
            aria-label="GitHub 项目地址"
          >
            <GithubIcon />
            <span className="text-xs">soul-kk/frameSpace</span>
          </a>
          <a
            href="mailto:2986744287@qq.com"
            className="inline-flex items-center gap-1.5 text-gray-600 transition-colors duration-200 hover:text-gray-300"
            aria-label="联系我"
          >
            <MailIcon />
            <span className="text-xs">Contact me</span>
          </a>
        </div>
      </div>
    </footer>
  );
};



