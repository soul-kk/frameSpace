import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { ArrowLeft, Star, Clock, Calendar, Film, Hash } from 'lucide-react';
import anime from 'animejs';
import '@splidejs/react-splide/css';

import { useMovies } from '../context/MovieContext';
import { Movie } from '../types';

export const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMovieById, getRecommendations } = useMovies();
  
  // Retrieve movie data
  const movie = getMovieById(id!);
  const recommendations = id ? getRecommendations(id) : [];

  const posterRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animation
    if (posterRef.current && infoRef.current) {
      anime({
        targets: posterRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        easing: 'easeOutExpo'
      });

      anime({
        targets: infoRef.current,
        opacity: [0, 1],
        translateX: [50, 0],
        duration: 800,
        delay: 200,
        easing: 'easeOutExpo'
      });
    }
  }, [id]);

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Movie Not Found</h2>
          <Link to="/list" className="text-blue-600 hover:underline">Return to Movie List</Link>
        </div>
      </div>
    );
  }

  const splideOptions = {
    type: 'loop',
    perPage: 4,
    perMove: 1,
    gap: '1.5rem',
    pagination: false,
    breakpoints: {
      1024: { perPage: 3 },
      768: { perPage: 2 },
      640: { perPage: 1 },
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>返回电影列表</span>
        </button>
      </div>

      {/* Main Content */}
      <section className="mb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Poster */}
            <div className="lg:col-span-1">
              <div ref={posterRef} className="bg-white rounded-2xl shadow-xl overflow-hidden opacity-0">
                <img 
                  src={movie.poster} 
                  alt={movie.title} 
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-2">
              <div ref={infoRef} className="bg-white rounded-2xl shadow-xl p-8 opacity-0">
                <div className="mb-8">
                  <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 font-serif">{movie.title}</h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{movie.year}</span>
                    </div>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <div className="flex items-center space-x-1">
                      <Film className="w-4 h-4" />
                      <span className="capitalize">{movie.genre}</span>
                    </div>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <div className="flex items-center space-x-1 text-yellow-500 font-bold">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{movie.rating}</span>
                    </div>
                    {movie.duration && (
                      <>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">导演</h3>
                    <p className="text-gray-600">{movie.director}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">主演</h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.actors && movie.actors.map((actor, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                          {actor}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">剧情简介</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">{movie.description}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
                     <div>
                       <h4 className="text-sm font-medium text-gray-500 mb-1">上映年份</h4>
                       <p className="font-semibold text-gray-900">{movie.year}</p>
                     </div>
                     <div>
                       <h4 className="text-sm font-medium text-gray-500 mb-1">类型</h4>
                       <p className="font-semibold text-gray-900 capitalize">{movie.genre}</p>
                     </div>
                     <div>
                       <h4 className="text-sm font-medium text-gray-500 mb-1">评分</h4>
                       <div className="flex items-center space-x-1 text-yellow-500">
                         <Star className="w-4 h-4 fill-current" />
                         <span className="font-semibold text-gray-900">{movie.rating}/10</span>
                       </div>
                     </div>
                     <div>
                       <h4 className="text-sm font-medium text-gray-500 mb-1">电影ID</h4>
                       <div className="flex items-center space-x-1 text-gray-900">
                         <Hash className="w-3 h-3" />
                         <span className="font-semibold">{String(movie.id).padStart(3, '0')}</span>
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-black mb-4">猜你喜欢</h2>
                <p className="text-gray-600">根据您的兴趣发现更多电影</p>
            </div>

            <Splide options={splideOptions}>
              {recommendations.map(recMovie => (
                <SplideSlide key={recMovie.id}>
                   <Link to={`/detail/${recMovie.id}`} className="block group">
                     <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                       <div className="aspect-[2/3] overflow-hidden">
                         <img 
                           src={recMovie.poster} 
                           alt={recMovie.title} 
                           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                         />
                       </div>
                       <div className="p-4">
                         <h3 className="font-bold text-black mb-2 truncate">{recMovie.title}</h3>
                         <div className="flex items-center justify-between text-sm text-gray-600">
                           <span>{recMovie.year}</span>
                           <div className="flex items-center space-x-1 text-yellow-500">
                             <Star className="w-3 h-3 fill-current" />
                             <span>{recMovie.rating}</span>
                           </div>
                         </div>
                       </div>
                     </div>
                   </Link>
                </SplideSlide>
              ))}
            </Splide>
          </div>
        </section>
      )}
    </div>
  );
};

