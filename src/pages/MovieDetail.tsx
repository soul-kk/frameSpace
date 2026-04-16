import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import {
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  Film,
  Hash,
  Copy,
  Check,
} from 'lucide-react'
import anime from 'animejs'

import { useMovies } from '../context/MovieContext'
import { cn } from '../lib/utils'

export const MovieDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { movies, loading } = useMovies()

  // Retrieve movie data
  const movie = movies.find(m => m.id == id)

  const posterRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Animation
    if (posterRef.current && infoRef.current) {
      anime({
        targets: posterRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        easing: 'easeOutExpo',
      })

      anime({
        targets: infoRef.current,
        opacity: [0, 1],
        translateX: [50, 0],
        duration: 800,
        delay: 200,
        easing: 'easeOutExpo',
      })
    }
  }, [id, movie]) // Run animation when id or movie changes (e.g. after loading)

  const handleCopyWatchUrl = async () => {
    if (movie?.watchUrl) {
      try {
        await navigator.clipboard.writeText(movie.watchUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 3000)
      } catch (err) {
        console.error('复制失败:', err)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl font-medium">Loading movie details...</div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Movie Not Found</h2>
          <Link to="/list" className="text-blue-600 hover:underline">
            Return to Movie List
          </Link>
        </div>
      </div>
    )
  }
  console.log(movie)

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      {/* Back Button */}
      <div className="mx-auto mb-4 max-w-7xl px-4 sm:mb-8 sm:px-6">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center space-x-2 text-gray-600 transition-colors hover:cursor-pointer hover:text-black"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span>返回电影列表</span>
        </button>
      </div>

      {/* Main Content */}
      <section className="mb-20">
        <div>
          {/* <iframe src="//player.bilibili.com/player.html?isOutside=true&aid=200291359&bvid=BV18z411B7mb&cid=178612454&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe> */}
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:gap-12 lg:grid-cols-3">
            {/* Poster */}
            <div className="flex flex-col items-center gap-6 lg:col-span-1">
              <div
                ref={posterRef}
                className="overflow-hidden rounded-2xl bg-white opacity-0 shadow-xl"
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Copy Watch URL Button */}
              {movie.watchUrl && (
                <button
                  onClick={handleCopyWatchUrl}
                  disabled={copied}
                  className={cn(
                    'w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 sm:px-6 sm:py-4 sm:text-base',
                    'shadow-lg transition-all duration-300 hover:shadow-xl',
                    'group flex items-center justify-center space-x-2',
                    'disabled:cursor-default disabled:bg-green-600',
                    !copied && 'cursor-pointer'
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span>已复制，请在浏览器中粘贴打开</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5 transition-transform group-hover:scale-110" />
                      <span>磁力下载链接</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Info */}
            <div className="lg:col-span-2">
              <div
                ref={infoRef}
                className="rounded-2xl bg-white p-4 opacity-0 shadow-xl sm:p-8"
              >
                <div className="mb-4 sm:mb-8">
                  <h1 className="mb-3 font-serif text-2xl font-bold text-black sm:mb-4 sm:text-4xl md:text-5xl">
                    {movie.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 sm:gap-4 sm:text-base">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{movie.year}</span>
                    </div>
                    <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                    <div className="flex items-center space-x-1">
                      <Film className="h-4 w-4" />
                      <span className="capitalize">
                        {movie.genre.join('·')}
                      </span>
                    </div>
                    <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                    <div className="flex items-center space-x-1 font-bold text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{movie.rating}</span>
                    </div>
                    {movie.duration && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {Math.floor(movie.duration / 60)}h{' '}
                            {movie.duration % 60}m
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-8">
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-gray-900 sm:mb-2 sm:text-lg">
                      导演
                    </h3>
                    <p className="text-sm text-gray-600 sm:text-base">{movie.director}</p>
                  </div>

                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-gray-900 sm:mb-2 sm:text-lg">
                      主演
                    </h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {movie.actors &&
                        movie.actors.map((actor, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 sm:px-3 sm:py-1 sm:text-sm"
                          >
                            {actor}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-gray-900 sm:mb-2 sm:text-lg">
                      剧情简介
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600 sm:text-lg">
                      {movie.description}
                    </p>
                  </div>

                  {movie.comment && (
                    <div className="rounded-r-xl border-l-4 border-black bg-gray-50 p-3 sm:p-6">
                      <h3 className="mb-2 flex items-center gap-2 font-serif text-sm font-bold text-black sm:mb-3 sm:text-lg">
                        <span>💬</span> kk's 观影笔记
                      </h3>
                      <p className="text-sm font-medium leading-relaxed text-gray-700 italic sm:text-lg">
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
  )
}
