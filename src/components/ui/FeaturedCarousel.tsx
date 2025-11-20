import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { Movie } from '../../types';
import { Link } from 'react-router';

interface FeaturedCarouselProps {
  movies: Movie[];
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ movies }) => {
  const options = {
    type: 'loop',
    perPage: 3,
    perMove: 1,
    gap: '2rem',
    autoplay: true,
    interval: 4000,
    pauseOnHover: true,
    pagination: false,
    breakpoints: {
      768: {
        perPage: 1,
      },
      1024: {
        perPage: 2,
      }
    }
  };

  if (movies.length === 0) return null;

  return (
    <div className="w-full py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-black">Featured Movies</h2>
      <Splide options={options} aria-label="Featured Movies">
        {movies.map((movie) => (
          <SplideSlide key={movie.id}>
            <Link to={`/detail/${movie.id}`} className="block relative group cursor-pointer">
              <img 
                src={movie.poster} 
                alt={movie.title} 
                className="w-full h-[400px] object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <h3 className="text-2xl font-bold mb-2">{movie.title}</h3>
                  <p className="text-sm opacity-80 line-clamp-2">{movie.description}</p>
                </div>
              </div>
            </Link>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};



