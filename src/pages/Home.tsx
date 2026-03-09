import React, { useRef, useEffect } from 'react';
import anime from 'animejs';
import { CinemaHero } from '../components/ui/CinemaHero';
import { FeaturedCarousel } from '../components/ui/FeaturedCarousel';
import { useMovies } from '../context/MovieContext';


export const Home = () => {
  const { movies, loading } = useMovies();
  // Get top 5 movies by rating
  const featuredMovies = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 5);

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carouselRef.current) {
      anime({
        targets: carouselRef.current,
        opacity: [0, 1],
        translateY: [40, 0],
        delay: 500, // Start after hero
        duration: 800,
        easing: 'easeOutExpo'
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white relative">
      <CinemaHero />

      {/* Featured Movies Carousel */}
      <div ref={carouselRef} className="opacity-0 max-w-7xl mx-auto px-6 -mt-10 relative z-20 mb-20">
        {!loading && <FeaturedCarousel movies={featuredMovies} />}
      </div>


    </div>
  );
};
