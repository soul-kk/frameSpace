import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router';
import anime from 'animejs';
import { CinemaHero } from '../components/ui/CinemaHero';
import { FeaturedCarousel } from '../components/ui/FeaturedCarousel';
import { MovieCard } from '../components/ui/MovieCard';
import { useMovies } from '../context/MovieContext';

export const Home = () => {
  const { getFeaturedMovies, getAllMovies } = useMovies();
  const featuredMovies = getFeaturedMovies(5);
  // For popular movies grid, we can take top rated or random. Let's take top 8.
  const popularMovies = getFeaturedMovies(8);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen bg-white">
      <CinemaHero />

      {/* Featured Movies Carousel */}
      <div ref={carouselRef} className="opacity-0 max-w-7xl mx-auto px-6 -mt-10 relative z-20 mb-20">
        <FeaturedCarousel movies={featuredMovies} />
      </div>

      {/* Featured Grid */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">热门电影</h2>
            <p className="text-xl text-gray-600">收藏中最受欢迎的电影</p>
          </div>

          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {popularMovies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/list"
              className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 inline-block"
            >
              查看所有电影
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};



