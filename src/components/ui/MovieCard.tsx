import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router';
import anime from 'animejs';
import { Movie } from '../../types';

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, index = 0 }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        delay: index * 100,
        duration: 200,
        easing: 'easeOutExpo'
      });
    }
  }, [index]);

  return (
    <Link to={`/detail/${movie.id}`} className="block">
      <div
        ref={cardRef}
        className="group cursor-pointer overflow-hidden rounded-lg border border-gray-100 bg-white opacity-0 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-black hover:shadow-2xl"
      >
        <div className="relative">
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-44 w-full object-cover sm:h-80"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="rounded-full bg-white px-6 py-2 font-medium text-black transition-colors hover:bg-gray-200">
              查看详情
            </span>
          </div>
        </div>
        <div className="p-3 sm:p-6">
          <h3 className="mb-2 truncate text-sm font-bold text-black sm:text-xl" title={movie.title}>{movie.title}</h3>
          <div className="flex items-center justify-between text-gray-600">
            <span className="text-xs sm:text-base">{movie.year}</span>
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500">★</span>
              <span className="text-xs sm:text-base">{movie.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};



