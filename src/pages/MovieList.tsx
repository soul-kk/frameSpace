import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { Search, LayoutGrid, List as ListIcon, Filter } from 'lucide-react';
import anime from 'animejs';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from '../components/ui/MovieCard';
import { Movie } from '../types';
import { cn } from '../lib/utils';

export const MovieList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchMovies } = useMovies();

  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState(searchParams.get('category') || 'all');
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  const genres = [
    { id: 'all', label: '全部' },
    { id: '剧情', label: '剧情' },
    { id: '动作', label: '动作' },
    { id: '科幻', label: '科幻' },
    { id: '动画', label: '动画' },
    { id: '喜剧', label: '喜剧' },
    { id: '惊悚', label: '惊悚' },
    { id: '爱情', label: '爱情' },
    { id: '恐怖', label: '恐怖' },
  ];

  useEffect(() => {
    const genre = searchParams.get('category');
    if (genre) setActiveGenre(genre);
  }, [searchParams]);

  useEffect(() => {
    let result = searchMovies(searchQuery, {
      genre: activeGenre !== 'all' ? activeGenre : undefined
    });

    setFilteredMovies(result);
  }, [searchQuery, activeGenre, searchMovies]);

  const handleGenreChange = (genre: string) => {
    setActiveGenre(genre);
    setSearchParams(params => {
      if (genre === 'all') params.delete('category');
      else params.set('category', genre);
      return params;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <h1 className="text-5xl font-bold text-black mb-4 font-serif">电影收藏</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          我最爱的电影
        </p>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2">
              {genres.map(genre => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreChange(genre.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border-2",
                    activeGenre === genre.id
                      ? "bg-black text-white border-black"
                      : "bg-transparent text-gray-600 border-gray-200 hover:border-black hover:text-black"
                  )}
                >
                  {genre.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:min-w-[300px]">
                <input
                  type="text"
                  placeholder="搜索电影..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200">
                <button
                  onClick={() => setView('grid')}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    view === 'grid' ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    view === 'list' ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <ListIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6">
        {filteredMovies.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">未找到电影</h3>
            <p className="text-gray-500">请尝试调整搜索或筛选条件</p>
          </div>
        ) : (
          view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredMovies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredMovies.map((movie, index) => (
                <MovieListItem key={movie.id} movie={movie} index={index} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

const MovieListItem = ({ movie, index }: { movie: Movie; index: number }) => {
  // Use anime for entrance
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-all duration-300">
      <div className="w-full sm:w-48 h-64 sm:h-auto shrink-0">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between py-2">
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-2xl font-bold text-black">{movie.title}</h3>
            <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
              <span className="text-yellow-500">★</span>
              <span className="font-bold">{movie.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-500 mb-4">
            <span>{movie.year}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="capitalize">{movie.genre}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>{movie.duration ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` : 'N/A'}</span>
          </div>
          <p className="text-gray-600 line-clamp-3 mb-4">{movie.description}</p>
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-900">Director:</span> {movie.director}
          </p>
        </div>

        <div className="mt-4 sm:mt-0 pt-4 sm:pt-0">
          {/* Add link or button */}
        </div>
      </div>
    </div>
  );
};



