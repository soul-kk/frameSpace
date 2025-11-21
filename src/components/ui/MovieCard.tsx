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
    <div
      ref={cardRef}
      className="group bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 hover:border-black opacity-0"
    >
      <div className="relative">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-80 object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            to={`/detail/${movie.id}`}
            className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors"
          >
            查看详情
          </Link>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-black mb-2 truncate" title={movie.title}>{movie.title}</h3>
        <div className="flex items-center justify-between text-gray-600">
          <span>{movie.year}</span>
          <div className="flex items-center space-x-1">
            <span className="text-yellow-500">★</span>
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};



