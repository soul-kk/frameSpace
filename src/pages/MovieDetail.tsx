import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, Star, Clock, Calendar, Film, Hash, Copy, Check } from 'lucide-react';
import anime from 'animejs';

import { useMovies } from '../context/MovieContext';
import { cn } from '../lib/utils';

export const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { movies, loading } = useMovies();

  // Retrieve movie data
  const movie = movies.find(m => m.id == id);

  const posterRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

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
  }, [id, movie]); // Run animation when id or movie changes (e.g. after loading)

  const handleCopyWatchUrl = async () => {
    if (movie?.watchUrl) {
      try {
        await navigator.clipboard.writeText(movie.watchUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('复制失败:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-medium">Loading movie details...</div>
      </div>
    );
  }

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
  console.log(movie)

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 hover:cursor-pointer text-gray-600 hover:text-black transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>返回电影列表</span>
        </button>
      </div>

      {/* Main Content */}
      <section className="mb-20">
        <div>
          {/* <iframe src="//player.bilibili.com/player.html?isOutside=true&aid=200291359&bvid=BV18z411B7mb&cid=178612454&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe> */}
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Poster */}
            <div className="lg:col-span-1 flex flex-col items-center  gap-6">
              <div ref={posterRef} className="bg-white rounded-2xl shadow-xl overflow-hidden opacity-0">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Copy Watch URL Button */}
              {movie.watchUrl && (
                <button
                  onClick={handleCopyWatchUrl}
                  disabled={copied}
                  className={cn(
                    "w-full bg-black hover:bg-gray-800 text-white font-medium py-4 px-6 rounded-xl",
                    "shadow-lg hover:shadow-xl transition-all duration-300",
                    "flex items-center justify-center space-x-2 group",
                    "disabled:bg-green-600 disabled:cursor-default",
                    !copied && "cursor-pointer"
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>已复制到剪切板📋</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>磁力下载链接</span>
                    </>
                  )}
                </button>
              )}
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
                      <span className="capitalize">{movie.genre.join('·')}</span>
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

                  {movie.comment && (
                    <div className="bg-gray-50 border-l-4 border-black p-6 rounded-r-xl">
                      <h3 className="text-lg font-bold text-black mb-3 font-serif flex items-center gap-2">
                        <span>💬</span> kk's 观影笔记
                      </h3>
                      <p className="text-gray-700 italic text-lg leading-relaxed font-medium">
                        "{movie.comment}"
                      </p>
                    </div>
                  )}


                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
